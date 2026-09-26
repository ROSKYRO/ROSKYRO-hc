import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { haversineKm } from "@/lib/geo";
import { nid, waDigits } from "@/lib/utils";
import { ensureSeeded } from "./seed";
import type {
  BlogPost,
  CardItem,
  CmsPage,
  Doctor,
  Faq,
  SiteSettings,
  Step,
  TeamMember,
  Testimonial,
  Video,
} from "@/lib/types";

const hits = new Map<string, number[]>();

function rateLimit(key: string, max = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const prev = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (prev.length >= max) {
    throw new Error("Too many requests. Please wait a few minutes.");
  }
  prev.push(now);
  hits.set(key, prev);
}

async function settingsRow(): Promise<SiteSettings> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<SiteSettings>`select * from site_settings where id = 'singleton'`;
  const row = rows[0];
  if (!row) throw new Error("Site settings missing");
  return row;
}

function whatsappUrl(number: string, text: string) {
  const n = waDigits(number);
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

async function maybeEmail(subject: string, body: string) {
  const settings = await settingsRow();
  const host = process.env.SMTP_HOST?.trim();
  const to = settings.notify_email?.trim();
  if (!host || !to) return false;
  try {
    const { sendSmtpMail } = await import("@/lib/smtp");
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER?.trim() || "";
    const pass = process.env.SMTP_PASS?.trim() || "";
    const from = user || settings.email || to;
    await sendSmtpMail({
      host,
      port,
      user: user || undefined,
      pass: pass || undefined,
      from,
      to,
      subject: `[ROSKYRO] ${subject}`,
      text: body,
    });
    return true;
  } catch {
    return false;
  }
}

export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  const s = await settingsRow();
  return {
    id: s.id,
    brand: s.brand,
    tagline: s.tagline,
    hero_h1: s.hero_h1,
    hero_sub: s.hero_sub,
    hero_video_url: s.hero_video_url,
    hero_image_url: s.hero_image_url,
    favicon_url: s.favicon_url,
    address: s.address,
    phone: s.phone,
    whatsapp_number: s.whatsapp_number,
    email: s.email,
    footer_text: s.footer_text,
    stat_1_value: s.stat_1_value,
    stat_1_label: s.stat_1_label,
    stat_2_value: s.stat_2_value,
    stat_2_label: s.stat_2_label,
    stat_3_value: s.stat_3_value,
    stat_3_label: s.stat_3_label,
    gtm_container_id: s.gtm_container_id,
    og_image_url: s.og_image_url,
    meta_description: s.meta_description,
  };
});

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  const [settings, perks, care, testimonials, doctors] = await Promise.all([
    settingsRow(),
    sql<CardItem>`select * from perks where active = true order by ordering asc`,
    sql<CardItem>`select * from care_items where active = true order by ordering asc`,
    sql<Testimonial>`select * from testimonials where status = 'published' and audience = 'patient' order by created_at desc limit 3`,
    sql<Doctor>`select * from doctors where status = 'active' order by name asc limit 4`,
  ]);
  return { settings, perks, care, testimonials, doctors };
});

export const getDoctors = createServerFn({ method: "GET" })
  .validator(
    z.object({
      q: z.string().optional(),
      specialty: z.string().optional(),
      city: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<Doctor>`
      select * from doctors
      where status in ('active', 'on_leave')
      order by name asc
    `;
    const q = data.q?.trim().toLowerCase() ?? "";
    const specialty = data.specialty?.trim().toLowerCase() ?? "";
    const city = data.city?.trim().toLowerCase() ?? "";
    return rows.filter((d) => {
      if (q && !`${d.name} ${d.specialty} ${d.city}`.toLowerCase().includes(q)) return false;
      if (specialty && d.specialty.toLowerCase() !== specialty) return false;
      if (city && d.city.toLowerCase() !== city) return false;
      return true;
    });
  });

export const getDoctorsNearby = createServerFn({ method: "GET" })
  .validator(z.object({ lat: z.number(), lng: z.number() }))
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<Doctor>`
      select * from doctors
      where status in ('active', 'on_leave') and latitude is not null and longitude is not null
    `;
    return rows
      .map((d) => ({
        ...d,
        distance_km:
          d.latitude != null && d.longitude != null
            ? Math.round(haversineKm({ lat: data.lat, lng: data.lng }, { lat: d.latitude, lng: d.longitude }) * 10) / 10
            : null,
      }))
      .sort((a, b) => (a.distance_km ?? 9e9) - (b.distance_km ?? 9e9));
  });

export const getDoctorBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<Doctor>`select * from doctors where slug = ${data.slug} limit 1`;
    return rows[0] ?? null;
  });

export const getTestimonialsPage = createServerFn({ method: "GET" })
  .validator(
    z.object({
      audience: z.enum(["patient", "physician"]).default("patient"),
      page: z.number().int().min(1).default(1),
    }),
  )
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const all = await sql<Testimonial>`
      select * from testimonials
      where status = 'published' and audience = ${data.audience}
      order by created_at desc
    `;
    const pageSize = 9;
    const start = (data.page - 1) * pageSize;
    return {
      items: all.slice(start, start + pageSize),
      page: data.page,
      pageSize,
      total: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    };
  });

export const getBlogList = createServerFn({ method: "GET" })
  .validator(
    z.object({
      audience: z.enum(["patient", "physician"]).default("patient"),
      page: z.number().int().min(1).default(1),
    }),
  )
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const all = await sql<BlogPost>`
      select * from blog_posts
      where status = 'published' and audience = ${data.audience}
      order by published_at desc nulls last, created_at desc
    `;
    const pageSize = 6;
    const start = (data.page - 1) * pageSize;
    return {
      items: all.slice(start, start + pageSize),
      page: data.page,
      total: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    };
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<BlogPost>`
      select * from blog_posts where slug = ${data.slug} and status = 'published' limit 1
    `;
    const post = rows[0];
    if (!post) return null;
    const siblings = await sql<BlogPost>`
      select * from blog_posts
      where status = 'published' and audience = ${post.audience}
      order by published_at desc nulls last, created_at desc
    `;
    const idx = siblings.findIndex((p) => p.id === post.id);
    return {
      post,
      prev: idx > 0 ? siblings[idx - 1] : null,
      next: idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null,
    };
  });

export const getVideos = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  return sql<Video>`select * from videos where active = true order by ordering asc`;
});

export const getFaqs = createServerFn({ method: "GET" })
  .validator(z.object({ audience: z.enum(["patient", "physician"]) }))
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    return sql<Faq>`select * from faqs where audience = ${data.audience} order by ordering asc`;
  });

export const getPageBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<CmsPage>`select * from pages where slug = ${data.slug} limit 1`;
    return rows[0] ?? null;
  });

export const getTeam = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  return sql<TeamMember>`select * from team_members order by ordering asc`;
});

export const getPlans = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  return sql<CardItem>`select * from plans where active = true order by ordering asc`;
});

export const getSteps = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  return sql<Step>`select * from steps order by ordering asc`;
});

export const getPerksAndCare = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  const [perks, care] = await Promise.all([
    sql<CardItem>`select * from perks where active = true order by ordering asc`,
    sql<CardItem>`select * from care_items where active = true order by ordering asc`,
  ]);
  return { perks, care };
});

export const getSitemapPayload = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  const [doctors, posts] = await Promise.all([
    sql<{ slug: string; name: string }>`select slug, name from doctors where status in ('active','on_leave')`,
    sql<{ slug: string; title: string }>`select slug, title from blog_posts where status = 'published'`,
  ]);
  return { doctors, posts };
});

const appointmentSchema = z.object({
  doctor_id: z.string().optional(),
  patient_name: z.string().min(2).max(120),
  patient_phone: z.string().min(8).max(20),
  patient_email: z.string().email().optional().or(z.literal("")),
  preferred_date: z.string().optional(),
  preferred_time_slot: z.string().optional(),
  reason: z.string().min(4).max(2000),
  source: z.enum(["find_doctor", "contact", "other"]).default("find_doctor"),
});

export const createAppointment = createServerFn({ method: "POST" })
  .validator(appointmentSchema)
  .handler(async ({ data }) => {
    rateLimit(`appt:${data.patient_phone}`);
    await ensureSeeded();
    const sql = await getSql();
    const settings = await settingsRow();
    let doctorName = "";
    let doctorWhatsapp = "";
    if (data.doctor_id) {
      const docs = await sql<{ name: string; whatsapp_number: string }>`
        select name, whatsapp_number from doctors where id = ${data.doctor_id}`;
      doctorName = docs[0]?.name ?? "";
      doctorWhatsapp = docs[0]?.whatsapp_number ?? "";
    }
    // Prefer doctor's WhatsApp when available; otherwise clinic number from settings
    const targetNumber = doctorWhatsapp || settings.whatsapp_number;
    const id = nid("appt");
    const waLink = whatsappUrl(targetNumber, "placeholder");
    await sql.query(
      `insert into appointments (
        id, doctor_id, patient_name, patient_phone, patient_email, preferred_date,
        preferred_time_slot, reason, source, status, whatsapp_opened, notified
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'new', $10, false)`,
      [
        id,
        data.doctor_id || null,
        data.patient_name,
        data.patient_phone,
        data.patient_email || null,
        data.preferred_date || null,
        data.preferred_time_slot || null,
        data.reason,
        data.source,
        Boolean(waLink),
      ],
    );
    // Clean, patient-friendly WhatsApp message
    const summary = [
      "Hi ROSKYRO,",
      "",
      "I would like to request an appointment.",
      "",
      `Name: ${data.patient_name}`,
      `Phone: ${data.patient_phone}`,
      data.patient_email ? `Email: ${data.patient_email}` : null,
      doctorName ? `Doctor: ${doctorName}` : null,
      data.preferred_date ? `Preferred date: ${data.preferred_date}` : null,
      data.preferred_time_slot ? `Preferred time: ${data.preferred_time_slot}` : null,
      "",
      `Reason: ${data.reason}`,
      "",
      "Please get back to me. Thank you!",
    ]
      .filter((line) => line !== null)
      .join("\n");
    const sent = await maybeEmail("New appointment request", summary);
    if (sent) {
      await sql.query(`update appointments set notified = true where id = $1`, [id]);
    }
    return {
      id,
      whatsappUrl: whatsappUrl(targetNumber, summary),
    };
  });

const leadSchema = z.object({
  type: z.enum(["contact", "become_affiliate", "sell_practice", "do_not_sell"]),
  name: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
  email: z.string().email().optional().or(z.literal("")),
  payload: z.record(z.string(), z.string()).default({}),
});

export const createLead = createServerFn({ method: "POST" })
  .validator(leadSchema)
  .handler(async ({ data }) => {
    rateLimit(`lead:${data.phone}:${data.type}`);
    await ensureSeeded();
    const sql = await getSql();
    const settings = await settingsRow();
    const id = nid("lead");
    const targetNumber = settings.whatsapp_number;
    const waLink = whatsappUrl(targetNumber, "placeholder");
    await sql.query(
      `insert into leads (id, type, name, phone, email, status, whatsapp_opened, notified, payload)
       values ($1,$2,$3,$4,$5,'new', $6, false, $7::jsonb)`,
      [
        id,
        data.type,
        data.name,
        data.phone,
        data.email || "",
        Boolean(waLink),
        JSON.stringify(data.payload ?? {}),
      ],
    );
    const extra = Object.entries(data.payload ?? {})
      .filter(([, v]) => v && String(v).trim())
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join("\n");
    const labels: Record<string, string> = {
      contact: "Contact message",
      become_affiliate: "Affiliate enquiry",
      sell_practice: "Sell practice enquiry",
      do_not_sell: "Do-not-sell request",
    };
    const greeting: Record<string, string> = {
      contact: "Hi ROSKYRO, I have a question / message:",
      become_affiliate: "Hi ROSKYRO, I am interested in becoming an affiliate.",
      sell_practice: "Hi ROSKYRO, I would like to discuss selling my practice.",
      do_not_sell: "Hi ROSKYRO, please process my do-not-sell request.",
    };
    const summary = [
      greeting[data.type] ?? "Hi ROSKYRO,",
      "",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.email ? `Email: ${data.email}` : null,
      extra ? `\n${extra}` : null,
      "",
      "Please get back to me. Thank you!",
    ]
      .filter((line) => line !== null)
      .join("\n");
    const sent = await maybeEmail(labels[data.type] ?? "New lead", summary);
    if (sent) await sql.query(`update leads set notified = true where id = $1`, [id]);
    return { id, whatsappUrl: whatsappUrl(targetNumber, summary) };
  });

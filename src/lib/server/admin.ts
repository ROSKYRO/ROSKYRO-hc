import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { geocodeNominatim } from "@/lib/geo";
import { nid, slugify } from "@/lib/utils";
import { ensureSeeded } from "./seed";
import type {
  Appointment,
  BlogPost,
  CardItem,
  CmsPage,
  Doctor,
  Faq,
  InboxItem,
  Lead,
  SiteSettings,
  Staff,
  StaffRole,
  Step,
  TeamMember,
  Testimonial,
  Video,
} from "@/lib/types";

class ForbiddenError extends Error {
  readonly status = 403;
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

async function authUser(userId: string) {
  const sql = await getSql();
  const rows = await sql.query<{ email: string; name: string }>(
    `select email, name from "user" where id = $1`,
    [userId],
  );
  return rows[0] ?? { email: "", name: "Staff" };
}

export async function requireStaff(userId: string, roles?: StaffRole[]): Promise<Staff> {
  await ensureSeeded();
  const sql = await getSql();
  const auth = await authUser(userId);
  const email = (auth.email || "").toLowerCase();

  if (email) {
    await sql.query(
      `update admin_staff
       set user_id = $1, last_login_at = now(), updated_at = now()
       where lower(email) = $2 and active = true and (user_id is null or user_id = $1)`,
      [userId, email],
    );
  }

  let rows = await sql<Staff>`
    select * from admin_staff where user_id = ${userId} and active = true limit 1
  `;

  if (!rows[0]) {
    const count = await sql<{ n: number }>`select count(*)::int as n from admin_staff`;
    if ((count[0]?.n ?? 0) === 0) {
      const id = nid("staff");
      await sql.query(
        `insert into admin_staff (id, user_id, name, email, role, active, last_login_at)
         values ($1,$2,$3,$4,'super_admin', true, now())`,
        [id, userId, auth.name || "Founder", email || `${userId}@roskyro.local`],
      );
      rows = await sql<Staff>`select * from admin_staff where id = ${id}`;
    }
  }

  const staff = rows[0];
  if (!staff) throw new ForbiddenError();
  if (roles && !roles.includes(staff.role)) throw new ForbiddenError();
  return staff;
}

async function logActivity(
  staff: Staff,
  action: string,
  entityType: string,
  entityId: string,
  detail = "",
) {
  const sql = await getSql();
  await sql.query(
    `insert into activity_log (id, user_id, action, entity_type, entity_id, detail)
     values ($1,$2,$3,$4,$5,$6)`,
    [nid("log"), staff.user_id, action, entityType, entityId, detail],
  );
}

export const getStaffMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => requireStaff(context.userId));

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    const [appts, leads, doctors, posts, unreadA, unreadL] = await Promise.all([
      sql<{ n: number }>`select count(*)::int as n from appointments`,
      sql<{ n: number }>`select count(*)::int as n from leads`,
      sql<{ n: number }>`select count(*)::int as n from doctors`,
      sql<{ n: number }>`select count(*)::int as n from blog_posts`,
      sql<{ n: number }>`select count(*)::int as n from appointments where status = 'new'`,
      sql<{ n: number }>`select count(*)::int as n from leads where status = 'new'`,
    ]);
    const recent = await sql<{ id: string; action: string; entity_type: string; detail: string; created_at: string }>`
      select id, action, entity_type, detail, created_at from activity_log order by created_at desc limit 8
    `;
    return {
      appointments: appts[0]?.n ?? 0,
      leads: leads[0]?.n ?? 0,
      doctors: doctors[0]?.n ?? 0,
      posts: posts[0]?.n ?? 0,
      unread: (unreadA[0]?.n ?? 0) + (unreadL[0]?.n ?? 0),
      recent,
    };
  });

export const getInbox = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      status: z.string().optional(),
      type: z.string().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    const appts = await sql<Appointment & { doctor_name: string | null }>`
      select a.*, d.name as doctor_name
      from appointments a
      left join doctors d on d.id = a.doctor_id
      order by a.created_at desc
    `;
    const leads = await sql<Lead>`select * from leads order by created_at desc`;
    const items: InboxItem[] = [
      ...appts.map((a) => ({
        kind: "appointment" as const,
        id: a.id,
        title: a.patient_name,
        subtitle: [a.doctor_name, a.patient_phone, a.preferred_date].filter(Boolean).join(" · "),
        status: a.status,
        created_at: a.created_at,
        whatsapp_opened: a.whatsapp_opened,
        notified: a.notified,
        type: "appointment",
      })),
      ...leads.map((l) => ({
        kind: "lead" as const,
        id: l.id,
        title: l.name,
        subtitle: [l.type.replaceAll("_", " "), l.phone].filter(Boolean).join(" · "),
        status: l.status,
        created_at: l.created_at,
        whatsapp_opened: l.whatsapp_opened,
        notified: l.notified,
        type: l.type,
      })),
    ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    return items.filter((item) => {
      if (data.status && item.status !== data.status) return false;
      if (data.type && data.type !== "all" && item.type !== data.type) return false;
      return true;
    });
  });

export const getInboxDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ kind: z.enum(["appointment", "lead"]), id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    if (data.kind === "appointment") {
      const rows = await sql<Appointment>`select * from appointments where id = ${data.id}`;
      return { kind: "appointment" as const, row: rows[0] ?? null };
    }
    const rows = await sql<Lead>`select * from leads where id = ${data.id}`;
    const row = rows[0];
    if (row) {
      let parsed: Record<string, string> = {};
      const raw = row.payload as unknown;
      if (typeof raw === "string") {
        try {
          const obj = JSON.parse(raw) as Record<string, unknown>;
          for (const [k, v] of Object.entries(obj)) parsed[k] = String(v ?? "");
        } catch {
          parsed = {};
        }
      } else if (raw && typeof raw === "object") {
        for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
          parsed[k] = String(v ?? "");
        }
      }
      row.payload = parsed;
    }
    return { kind: "lead" as const, row: row ?? null };
  });

const patchInboxSchema = z.object({
  kind: z.enum(["appointment", "lead"]),
  id: z.string(),
  status: z.enum(["new", "contacted", "confirmed", "cancelled", "completed"]).optional(),
  notes: z.string().optional(),
  assigned_to: z.string().nullable().optional(),
});

export const patchInbox = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(patchInboxSchema)
  .handler(async ({ context, data }) => {
    const staff = await requireStaff(context.userId, ["super_admin", "admin", "editor"]);
    const sql = await getSql();
    const table = data.kind === "appointment" ? "appointments" : "leads";
    if (data.status) {
      await sql.query(`update ${table} set status = $1 where id = $2`, [data.status, data.id]);
    }
    if (data.notes != null) {
      await sql.query(`update ${table} set notes = $1 where id = $2`, [data.notes, data.id]);
    }
    if (data.assigned_to !== undefined) {
      await sql.query(`update ${table} set assigned_to = $1 where id = $2`, [data.assigned_to, data.id]);
    }
    await logActivity(staff, "update", table, data.id, data.status ?? "notes");
    return { ok: true };
  });

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId, ["super_admin", "admin"]);
    const sql = await getSql();
    const rows = await sql<SiteSettings>`select * from site_settings where id = 'singleton'`;
    return rows[0];
  });

export const saveAdminSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])))
  .handler(async ({ context, data }) => {
    const staff = await requireStaff(context.userId, ["super_admin", "admin"]);
    const sql = await getSql();
    const allowed = [
      "brand",
      "tagline",
      "hero_h1",
      "hero_sub",
      "hero_video_url",
      "hero_image_url",
      "favicon_url",
      "address",
      "phone",
      "whatsapp_number",
      "email",
      "footer_text",
      "stat_1_value",
      "stat_1_label",
      "stat_2_value",
      "stat_2_label",
      "stat_3_value",
      "stat_3_label",
      "gtm_container_id",
      "og_image_url",
      "meta_description",
      "notify_email",
    ];
    const sets: string[] = [];
    const vals: unknown[] = [];
    for (const key of allowed) {
      if (key in data) {
        vals.push(data[key] ?? "");
        sets.push(`${key} = $${vals.length}`);
      }
    }
    if (sets.length) {
      await sql.query(`update site_settings set ${sets.join(", ")} where id = 'singleton'`, vals);
    }
    await logActivity(staff, "update", "site_settings", "singleton");
    return { ok: true };
  });

export const listDoctorsAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    return sql<Doctor>`select * from doctors order by name asc`;
  });

const doctorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  specialty: z.string().min(2),
  city: z.string().min(2),
  address_line: z.string().min(4),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  phone: z.string().optional(),
  whatsapp_number: z.string().optional(),
  photo_url: z.string().optional(),
  bio: z.string().optional(),
  years_experience: z.number().int().nullable().optional(),
  languages_spoken: z.string().optional(),
  education: z.string().optional(),
  status: z.enum(["active", "on_leave", "inactive"]).default("active"),
  autolocate: z.boolean().optional(),
});

export const saveDoctor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(doctorSchema)
  .handler(async ({ context, data }) => {
    const staff = await requireStaff(context.userId);
    const sql = await getSql();
    let lat = data.latitude ?? null;
    let lng = data.longitude ?? null;
    if (data.autolocate || lat == null || lng == null) {
      const geo = await geocodeNominatim(`${data.address_line}, ${data.city}, India`);
      if (geo) {
        lat = geo.lat;
        lng = geo.lng;
      } else if (lat == null || lng == null) {
        return {
          ok: false as const,
          error: "Could not locate this address — enter coordinates manually",
        };
      }
    }
    const slug = slugify(data.name);
    if (data.id) {
      await sql.query(
        `update doctors set
          slug=$2, name=$3, specialty=$4, city=$5, address_line=$6, latitude=$7, longitude=$8,
          phone=$9, whatsapp_number=$10, photo_url=$11, bio=$12, years_experience=$13,
          languages_spoken=$14, education=$15, status=$16, updated_at=now()
         where id=$1`,
        [
          data.id,
          slug,
          data.name,
          data.specialty,
          data.city,
          data.address_line,
          lat,
          lng,
          data.phone ?? "",
          data.whatsapp_number ?? "",
          data.photo_url ?? "",
          data.bio ?? "",
          data.years_experience ?? null,
          data.languages_spoken ?? "",
          data.education ?? "",
          data.status,
        ],
      );
      await logActivity(staff, "update", "doctors", data.id);
      return { ok: true as const, id: data.id, slug, latitude: lat, longitude: lng };
    }
    const id = nid("doc");
    await sql.query(
      `insert into doctors (
        id, slug, name, specialty, city, address_line, latitude, longitude, phone, whatsapp_number,
        photo_url, bio, years_experience, languages_spoken, education, status
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        id,
        slug,
        data.name,
        data.specialty,
        data.city,
        data.address_line,
        lat,
        lng,
        data.phone ?? "",
        data.whatsapp_number ?? "",
        data.photo_url ?? "",
        data.bio ?? "",
        data.years_experience ?? null,
        data.languages_spoken ?? "",
        data.education ?? "",
        data.status,
      ],
    );
    await logActivity(staff, "create", "doctors", id);
    return { ok: true as const, id, slug, latitude: lat, longitude: lng };
  });

export const deleteDoctor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const staff = await requireStaff(context.userId, ["super_admin", "admin"]);
    const sql = await getSql();
    await sql.query(`delete from doctors where id = $1`, [data.id]);
    await logActivity(staff, "delete", "doctors", data.id);
    return { ok: true };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId, ["super_admin"]);
    const sql = await getSql();
    return sql<Staff>`select * from admin_staff order by created_at asc`;
  });

export const saveStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().optional(),
      name: z.string().min(2),
      email: z.string().email(),
      role: z.enum(["super_admin", "admin", "editor"]),
      active: z.boolean().default(true),
    }),
  )
  .handler(async ({ context, data }) => {
    const me = await requireStaff(context.userId, ["super_admin"]);
    const sql = await getSql();
    if (data.id) {
      await sql.query(
        `update admin_staff set name=$2, email=$3, role=$4, active=$5, updated_at=now() where id=$1`,
        [data.id, data.name, data.email.toLowerCase(), data.role, data.active],
      );
      await logActivity(me, "update", "users", data.id);
      return { ok: true, id: data.id };
    }
    const id = nid("staff");
    await sql.query(
      `insert into admin_staff (id, name, email, role, active) values ($1,$2,$3,$4,$5)`,
      [id, data.name, data.email.toLowerCase(), data.role, data.active],
    );
    await logActivity(me, "create", "users", id, data.email);
    return { ok: true, id };
  });

export const listAssignees = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    return sql<{ id: string; name: string }>`
      select id, name from admin_staff where active = true order by name asc
    `;
  });

export const listActivity = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    return sql<{
      id: string;
      user_id: string | null;
      action: string;
      entity_type: string;
      entity_id: string | null;
      detail: string;
      created_at: string;
    }>`select * from activity_log order by created_at desc limit 200`;
  });

type TableName =
  | "testimonials"
  | "blog_posts"
  | "videos"
  | "pages"
  | "team_members"
  | "perks"
  | "care_items"
  | "plans"
  | "faqs"
  | "steps";

const TABLE_COLUMNS: Record<TableName, readonly string[]> = {
  testimonials: [
    "member_name",
    "photo_url",
    "rating",
    "text",
    "full_text",
    "source",
    "audience",
    "external_url",
    "status",
  ],
  blog_posts: [
    "slug",
    "audience",
    "title",
    "excerpt",
    "body",
    "cover_image_url",
    "author_id",
    "status",
    "published_at",
    "meta_title",
    "meta_description",
    "updated_at",
  ],
  videos: ["title", "embed_url", "thumbnail_url", "ordering", "active"],
  pages: ["slug", "title", "body", "image_url", "meta_title", "meta_description"],
  team_members: ["name", "role", "photo_url", "bio", "ordering"],
  perks: ["title", "text", "image_url", "ordering", "active"],
  care_items: ["title", "text", "image_url", "ordering", "active"],
  plans: ["title", "text", "image_url", "ordering", "active"],
  faqs: ["question", "answer", "audience", "ordering"],
  steps: ["title", "text", "ordering"],
};

const BOOL_KEYS = new Set(["active"]);
const NUM_KEYS = new Set(["ordering", "rating"]);
const NULL_KEYS = new Set(["full_text", "external_url", "author_id", "published_at", "photo_url"]);

function coerce(table: TableName, key: string, value: unknown) {
  if (BOOL_KEYS.has(key)) return Boolean(value);
  if (NUM_KEYS.has(key)) {
    if (value === "" || value == null) return key === "rating" ? null : 0;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  if (NULL_KEYS.has(key) && (value === "" || value == null)) return null;
  if (table === "blog_posts" && key === "updated_at") return new Date().toISOString();
  return value ?? "";
}

export const adminList = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      table: z.enum([
        "testimonials",
        "blog_posts",
        "videos",
        "pages",
        "team_members",
        "perks",
        "care_items",
        "plans",
        "faqs",
        "steps",
      ]),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    const table = data.table as TableName;
    const order =
      table === "blog_posts"
        ? "created_at desc"
        : table === "testimonials"
          ? "created_at desc"
          : table === "pages"
            ? "title asc"
            : "ordering asc";
    return sql.query<Record<string, string | number | boolean | null>>(
      `select * from ${table} order by ${order}`,
    );
  });

export const adminSave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      table: z.enum([
        "testimonials",
        "blog_posts",
        "videos",
        "pages",
        "team_members",
        "perks",
        "care_items",
        "plans",
        "faqs",
        "steps",
      ]),
      id: z.string().optional(),
      row: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
    }),
  )
  .handler(async ({ context, data }) => {
    const staff = await requireStaff(context.userId);
    const sql = await getSql();
    const table = data.table as TableName;
    const allowed = new Set(TABLE_COLUMNS[table]);
    const row = { ...data.row };
    if (table === "blog_posts" && typeof row.title === "string" && !row.slug) {
      row.slug = slugify(row.title);
    }
    if (table === "blog_posts" && row.status === "published" && !row.published_at) {
      row.published_at = new Date().toISOString();
    }
    const keys = Object.keys(row).filter((k) => allowed.has(k));
    if (!keys.length) return { ok: false as const, error: "No valid fields" };
    if (data.id) {
      const sets = keys.map((k, i) => `${k} = $${i + 2}`);
      await sql.query(`update ${table} set ${sets.join(", ")} where id = $1`, [
        data.id,
        ...keys.map((k) => coerce(table, k, row[k])),
      ]);
      await logActivity(staff, "update", table, data.id);
      return { ok: true, id: data.id };
    }
    const id = nid(table.slice(0, 4));
    const cols = ["id", ...keys];
    const placeholders = cols.map((_, i) => `$${i + 1}`);
    await sql.query(`insert into ${table} (${cols.join(",")}) values (${placeholders.join(",")})`, [
      id,
      ...keys.map((k) => coerce(table, k, row[k])),
    ]);
    await logActivity(staff, "create", table, id);
    return { ok: true, id };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      table: z.enum([
        "testimonials",
        "blog_posts",
        "videos",
        "pages",
        "team_members",
        "perks",
        "care_items",
        "plans",
        "faqs",
        "steps",
      ]),
      id: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    const staff = await requireStaff(context.userId, ["super_admin", "admin"]);
    const sql = await getSql();
    await sql.query(`delete from ${data.table} where id = $1`, [data.id]);
    await logActivity(staff, "delete", data.table, data.id);
    return { ok: true };
  });

export type {
  Appointment,
  BlogPost,
  CardItem,
  CmsPage,
  Doctor,
  Faq,
  Lead,
  SiteSettings,
  Staff,
  Step,
  TeamMember,
  Testimonial,
  Video,
};

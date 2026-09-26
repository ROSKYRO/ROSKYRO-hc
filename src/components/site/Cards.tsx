import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  ClipboardList,
  Clock,
  HeartPulse,
  MapPin,
  Phone,
  Pill,
  Plane,
  Shield,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Portrait } from "./Portrait";
import { Badge } from "@/components/ui/badge";
import type { CardItem, Doctor, Testimonial } from "@/lib/types";

const PERK_ICONS: Record<string, LucideIcon> = {
  "Same-day visits": Clock,
  "A number that answers": Phone,
  "No waiting room theatre": Bell,
  "Hospital advocacy": Shield,
  "One chart, years long": ClipboardList,
  "Care that travels": Plane,
  "Annual deep-dive": Stethoscope,
  "Acute illness": HeartPulse,
  "Chronic disease": HeartPulse,
  "Medicines, reconciled": Pill,
  "Family care": Users,
  "Second opinions": ClipboardList,
};

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      to="/doctors/$slug"
      params={{ slug: doctor.slug }}
      className="group flex flex-col overflow-hidden rounded-[28px] border border-line bg-paper transition-transform duration-150 hover:-translate-y-0.5"
    >
      <Portrait
        src={doctor.photo_url}
        alt={doctor.name}
        name={doctor.name}
        className="aspect-[4/5] w-full"
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-xl">{doctor.name}</p>
        <p className="mt-1 text-sm text-copper">{doctor.specialty}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-3.5" />
          {doctor.city}
          {doctor.distance_km != null ? ` · ${doctor.distance_km} km` : ""}
        </p>
        {doctor.status === "on_leave" ? (
          <Badge className="mt-3 w-fit">On leave</Badge>
        ) : null}
      </div>
    </Link>
  );
}

export function TestimonialCard({ item }: { item: Testimonial }) {
  const [open, setOpen] = useState(false);
  const extra = item.full_text && item.full_text !== item.text;
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-line bg-paper p-6">
      <div className="flex items-center gap-3">
        <Portrait
          src={item.photo_url}
          alt={item.member_name}
          name={item.member_name}
          className="size-12 rounded-full"
        />
        <div>
          <p className="font-medium">{item.member_name}</p>
          {item.rating ? (
            <p className="text-xs text-copper" aria-label={`${item.rating} out of 5`}>
              {"●".repeat(item.rating)}
              {"○".repeat(5 - item.rating)}
            </p>
          ) : null}
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
        {open && extra ? item.full_text : item.text}
      </p>
      {extra ? (
        <button
          type="button"
          className="mt-4 self-start text-sm font-medium text-navy underline-offset-4 hover:underline"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Show less" : "Read more"}
        </button>
      ) : null}
    </article>
  );
}

export function PerkCard({ item }: { item: CardItem }) {
  const Icon = PERK_ICONS[item.title];
  return (
    <article className="rounded-[24px] border border-line bg-paper p-6">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt=""
          className="mb-4 h-28 w-full rounded-[16px] object-cover"
          loading="lazy"
        />
      ) : Icon ? (
        <Icon className="mb-4 size-5 text-navy" aria-hidden />
      ) : null}
      <h3 className="font-display text-xl">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
    </article>
  );
}

export function SectionHead({
  kicker,
  title,
  lede,
}: {
  kicker?: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      {kicker ? (
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">{kicker}</p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
      {lede ? <p className="mt-3 text-ink-soft">{lede}</p> : null}
    </div>
  );
}

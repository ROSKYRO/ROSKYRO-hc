import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { SiteShell } from "@/components/site/SiteHeader";
import { AppointmentForm } from "@/components/site/Forms";
import { DoctorCard } from "@/components/site/Cards";
import { DoctorMap } from "@/components/site/DoctorMap";
import { Portrait } from "@/components/site/Portrait";
import { Button } from "@/components/ui/button";
import { renderMarkdown } from "@/lib/markdown";
import { citySlug } from "@/lib/city";
import { getDoctorBySlug, getDoctors, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/doctors/$slug")({
  loader: async ({ params }) => {
    const [settings, doctor] = await Promise.all([
      getPublicSettings(),
      getDoctorBySlug({ data: { slug: params.slug } }),
    ]);
    const sameCity = doctor ? await getDoctors({ data: { city: doctor.city } }) : [];
    const related = sameCity.filter((d) => d.id !== doctor?.id).slice(0, 3);
    return { settings, doctor, related };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doctor;
    if (!d) return { meta: [{ title: "Physician not found | ROSKYRO" }] };
    const description = `${d.name} is a ${d.specialty} in ${d.city}${
      d.years_experience ? ` with ${d.years_experience} years of experience` : ""
    }. See their profile and request a visit.`;
    return {
      meta: [
        { title: `${d.name}, ${d.specialty} in ${d.city} | ROSKYRO` },
        { name: "description", content: description.slice(0, 158) },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            name: d.name,
            description: d.specialty,
            image: d.photo_url || undefined,
            telephone: d.phone || undefined,
            knowsLanguage: d.languages_spoken
              ? d.languages_spoken.split(/[,;/]/).map((x) => x.trim()).filter(Boolean)
              : undefined,
            address: {
              "@type": "PostalAddress",
              streetAddress: d.address_line || undefined,
              addressLocality: d.city,
              addressCountry: "IN",
            },
          }),
        },
      ],
    };
  },
  component: DoctorProfile,
});

const splitList = (s: string, re: RegExp) =>
  s
    .split(re)
    .map((x) => x.trim())
    .filter(Boolean);

function DoctorProfile() {
  const { settings, doctor, related } = Route.useLoaderData();
  if (!doctor) {
    return (
      <SiteShell settings={settings}>
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h1 className="font-display text-4xl">Physician not found</h1>
          <Link to="/our-doctors" className="mt-4 inline-block text-navy underline">
            Back to the directory
          </Link>
        </div>
      </SiteShell>
    );
  }

  const education = splitList(doctor.education ?? "", /[;\n]/);
  const languages = splitList(doctor.languages_spoken ?? "", /[,;/]/);
  const wa = (doctor.whatsapp_number ?? "").replace(/\D/g, "");
  const directions =
    doctor.latitude != null && doctor.longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`
      : doctor.address_line
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${doctor.address_line}, ${doctor.city}`,
          )}`
        : null;

  return (
    <SiteShell settings={settings}>
      <div className="pb-24 lg:pb-0">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
              <Link to="/find-a-doctor" className="underline underline-offset-4 hover:text-navy">
                Find a doctor
              </Link>{" "}
              /{" "}
              <Link
                to="/doctors-in/$city"
                params={{ city: citySlug(doctor.city) }}
                className="underline underline-offset-4 hover:text-navy"
              >
                {doctor.city}
              </Link>{" "}
              / {doctor.name}
            </nav>
            <Portrait
              src={doctor.photo_url}
              alt={doctor.name}
              name={doctor.name}
              className="aspect-[4/5] w-full max-w-md rounded-[28px]"
            />
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-copper">
              {doctor.specialty}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">{doctor.name}</h1>
            <p className="mt-2 text-ink-soft">
              {doctor.city}
              {doctor.years_experience ? ` · ${doctor.years_experience} years` : ""}
            </p>
            <div
              className="prose-site mt-8"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(doctor.bio) }}
            />

            {education.length > 0 ? (
              <section className="mt-8">
                <h2 className="font-display text-2xl">Education</h2>
                <ul className="mt-3 space-y-1.5 text-ink-soft">
                  {education.map((e) => (
                    <li key={e} className="flex gap-2">
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-copper" aria-hidden />
                      {e}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {languages.length > 0 ? (
              <section className="mt-8">
                <h2 className="font-display text-2xl">Languages</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <li
                      key={l}
                      className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm"
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="mt-8 rounded-[24px] border border-line bg-paper p-6">
              <h2 className="font-display text-2xl">Practice information</h2>
              {doctor.address_line ? (
                <p className="mt-3 flex items-start gap-3 text-ink-soft">
                  <MapPin className="mt-1 size-5 shrink-0 text-navy" aria-hidden />
                  <span>
                    {doctor.address_line}, {doctor.city}
                  </span>
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                {directions ? (
                  <Button asChild variant="outline">
                    <a href={directions} target="_blank" rel="noreferrer">
                      <Navigation className="size-4" /> Directions
                    </a>
                  </Button>
                ) : null}
                {doctor.phone ? (
                  <Button asChild variant="outline">
                    <a href={`tel:${doctor.phone.replace(/\s/g, "")}`}>
                      <Phone className="size-4" /> Call
                    </a>
                  </Button>
                ) : null}
                {wa ? (
                  <Button asChild variant="outline">
                    <a
                      href={`https://wa.me/${wa}?text=${encodeURIComponent(
                        `Hi, I would like to request a visit with ${doctor.name}.`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-4" /> WhatsApp
                    </a>
                  </Button>
                ) : null}
              </div>
            </section>

            {doctor.latitude != null && doctor.longitude != null ? (
              <div className="mt-6">
                <DoctorMap lat={doctor.latitude} lng={doctor.longitude} name={doctor.name} />
              </div>
            ) : null}
          </div>

          <div id="request" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <AppointmentForm doctorId={doctor.id} doctorName={doctor.name} />
            <p className="mt-3 text-xs text-muted">
              Not for emergencies. In an emergency call 112 or go to the nearest hospital.
            </p>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
            <h2 className="font-display text-3xl">More physicians in {doctor.city}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-line bg-paper/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        {doctor.phone ? (
          <Button asChild variant="outline" className="flex-1">
            <a href={`tel:${doctor.phone.replace(/\s/g, "")}`}>
              <Phone className="size-4" /> Call
            </a>
          </Button>
        ) : null}
        <Button asChild className="flex-1">
          <a href="#request">Request a visit</a>
        </Button>
      </div>
    </SiteShell>
  );
}

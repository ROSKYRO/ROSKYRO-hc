import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { AppointmentForm } from "@/components/site/Forms";
import { DoctorMap } from "@/components/site/DoctorMap";
import { Portrait } from "@/components/site/Portrait";
import { renderMarkdown } from "@/lib/markdown";
import { getDoctorBySlug, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/doctors/$slug")({
  loader: async ({ params }) => {
    const [settings, doctor] = await Promise.all([
      getPublicSettings(),
      getDoctorBySlug({ data: { slug: params.slug } }),
    ]);
    return { settings, doctor };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.doctor?.name ?? "Doctor"} — ROSKYRO` },
      {
        name: "description",
        content: loaderData?.doctor
          ? `${loaderData.doctor.specialty} in ${loaderData.doctor.city}. ${loaderData.doctor.education}`
          : "Physician profile",
      },
    ],
  }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const { settings, doctor } = Route.useLoaderData();
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

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
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
          <dl className="mt-8 grid gap-4 text-sm">
            <div>
              <dt className="text-muted">Education</dt>
              <dd>{doctor.education}</dd>
            </div>
            <div>
              <dt className="text-muted">Languages</dt>
              <dd>{doctor.languages_spoken}</dd>
            </div>
            <div>
              <dt className="text-muted">Clinic</dt>
              <dd>{doctor.address_line}</dd>
            </div>
          </dl>
          {doctor.latitude != null && doctor.longitude != null ? (
            <div className="mt-8">
              <DoctorMap lat={doctor.latitude} lng={doctor.longitude} name={doctor.name} />
            </div>
          ) : null}
        </div>
        <div>
          <AppointmentForm doctorId={doctor.id} doctorName={doctor.name} />
        </div>
      </div>
    </SiteShell>
  );
}

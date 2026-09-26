import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { DoctorCard } from "@/components/site/Cards";
import { getDoctors, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/our-doctors")({
  loader: async () => {
    const [settings, doctors] = await Promise.all([getPublicSettings(), getDoctors({ data: {} })]);
    return { settings, doctors };
  },
  head: () => ({
    meta: [
      { title: "Our doctors — ROSKYRO" },
      { name: "description", content: "The ROSKYRO physician panel across Indian cities." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, doctors } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Our doctors</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          A closed panel on purpose. If the city you need is full, we will say so.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

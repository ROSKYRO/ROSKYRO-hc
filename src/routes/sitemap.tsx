import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { getPublicSettings, getSitemapPayload } from "@/lib/server/public";

const staticLinks: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/find-a-doctor", label: "Find a doctor" },
  { to: "/about-concierge-care", label: "About concierge care" },
  { to: "/member-benefits", label: "Member benefits" },
  { to: "/our-doctors", label: "Our doctors" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/blog", label: "Member blog" },
  { to: "/member-faq", label: "Member FAQ" },
  { to: "/what-is-concierge-medicine", label: "What is concierge medicine" },
  { to: "/why-concierge-medicine", label: "Why concierge medicine" },
  { to: "/affiliate-benefits", label: "Affiliate benefits" },
  { to: "/transition", label: "Transition" },
  { to: "/success-stories", label: "Success stories" },
  { to: "/video-library", label: "Video library" },
  { to: "/become-an-affiliate", label: "Become an affiliate" },
  { to: "/for-doctors/blog", label: "Physician blog" },
  { to: "/physician-faq", label: "Physician FAQ" },
  { to: "/sell-your-practice", label: "Sell your practice" },
  { to: "/member-programs", label: "Member programs" },
  { to: "/our-mission", label: "Our mission" },
  { to: "/our-team", label: "Meet the team" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact us" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/non-discrimination", label: "Non-discrimination" },
  { to: "/do-not-sell", label: "Do not sell" },
];

export const Route = createFileRoute("/sitemap")({
  loader: async () => {
    const [settings, extra] = await Promise.all([getPublicSettings(), getSitemapPayload()]);
    return { settings, extra };
  },
  head: () => ({ meta: [{ title: "Site map — ROSKYRO" }] }),
  component: Page,
});

function Page() {
  const { settings, extra } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl">Site map</h1>
        <ul className="mt-8 columns-1 gap-8 sm:columns-2">
          {staticLinks.map((l) => (
            <li key={l.to} className="mb-2">
              <Link to={l.to as never} className="text-navy hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 font-display text-2xl">Doctors</h2>
        <ul className="mt-3">
          {extra.doctors.map((d) => (
            <li key={d.slug}>
              <Link to="/doctors/$slug" params={{ slug: d.slug }} className="text-navy hover:underline">
              {d.name ?? d.slug}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 font-display text-2xl">Blog</h2>
        <ul className="mt-3">
          {extra.posts.map((p) => (
            <li key={p.slug}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="text-navy hover:underline">
                {p.title ?? p.slug}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SiteShell>
  );
}

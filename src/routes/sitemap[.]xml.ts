import { createFileRoute } from "@tanstack/react-router";
import { getDoctors, getSitemapPayload } from "@/lib/server/public";
import { citySlug } from "@/lib/city";

const staticPaths = [
  "/",
  "/find-a-doctor",
  "/about-concierge-care",
  "/member-benefits",
  "/our-doctors",
  "/testimonials",
  "/blog",
  "/member-faq",
  "/what-is-concierge-medicine",
  "/why-concierge-medicine",
  "/affiliate-benefits",
  "/transition",
  "/success-stories",
  "/video-library",
  "/become-an-affiliate",
  "/for-doctors/blog",
  "/physician-faq",
  "/sell-your-practice",
  "/member-programs",
  "/our-mission",
  "/our-team",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/non-discrimination",
  "/do-not-sell",
  "/sitemap",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const extra = await getSitemapPayload();
        const allDoctors = await getDoctors({ data: {} });
        const citySlugs = [...new Set(allDoctors.map((d) => citySlug(d.city)))];
        const urls = [
          ...staticPaths,
          ...citySlugs.map((c) => `/doctors-in/${c}`),
          ...extra.doctors.map((d) => `/doctors/${d.slug}`),
          ...extra.posts.map((p) => `/blog/${p.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${origin}${u}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(xml, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});

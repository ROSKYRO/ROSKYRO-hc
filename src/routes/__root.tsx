import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AppNotFoundComponent } from "@/lib/not-found-component";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { getPublicSettings } from "@/lib/server/public";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  loader: async () => {
    try {
      const settings = await getPublicSettings();
      return { settings };
    } catch {
      return {
        settings: {
          id: "singleton",
          brand: "ROSKYRO",
          tagline: "Healthcare concierge",
          hero_h1: "A physician who has time for you.",
          hero_sub: "",
          hero_video_url: "",
          hero_image_url: "/images/hero.jpg",
          favicon_url: "/logo.png",
          address: "",
          phone: "",
          whatsapp_number: "",
          email: "",
          footer_text: "ROSKYRO Healthcare Concierge",
          stat_1_value: "",
          stat_1_label: "",
          stat_2_value: "",
          stat_2_label: "",
          stat_3_value: "",
          stat_3_label: "",
          gtm_container_id: "",
          og_image_url: "",
          meta_description:
            "ROSKYRO is a concierge medicine practice in India.",
        },
      };
    }
  },
  head: ({ loaderData }) => {
    const s = loaderData?.settings;
    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { title: s?.brand ? `${s.brand} — Healthcare Concierge` : "ROSKYRO" },
        { name: "description", content: s?.meta_description ?? "" },
        { name: "theme-color", content: "#1B3A4B" },
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        ...(s?.favicon_url && s.favicon_url !== "/favicon.svg"
          ? [{ rel: "icon" as const, href: s.favicon_url }]
          : []),
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,650&display=swap",
        },
      ],
    };
  },
  component: RootDocument,
  notFoundComponent: AppNotFoundComponent,
});

function RootDocument() {
  const { settings } = Route.useLoaderData();
  const gtm = settings.gtm_container_id?.trim();

  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        {gtm ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
            }}
          />
        ) : null}
      </head>
      <body>
        <PreviewHostBridge />
        {gtm ? (
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

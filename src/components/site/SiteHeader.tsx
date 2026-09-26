import { type ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/site/BrandMark";
import type { SiteSettings } from "@/lib/types";
import { cn, waDigits } from "@/lib/utils";

function clinicWhatsAppUrl(settings: SiteSettings, text?: string) {
  const n = waDigits(settings.whatsapp_number || "");
  if (!n) return null;
  const base = `https://wa.me/${n}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const patientLinks = [
  { to: "/about-concierge-care", label: "About concierge care" },
  { to: "/member-benefits", label: "Member benefits" },
  { to: "/our-doctors", label: "Our doctors" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/blog", label: "Blog" },
  { to: "/member-faq", label: "Member FAQ" },
];

const doctorLinks = [
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
];

const aboutLinks = [
  { to: "/our-mission", label: "Our mission" },
  { to: "/our-team", label: "Meet the team" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact us" },
];

function Dropdown({
  label,
  items,
}: {
  label: string;
  items: { to: string; label: string }[];
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex h-11 items-center gap-1 text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
      >
        {label}
        <ChevronDown className="size-3.5" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 rounded-[16px] border border-line bg-paper p-2 opacity-0 shadow-soft transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to as never}
            className="block rounded-[10px] px-3 py-2 text-sm text-ink-soft hover:bg-canvas hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md safe-top">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <BrandMark className="size-10" />
          <span className="font-display text-lg tracking-tight text-ink sm:text-xl">
            {settings.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
          <Link to="/find-a-doctor" className="text-sm font-medium text-ink-soft hover:text-ink">
            Find a doctor
          </Link>
          <Link to="/become-an-affiliate" className="text-sm font-medium text-ink-soft hover:text-ink">
            Partner with us
          </Link>
          <Dropdown label="For patients" items={patientLinks} />
          <Dropdown label="For doctors" items={doctorLinks} />
          <Link to="/member-programs" className="text-sm font-medium text-ink-soft hover:text-ink">
            Member programs
          </Link>
          <Dropdown label="About" items={aboutLinks} />
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/find-a-doctor">Request a visit</Link>
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[10px] lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-canvas px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            <Link to="/find-a-doctor" className="py-3 text-base" onClick={() => setOpen(false)}>
              Find a doctor
            </Link>
            <Link to="/become-an-affiliate" className="py-3 text-base" onClick={() => setOpen(false)}>
              Partner with us
            </Link>
            <p className="pt-3 text-xs font-medium uppercase tracking-wider text-muted">Patients</p>
            {patientLinks.map((l) => (
              <Link key={l.to} to={l.to} className="py-2 text-ink-soft" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <p className="pt-3 text-xs font-medium uppercase tracking-wider text-muted">Doctors</p>
            {doctorLinks.map((l) => (
              <Link key={l.to} to={l.to} className="py-2 text-ink-soft" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link to="/member-programs" className="py-3" onClick={() => setOpen(false)}>
              Member programs
            </Link>
            {aboutLinks.map((l) => (
              <Link key={l.to} to={l.to} className="py-2 text-ink-soft" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto border-t border-line bg-navy text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <BrandMark className="size-12" onPaper />
            <div>
              <p className="font-display text-xl">{settings.brand}</p>
              <p className="text-sm text-paper/70">{settings.tagline}</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/75">
            {settings.footer_text}
          </p>
          <p className="mt-4 text-sm text-paper/75">
            {settings.address}
            <br />
            {settings.phone}
            <br />
            {settings.email}
          </p>
          {clinicWhatsAppUrl(settings) ? (
            <a
              href={clinicWhatsAppUrl(settings, "Hi ROSKYRO, I would like to enquire.")!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#1da851]"
            >
              Chat on WhatsApp
            </a>
          ) : null}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-paper/50">Practice</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/find-a-doctor" className="hover:underline">Find a doctor</Link></li>
            <li><Link to="/member-programs" className="hover:underline">Member programs</Link></li>
            <li><Link to="/our-team" className="hover:underline">Team</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-paper/50">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:underline">Privacy policy</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms of use</Link></li>
            <li><Link to="/non-discrimination" className="hover:underline">Non-discrimination</Link></li>
            <li><Link to="/do-not-sell" className="hover:underline">Do not sell request</Link></li>
            <li><Link to="/sitemap" className="hover:underline">Site map</Link></li>
            <li><Link to="/login" className="hover:underline">Staff</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({
  settings,
  children,
  className,
}: {
  settings: SiteSettings;
  children: ReactNode;
  className?: string;
}) {
  const waUrl = clinicWhatsAppUrl(
    settings,
    "Hi ROSKYRO, I would like to enquire about membership / a doctor.",
  );
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <SiteHeader settings={settings} />
      <main className={cn("flex-1", className)}>{children}</main>
      <SiteFooter settings={settings} />
      {waUrl ? (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1da851] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}

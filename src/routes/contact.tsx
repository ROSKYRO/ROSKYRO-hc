import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { SiteShell } from "@/components/site/SiteHeader";
import { LeadForm } from "@/components/site/Forms";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/contact")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Contact ROSKYRO: membership, physicians, billing" },
      {
        name: "description",
        content:
          "Contact ROSKYRO. Choose a topic and your message goes to the right person: membership, physician partnership, billing or a general question.",
      },
    ],
  }),
  component: Page,
});

const HEARD_FROM = [
  "Google search",
  "Instagram",
  "Facebook",
  "WhatsApp",
  "A doctor told me",
  "Friend or family",
  "Newspaper or hoarding",
  "Other",
];

type Topic = {
  id: string;
  label: string;
  type: "contact" | "become_affiliate";
  title: string;
  intro: string;
  extra: { name: string; label: string; required?: boolean; options?: string[] }[];
  messageLabel: string;
  messageRequired: boolean;
};

const TOPICS: Topic[] = [
  {
    id: "member",
    label: "I want to become a member",
    type: "contact",
    title: "Membership enquiry",
    intro: "Tell us where you are and we will point you to the right physician.",
    extra: [
      { name: "city", label: "City", required: true },
      { name: "preferred_doctor", label: "Doctor you are interested in (if any)" },
      { name: "heard_from", label: "How did you hear about us?", options: HEARD_FROM },
    ],
    messageLabel: "Questions or comments (optional)",
    messageRequired: false,
  },
  {
    id: "physician",
    label: "I am a physician",
    type: "become_affiliate",
    title: "Physician enquiry",
    intro: "A person from our team will call you. No brochure.",
    extra: [
      { name: "nmc_registration", label: "Medical council registration number", required: true },
      { name: "specialty", label: "Specialty", required: true },
      { name: "city", label: "City", required: true },
      { name: "clinic_name", label: "Current clinic / hospital" },
      { name: "heard_from", label: "How did you hear about us?", options: HEARD_FROM },
    ],
    messageLabel: "Anything you want us to know (optional)",
    messageRequired: false,
  },
  {
    id: "billing",
    label: "Billing or my membership",
    type: "contact",
    title: "Billing and membership",
    intro: "Include your doctor’s name so we can find your account quickly.",
    extra: [
      { name: "doctor_name", label: "Your doctor’s name", required: true },
      { name: "invoice_number", label: "Invoice or receipt number (if you have one)" },
    ],
    messageLabel: "How can we help?",
    messageRequired: true,
  },
  {
    id: "general",
    label: "Something else",
    type: "contact",
    title: "General enquiry",
    intro: "Ask us anything about ROSKYRO.",
    extra: [
      { name: "city", label: "City" },
      { name: "heard_from", label: "How did you hear about us?", options: HEARD_FROM },
    ],
    messageLabel: "Your question",
    messageRequired: true,
  },
];

function Page() {
  const settings = Route.useLoaderData();
  const [topicId, setTopicId] = useState(TOPICS[0].id);
  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];
  const wa = (settings.whatsapp_number ?? "").replace(/\D/g, "");

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">How can we help you?</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
            Choose a topic and your message goes to the right person.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            {settings.phone ? (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="flex min-h-11 items-center gap-3 hover:text-navy"
              >
                <Phone className="size-5 text-navy" aria-hidden />
                {settings.phone}
              </a>
            ) : null}
            {wa ? (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-3 hover:text-navy"
              >
                <MessageCircle className="size-5 text-navy" aria-hidden />
                Chat on WhatsApp
              </a>
            ) : null}
            {settings.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="flex min-h-11 items-center gap-3 hover:text-navy"
              >
                <Mail className="size-5 text-navy" aria-hidden />
                {settings.email}
              </a>
            ) : null}
            {settings.address ? (
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden />
                <span className="leading-relaxed">{settings.address}</span>
              </p>
            ) : null}
          </div>

          <p className="mt-8 rounded-[16px] border border-line bg-paper p-4 text-sm text-ink-soft">
            This form is not for emergencies. In an emergency call 112 or go to the nearest
            hospital.
          </p>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <label htmlFor="contact-topic" className="mb-2 block text-sm font-medium">
            Tell us why you are here
          </label>
          <select
            id="contact-topic"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="mb-4 h-12 w-full rounded-[12px] border border-line bg-paper px-4 text-base"
          >
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          <LeadForm
            key={topic.id}
            type={topic.type}
            title={topic.title}
            intro={topic.intro}
            extra={topic.extra}
            messageLabel={topic.messageLabel}
            messageRequired={topic.messageRequired}
            fixedPayload={{ topic: topic.label }}
          />
        </div>
      </div>
    </SiteShell>
  );
}

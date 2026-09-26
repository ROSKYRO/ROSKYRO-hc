import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { createAppointment, createLead } from "@/lib/server/public";
import type { LeadType } from "@/lib/types";

/** Open a wa.me link reliably (works better than window.open on mobile). */
function openWhatsApp(url: string) {
  if (!url) return;
  try {
    // Preferred: temporary anchor click (less likely to be blocked)
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    // Fallback
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function Status({ message, tone }: { message: string; tone: "ok" | "err" }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={tone === "ok" ? "text-sm text-forest" : "text-sm text-danger"}
    >
      {message}
    </p>
  );
}

type Notice = { text: string; tone: "ok" | "err"; whatsappUrl?: string | null };

export function AppointmentForm({
  doctorId,
  doctorName,
}: {
  doctorId?: string;
  doctorName?: string;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<Notice | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setPending(true);
    setMessage(null);
    try {
      const result = await createAppointment({
        data: {
          doctor_id: doctorId,
          patient_name: String(fd.get("name") ?? ""),
          patient_phone: String(fd.get("phone") ?? ""),
          patient_email: String(fd.get("email") ?? ""),
          preferred_date: String(fd.get("date") ?? "") || undefined,
          preferred_time_slot: String(fd.get("slot") ?? "") || undefined,
          reason: String(fd.get("reason") ?? ""),
          source: "find_doctor",
        },
      });
      // Always open WhatsApp for the patient
      if (result.whatsappUrl) {
        openWhatsApp(result.whatsappUrl);
      }
      setMessage({
        text: result.whatsappUrl
          ? "Request saved. WhatsApp is opening with your details filled in — just tap Send."
          : "Request saved. Our team will contact you shortly.",
        tone: "ok",
        whatsappUrl: result.whatsappUrl,
      });
      form.reset();
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Could not send the request.",
        tone: "err",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[28px] border border-line bg-paper p-6 sm:p-8">
      <div>
        <h2 className="font-display text-2xl">
          {doctorName ? `Request a visit with ${doctorName}` : "Request an appointment"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          We save your request, then open WhatsApp with a ready-to-send message to the clinic.
          Just tap <strong>Send</strong> on WhatsApp.
        </p>
      </div>
      <Field label="Full name" htmlFor="patient-name">
        <Input id="patient-name" name="name" required autoComplete="name" />
      </Field>
      <Field label="Phone" htmlFor="patient-phone">
        <Input id="patient-phone" name="phone" type="tel" required autoComplete="tel" />
      </Field>
      <Field label="Email (optional)" htmlFor="patient-email">
        <Input id="patient-email" name="email" type="email" autoComplete="email" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preferred date" htmlFor="patient-date">
          <Input id="patient-date" name="date" type="date" />
        </Field>
        <Field label="Time of day" htmlFor="patient-slot">
          <select
            id="patient-slot"
            name="slot"
            className="h-11 w-full rounded-[10px] border border-line bg-paper px-3.5 text-base"
            defaultValue="Morning"
          >
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </Field>
      </div>
      <Field label="Reason for visit" htmlFor="patient-reason">
        <Textarea id="patient-reason" name="reason" required rows={4} />
      </Field>
      {message ? <Status message={message.text} tone={message.tone} /> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {message?.tone === "ok" && message.whatsappUrl ? (
          <Button asChild className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1da851] text-white border-0">
            <a href={message.whatsappUrl} target="_blank" rel="noopener noreferrer">
              Open WhatsApp &amp; Send
            </a>
          </Button>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Preparing WhatsApp…" : "Send on WhatsApp"}
        </Button>
      </div>
      <p className="text-xs text-muted">
        Your request is also saved in our system. WhatsApp is the fastest way for the team to see it.
      </p>
    </form>
  );
}

export function LeadForm({
  type,
  title,
  intro,
  extra,
}: {
  type: LeadType;
  title: string;
  intro: string;
  extra?: { name: string; label: string; required?: boolean; textarea?: boolean }[];
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<Notice | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, string> = {};
    for (const field of extra ?? []) {
      payload[field.name] = String(fd.get(field.name) ?? "");
    }
    payload.message = String(fd.get("message") ?? "");
    setPending(true);
    setMessage(null);
    try {
      const result = await createLead({
        data: {
          type,
          name: String(fd.get("name") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          email: String(fd.get("email") ?? ""),
          payload,
        },
      });
      // Always open WhatsApp for the patient
      if (result.whatsappUrl) {
        openWhatsApp(result.whatsappUrl);
      }
      setMessage({
        text: result.whatsappUrl
          ? "Saved. WhatsApp is opening with your message ready — just tap Send."
          : "Saved. Our team will contact you shortly.",
        tone: "ok",
        whatsappUrl: result.whatsappUrl,
      });
      form.reset();
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Could not send.",
        tone: "err",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[28px] border border-line bg-paper p-6 sm:p-8">
      <div>
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-muted">
          {intro} We open WhatsApp with a pre-filled message — just tap <strong>Send</strong>.
        </p>
      </div>
      <Field label="Full name" htmlFor="lead-name">
        <Input id="lead-name" name="name" required autoComplete="name" />
      </Field>
      <Field label="Phone" htmlFor="lead-phone">
        <Input id="lead-phone" name="phone" type="tel" required autoComplete="tel" />
      </Field>
      <Field label="Email" htmlFor="lead-email">
        <Input id="lead-email" name="email" type="email" autoComplete="email" />
      </Field>
      {(extra ?? []).map((field) => (
        <Field key={field.name} label={field.label} htmlFor={`lead-${field.name}`}>
          {field.textarea ? (
            <Textarea id={`lead-${field.name}`} name={field.name} required={field.required} />
          ) : (
            <Input id={`lead-${field.name}`} name={field.name} required={field.required} />
          )}
        </Field>
      ))}
      <Field label="Message" htmlFor="lead-message">
        <Textarea id="lead-message" name="message" rows={5} required />
      </Field>
      {message ? <Status message={message.text} tone={message.tone} /> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {message?.tone === "ok" && message.whatsappUrl ? (
          <Button asChild className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1da851] text-white border-0">
            <a href={message.whatsappUrl} target="_blank" rel="noopener noreferrer">
              Open WhatsApp &amp; Send
            </a>
          </Button>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Preparing WhatsApp…" : "Send on WhatsApp"}
        </Button>
      </div>
      <p className="text-xs text-muted">
        Your message is also saved in our system. WhatsApp is the fastest way to reach the team.
      </p>
    </form>
  );
}

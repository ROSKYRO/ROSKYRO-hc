import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { ImageField } from "@/components/admin/ImageField";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { getAdminSettings, saveAdminSettings } from "@/lib/server/admin";
import type { SiteSettings } from "@/lib/types";

export const Route = createFileRoute("/admin/settings")({ component: Page });

const fields: { key: keyof SiteSettings; label: string; area?: boolean }[] = [
  { key: "brand", label: "Brand" },
  { key: "tagline", label: "Tagline" },
  { key: "hero_h1", label: "Hero heading" },
  { key: "hero_sub", label: "Hero subtext", area: true },
  { key: "hero_video_url", label: "Hero video URL" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp_number", label: "WhatsApp (E.164)" },
  { key: "email", label: "Email" },
  { key: "notify_email", label: "Notify email" },
  { key: "footer_text", label: "Footer text", area: true },
  { key: "stat_1_value", label: "Stat 1 value" },
  { key: "stat_1_label", label: "Stat 1 label" },
  { key: "stat_2_value", label: "Stat 2 value" },
  { key: "stat_2_label", label: "Stat 2 label" },
  { key: "stat_3_value", label: "Stat 3 value" },
  { key: "stat_3_label", label: "Stat 3 label" },
  { key: "gtm_container_id", label: "GTM container ID" },
  { key: "meta_description", label: "Meta description", area: true },
];

function Page() {
  const [row, setRow] = useState<SiteSettings | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    void getAdminSettings().then(setRow);
  }, []);
  if (!row) return <p>Loading…</p>;
  return (
    <form
      className="max-w-2xl space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await saveAdminSettings({
          data: row as unknown as Record<string, string | number | boolean | null>,
        });
        setMsg("Saved. Public pages update on the next load.");
      }}
    >
      <h1 className="font-display text-3xl">Site settings</h1>
      <ImageField
        label="Hero image"
        value={row.hero_image_url}
        onChange={(u) => setRow({ ...row, hero_image_url: u })}
      />
      <ImageField
        label="Favicon"
        value={row.favicon_url}
        onChange={(u) => setRow({ ...row, favicon_url: u })}
      />
      <ImageField
        label="OG image"
        value={row.og_image_url}
        onChange={(u) => setRow({ ...row, og_image_url: u })}
      />
      {fields.map((f) => (
        <div key={f.key}>
          <Label>{f.label}</Label>
          {f.area ? (
            <Textarea
              value={String(row[f.key] ?? "")}
              onChange={(e) => setRow({ ...row, [f.key]: e.target.value })}
            />
          ) : (
            <Input
              value={String(row[f.key] ?? "")}
              onChange={(e) => setRow({ ...row, [f.key]: e.target.value })}
            />
          )}
          {f.key === "hero_video_url" && row.hero_video_url ? (
            <div className="mt-3">
              <VideoEmbed url={row.hero_video_url} title="Hero video preview" />
            </div>
          ) : null}
        </div>
      ))}
      {msg ? <p className="text-sm text-forest">{msg}</p> : null}
      <Button type="submit">Save settings</Button>
    </form>
  );
}

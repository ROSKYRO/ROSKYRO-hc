import { useState } from "react";
import { Label } from "@/components/ui/input";
import { uploadImage } from "@/lib/server/uploads";

const FALLBACK_MAX_BYTES = 900_000; // base64-in-DB path (no object storage configured)
const UPLOAD_MAX_BYTES = 5_000_000; // real object-storage path

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);

  async function readFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > UPLOAD_MAX_BYTES) {
      setError("Please choose an image under 5MB.");
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
        reader.readAsDataURL(file);
      });

      try {
        // Preferred path: real file storage (Vercel Blob), if configured.
        const res = await uploadImage({ data: { dataUrl, filename: file.name } });
        onChange(res.url);
      } catch {
        // Fallback: no object storage configured (or the upload failed) — keep
        // working via inline base64, same as before, capped smaller since it
        // lands directly in the database row.
        if (file.size > FALLBACK_MAX_BYTES) {
          setError(
            "This image is too large for the fallback storage. Please choose an image under 900KB, or ask an admin to set up file storage (Vercel Blob).",
          );
          return;
        }
        onChange(dataUrl);
      }
    } catch {
      setError("Could not read that file. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      <label
        className={`mt-1 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed px-3 py-4 text-center text-sm ${
          over ? "border-navy bg-canvas" : "border-line bg-paper"
        } ${busy ? "pointer-events-none opacity-60" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const file = e.dataTransfer.files[0];
          if (file) void readFile(file);
        }}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void readFile(file);
          }}
        />
        <span className="text-ink-soft">
          {busy ? "Uploading…" : "Drop an image or choose a file"}
        </span>
      </label>
      {error ? (
        <p className="mt-1 text-sm text-danger" role="status">
          {error}
        </p>
      ) : null}
      {value ? (
        <img src={value} alt="" className="mt-2 h-24 rounded-[12px] object-cover" />
      ) : null}
    </div>
  );
}

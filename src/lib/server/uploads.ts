import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

/**
 * Real object storage for admin-uploaded images (doctor photos, hero image,
 * favicon, blog/CMS images, etc.), added on top of the original base64-in-DB
 * approach.
 *
 * Off by default — enable it by attaching a Vercel Blob store to the project
 * (Vercel dashboard -> Storage -> Blob -> Connect), which injects
 * `BLOB_READ_WRITE_TOKEN` automatically. Nothing else needs to change: when
 * the token is missing, `ImageField` falls back to the original inline
 * base64 behaviour (see `src/components/admin/ImageField.tsx`), so this is a
 * pure upgrade, not a breaking change.
 */
export const blobStorageEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

const MAX_UPLOAD_BYTES = 5_000_000; // 5MB — well above the old 900KB base64 cap

export const uploadImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      dataUrl: z.string().min(1),
      filename: z.string().min(1).max(200),
    }),
  )
  .handler(async ({ data }) => {
    if (!blobStorageEnabled) {
      throw new Error("Object storage is not configured (BLOB_READ_WRITE_TOKEN missing).");
    }

    const match = /^data:([^;]+);base64,(.+)$/.exec(data.dataUrl);
    if (!match) throw new Error("Invalid image data.");
    const [, contentType, base64] = match;
    if (!contentType.startsWith("image/")) throw new Error("Please choose an image file.");

    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength > MAX_UPLOAD_BYTES) {
      throw new Error("Please choose an image under 5MB.");
    }

    const { put } = await import("@vercel/blob");
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "image";
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const blob = await put(key, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });

    return { url: blob.url };
  });

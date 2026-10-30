import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/admin-auth";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX = 5 * 1024 * 1024;

// Vercel'da fayl tizimi vaqtinchalik — rasm Vercel Blob'ga yoziladi (BLOB_READ_WRITE_TOKEN).
// Token bo'lmasa (lokal yoki o'z server), uploads/ papkasiga saqlanadi.
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "Fayl topilmadi" }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: "Faqat JPG, PNG yoki WEBP" }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: "Rasm 5 MB dan oshmasin" }, { status: 400 });

  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;

  // Blob ulangan: eski usulda token, yangi usulda BLOB_STORE_ID (Vercel OIDC orqali)
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
    const blob = await put(`courses/${name}`, file, { access: "public", contentType: file.type });
    return Response.json({ url: blob.url });
  }

  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ url: `/uploads/${name}` });
}

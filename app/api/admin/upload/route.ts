import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isAdmin } from "@/lib/admin-auth";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX = 5 * 1024 * 1024;

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "Fayl topilmadi" }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: "Faqat JPG, PNG yoki WEBP" }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: "Rasm 5 MB dan oshmasin" }, { status: 400 });

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ url: `/uploads/${name}` });
}

import { readFile } from "fs/promises";
import path from "path";

// Admin yuklagan rasmlarni beradi (build'dan keyin qo'shilgan fayllar public/ orqali chiqmaydi)
const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(_req: Request, { params }: RouteContext<"/uploads/[name]">) {
  const { name } = await params;
  if (!/^[\w-]+\.(jpg|png|webp)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(process.cwd(), "uploads", name));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": MIME[name.split(".").pop()!], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

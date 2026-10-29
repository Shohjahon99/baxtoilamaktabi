import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { botLoginUrl } from "@/lib/telegram";

export async function POST() {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_BOT_USERNAME) {
    return Response.json({ error: "Telegram bot hali sozlanmagan" }, { status: 503 });
  }
  const code = randomBytes(16).toString("hex");
  await db.loginToken.create({ data: { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) } });
  // kod shu brauzerga bog'lanadi: poll faqat shu cookie bilan ishlaydi
  (await cookies()).set("bo_login", code, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
  return Response.json({ url: botLoginUrl(code) });
}

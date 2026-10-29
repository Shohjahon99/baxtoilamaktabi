import { handleUpdate } from "@/lib/telegram";

export async function POST(request: Request) {
  if (request.headers.get("x-telegram-bot-api-secret-token") !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  try {
    await handleUpdate(await request.json());
  } catch (e) {
    console.error("telegram webhook", e);
  }
  return Response.json({ ok: true });
}

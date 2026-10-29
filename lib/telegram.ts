// Telegram bot mantiqi. Webhook (/api/telegram/webhook) va dev polling skripti
// (scripts/bot-dev.ts) ikkalasi ham handleUpdate() ni chaqiradi.
import { db } from "./db";

const API = () => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetch(`${API()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function botLoginUrl(code: string) {
  return `https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=login_${code}`;
}

type TgUser = { id: number; first_name: string; last_name?: string; username?: string };
type Update = {
  message?: {
    chat: { id: number };
    from?: TgUser;
    text?: string;
    contact?: { phone_number: string; user_id?: number; first_name: string; last_name?: string };
  };
  callback_query?: { id: string; from: TgUser; data?: string; message?: { chat: { id: number }; message_id: number } };
};

async function findPendingToken(code: string) {
  const token = await db.loginToken.findUnique({ where: { code } });
  if (!token || token.status !== "PENDING" || token.expiresAt < new Date()) return null;
  return token;
}

async function askConfirm(chatId: number, code: string) {
  await tg("sendMessage", {
    chat_id: chatId,
    text:
      "🔐 Siz «Baxt oila online maktabi» saytiga kirmoqdasiz.\n\n" +
      "Agar kirishni hozir o'zingiz boshlagan bo'lsangiz, tasdiqlang. Boshqa birov yuborgan havola bo'lsa — bosmang!",
    reply_markup: { inline_keyboard: [[{ text: "✅ Kirishni tasdiqlash", callback_data: `confirm:${code}` }]] },
  });
}

export async function handleUpdate(update: Update) {
  const msg = update.message;

  if (msg?.text?.startsWith("/start")) {
    const chatId = msg.chat.id;
    const arg = msg.text.split(" ")[1] ?? "";
    if (!arg.startsWith("login_")) {
      await tg("sendMessage", {
        chat_id: chatId,
        text: `Assalomu alaykum! «Baxt oila online maktabi» botiga xush kelibsiz.\n\nKurslarni ko'rish va o'qish uchun saytga kiring: ${process.env.APP_URL}`,
      });
      return;
    }
    const token = await findPendingToken(arg.slice(6));
    if (!token) {
      await tg("sendMessage", { chat_id: chatId, text: "⏳ Havolaning muddati tugagan. Saytda «Telegram orqali kirish» tugmasini qaytadan bosing." });
      return;
    }
    await db.loginToken.update({ where: { id: token.id }, data: { chatId: String(chatId) } });

    const existing = await db.user.findUnique({ where: { telegramId: String(msg.from?.id) } });
    if (existing?.phone) {
      await askConfirm(chatId, token.code);
    } else {
      await tg("sendMessage", {
        chat_id: chatId,
        text: "Ro'yxatdan o'tish uchun pastdagi tugma orqali telefon raqamingizni yuboring 👇",
        reply_markup: {
          keyboard: [[{ text: "📱 Telefon raqamni yuborish", request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }
    return;
  }

  if (msg?.contact && msg.from) {
    const chatId = msg.chat.id;
    // faqat o'z raqamini yuborishi mumkin
    if (msg.contact.user_id !== msg.from.id) {
      await tg("sendMessage", { chat_id: chatId, text: "Iltimos, tugma orqali o'zingizning raqamingizni yuboring." });
      return;
    }
    const telegramId = String(msg.from.id);
    const phone = msg.contact.phone_number.startsWith("+") ? msg.contact.phone_number : `+${msg.contact.phone_number}`;
    await db.user.upsert({
      where: { telegramId },
      create: {
        telegramId,
        phone,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        username: msg.from.username,
      },
      update: { phone, username: msg.from.username },
    });
    await tg("sendMessage", { chat_id: chatId, text: "✅ Raqamingiz qabul qilindi.", reply_markup: { remove_keyboard: true } });

    const token = await db.loginToken.findFirst({
      where: { chatId: String(chatId), status: "PENDING", expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (token) await askConfirm(chatId, token.code);
    return;
  }

  const cb = update.callback_query;
  if (cb?.data?.startsWith("confirm:")) {
    const token = await findPendingToken(cb.data.slice(8));
    const user = await db.user.findUnique({ where: { telegramId: String(cb.from.id) } });
    if (!token || !user || token.chatId !== String(cb.from.id)) {
      await tg("answerCallbackQuery", { callback_query_id: cb.id, text: "Havola eskirgan. Saytda qaytadan urinib ko'ring.", show_alert: true });
      return;
    }
    await db.loginToken.update({ where: { id: token.id }, data: { status: "CONFIRMED", userId: user.id } });
    await tg("answerCallbackQuery", { callback_query_id: cb.id, text: "Tasdiqlandi!" });
    if (cb.message) {
      await tg("editMessageText", {
        chat_id: cb.message.chat.id,
        message_id: cb.message.message_id,
        text: "✅ Kirish tasdiqlandi. Saytga qayting — sahifa o'zi ochiladi.",
      });
    }
  }
}

// Foydalanuvchiga xabar (sertifikat berilganda, to'lov o'tganda)
export async function notifyUser(telegramId: string | null, text: string) {
  if (!telegramId || !process.env.TELEGRAM_BOT_TOKEN || telegramId.startsWith("dev-")) return;
  try {
    await tg("sendMessage", { chat_id: telegramId, text });
  } catch {
    // xabar yetmasa ham asosiy jarayon to'xtamasin
  }
}

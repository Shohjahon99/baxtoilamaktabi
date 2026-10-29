// Lokal dev uchun: webhook o'rniga getUpdates (long polling) orqali botni ishlatadi.
// Ishga tushirish: npm run bot:dev
import { handleUpdate, tg } from "../lib/telegram";

async function main() {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN .env da yo'q");
  await tg("deleteWebhook", {});
  console.log("Bot polling rejimida ishlayapti...");
  let offset = 0;
  for (;;) {
    const res = await tg("getUpdates", { offset, timeout: 30 });
    for (const update of res.result ?? []) {
      offset = update.update_id + 1;
      try {
        await handleUpdate(update);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

main();

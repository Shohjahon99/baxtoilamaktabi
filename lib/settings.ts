import { db } from "./db";

// Admin paneldan o'zgartiriladigan sozlamalar (Setting jadvali).
// Bazada bo'lmasa .env dagi qiymat ishlatiladi.

export async function getSetting(key: string) {
  return (await db.setting.findUnique({ where: { key } }))?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  await db.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
}

export type ClickConfig = { serviceId: string; merchantId: string; secretKey: string };

export async function getClickConfig(): Promise<ClickConfig> {
  const rows = await db.setting.findMany({
    where: { key: { in: ["click_service_id", "click_merchant_id", "click_secret_key"] } },
  });
  const v = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    serviceId: v.click_service_id || process.env.CLICK_SERVICE_ID || "",
    merchantId: v.click_merchant_id || process.env.CLICK_MERCHANT_ID || "",
    secretKey: v.click_secret_key || process.env.CLICK_SECRET_KEY || "",
  };
}

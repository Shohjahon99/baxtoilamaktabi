import type { Metadata } from "next";
import { getClickConfig } from "@/lib/settings";
import { Badge, Card, Notice, PageHeader, inputCls } from "@/components/admin/ui";
import { saveClickSettings } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Click sozlama" };

export default async function ClickPage({ searchParams }: PageProps<"/admin/click">) {
  const { saved, error } = await searchParams;
  const c = await getClickConfig();
  const ready = !!(c.serviceId && c.merchantId && c.secretKey);
  const webhook = `${process.env.APP_URL ?? ""}/api/click`;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Click sozlamalari"
        subtitle="Click KASSA dan olingan ma'lumotlarni kiriting. Saqlagandan so'ng to'lovlar avtomatik ishlaydi."
        action={<Badge tone={ready ? "green" : "amber"}>{ready ? "✓ Ulangan" : "Sozlanmagan"}</Badge>}
      />
      {saved && <Notice tone="green">✅ Saqlandi! To&apos;lov tizimi tayyor.</Notice>}
      {error === "password" && <Notice tone="red">Admin paroli noto&apos;g&apos;ri — o&apos;zgarishlar saqlanmadi.</Notice>}

      <form action={saveClickSettings}>
        <Card className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Merchant ID</span>
            <input name="merchantId" defaultValue={c.merchantId} placeholder="Click KASSA → Sozlamalar → Merchant ID" className={`${inputCls} font-mono`} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Service ID</span>
            <input name="serviceId" defaultValue={c.serviceId} placeholder="Click KASSA → Xizmatlar → Service ID" className={`${inputCls} font-mono`} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Secret Key</span>
            <input
              name="secretKey"
              type="password"
              autoComplete="off"
              placeholder={c.secretKey ? `•••••••• (o'rnatilgan, …${c.secretKey.slice(-3)}) — o'zgartirish uchun yangisini kiriting` : "Click KASSA → Xizmatlar → Secret Key"}
              className={`${inputCls} font-mono`}
            />
          </label>
          <div className="border-t border-slate-100 pt-4">
            <label className="block space-y-1">
              <span className="text-sm font-semibold">🔐 Admin paroli</span>
              <input name="password" type="password" required autoComplete="current-password" placeholder="Tasdiqlash uchun joriy admin parolini kiriting" className={inputCls} />
            </label>
          </div>
          <button className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">💾 Saqlash</button>
        </Card>
      </form>

      <div className="mt-6 space-y-2 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm text-sky-800">
        <p className="font-semibold">Click KASSA da nimalarni yozish kerak?</p>
        <p>
          1. <a href="https://kassa.click.uz" target="_blank" rel="noopener noreferrer" className="font-medium underline">kassa.click.uz</a> ga kiring
        </p>
        <p>2. Merchant → Sozlamalar → <b>Merchant ID</b>; Xizmatlar → xizmatingiz → <b>Service ID</b> va <b>Secret Key</b></p>
        <p>
          3. Xizmat sozlamalarida <b>Prepare URL</b> va <b>Complete URL</b> ikkalasiga ham shu manzilni yozing:
        </p>
        <code className="block select-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-slate-800">{webhook}</code>
      </div>
    </div>
  );
}

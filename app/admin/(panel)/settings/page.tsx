import type { Metadata } from "next";
import { getAdminLogin } from "@/lib/admin-auth";
import { getSetting } from "@/lib/settings";
import { Badge, Card, Notice, PageHeader, inputCls } from "@/components/admin/ui";
import { changeCredentials } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Sozlamalar" };

export default async function SettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  const { saved, error } = await searchParams;
  const [login, passwordSet] = await Promise.all([getAdminLogin(), getSetting("admin_password_hash")]);
  const app = process.env.APP_URL ?? "";

  const status = [
    { label: "Telegram bot", ok: !!process.env.TELEGRAM_BOT_TOKEN, hint: process.env.TELEGRAM_BOT_USERNAME ? `@${process.env.TELEGRAM_BOT_USERNAME}` : ".env → TELEGRAM_BOT_TOKEN" },
    { label: "Dev test-kirish", ok: process.env.DEV_LOGIN !== "1", hint: process.env.DEV_LOGIN === "1" ? "Yoqilgan — serverda albatta o'chiring (DEV_LOGIN=0)" : "O'chirilgan" },
    { label: "Admin paroli", ok: !!passwordSet, hint: passwordSet ? "Paneldan o'rnatilgan" : ".env dagi boshlang'ich parol ishlatilmoqda — almashtiring" },
  ];

  return (
    <div className="max-w-2xl">
      <PageHeader title="Sozlamalar" subtitle="Admin hisobi va tizim holati" />
      {saved && <Notice tone="green">✅ Login va parol yangilandi</Notice>}
      {error === "password" && <Notice tone="red">Joriy parol noto&apos;g&apos;ri</Notice>}
      {error === "new" && <Notice tone="red">Yangi parol kamida 8 belgi bo&apos;lsin va ikki marta bir xil kiritilsin</Notice>}

      <Card className="space-y-3">
        <p className="font-semibold">Tizim holati</p>
        {status.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-4 text-sm">
            <span>{s.label}</span>
            <span className="flex items-center gap-2 text-right text-xs text-slate-500">
              {s.hint} <Badge tone={s.ok ? "green" : "amber"}>{s.ok ? "✓" : "!"}</Badge>
            </span>
          </div>
        ))}
        <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
          <p>Telegram webhook: <code className="select-all font-mono text-slate-700">{app}/api/telegram/webhook</code></p>
          <p className="mt-1">Click webhook: <code className="select-all font-mono text-slate-700">{app}/api/click</code></p>
        </div>
      </Card>

      <form action={changeCredentials} className="mt-6">
        <Card className="space-y-4">
          <p className="font-semibold">Admin login va parolini o&apos;zgartirish</p>
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Login</span>
            <input name="login" defaultValue={login} required className={inputCls} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-semibold">Yangi parol</span>
              <input name="newPassword" type="password" minLength={8} required autoComplete="new-password" className={inputCls} />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-semibold">Yangi parol (takror)</span>
              <input name="confirmPassword" type="password" minLength={8} required autoComplete="new-password" className={inputCls} />
            </label>
          </div>
          <label className="block space-y-1 border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold">🔐 Joriy parol</span>
            <input name="currentPassword" type="password" required autoComplete="current-password" className={inputCls} />
          </label>
          <button className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">💾 Saqlash</button>
          <p className="text-xs text-slate-400">Parol o&apos;zgargach boshqa qurilmalardagi admin sessiyalari avtomatik yopiladi.</p>
        </Card>
      </form>
    </div>
  );
}

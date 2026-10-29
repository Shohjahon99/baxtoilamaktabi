import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, devLoginEnabled } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { devLogin } from "@/app/actions";
import { TelegramLogin } from "./TelegramLogin";

export const metadata: Metadata = { title: "Kirish" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next: rawNext } = await searchParams;
  const next = typeof rawNext === "string" && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";
  if (await getCurrentUser()) redirect(next);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center font-serif text-2xl font-bold">Platformaga kirish</h1>
        <p className="mt-2 text-center text-sm text-ink/70">
          Ro&apos;yxatdan o&apos;tish va kirish Telegram orqali — parol eslab qolish shart emas.
        </p>
        <div className="mt-8">
          <TelegramLogin next={next} />
        </div>

        {devLoginEnabled() && (
          <form action={devLogin} className="mt-8 rounded-2xl border border-dashed border-gold-300 bg-gold-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gold-700">Dev rejim: test kirish</p>
            <input type="hidden" name="next" value={next} />
            <input
              name="name"
              placeholder="Ism (masalan: Sardor)"
              className="mt-2 w-full rounded-xl border border-gold-300 bg-white px-3 py-2 text-sm"
            />
            <button className="mt-3 w-full rounded-xl bg-gold-500 py-2 text-sm font-bold text-white hover:bg-gold-700">
              Test foydalanuvchi bilan kirish
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

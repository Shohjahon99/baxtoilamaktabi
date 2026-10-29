import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { adminLogin } from "../actions";

export const metadata: Metadata = { title: "Admin kirish", robots: { index: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await isAdmin()) redirect("/admin/dashboard");
  const { error } = await searchParams;
  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl">🔐</div>
          <h1 className="text-xl font-bold text-slate-900">Admin panel</h1>
          <p className="mt-1 text-sm text-slate-500">Baxt oila online maktabi</p>
        </div>
        <form action={adminLogin} className="space-y-3">
          <input name="login" placeholder="Login" autoComplete="username" required className={input} />
          <input name="password" type="password" placeholder="Parol" autoComplete="current-password" required className={input} />
          {error && (
            <p className="text-sm text-red-600">
              {error === "blocked" ? "Juda ko'p urinish. 10 daqiqadan so'ng qayta urinib ko'ring." : "Login yoki parol noto'g'ri"}
            </p>
          )}
          <button className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            Kirish →
          </button>
        </form>
      </div>
    </div>
  );
}

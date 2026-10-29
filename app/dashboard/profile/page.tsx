import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { REGIONS } from "@/lib/format";
import { updateProfile } from "@/app/actions";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage({ searchParams }: PageProps<"/dashboard/profile">) {
  const user = await requireUser("/dashboard/profile");
  const { error, next } = await searchParams;
  const input = "mt-1 w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5";

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-brand-900">Profil</h1>
      <form action={updateProfile} className="mt-6 space-y-4 rounded-3xl border border-brand-100 bg-white p-6">
        {typeof next === "string" && <input type="hidden" name="next" value={next} />}
        <label className="block">
          <span className="text-sm font-bold">To&apos;liq F.I.Sh. (sertifikatga shunday yoziladi)</span>
          <input name="fullName" defaultValue={user.fullName ?? ""} required placeholder="Aliyev Sardor Anvar o'g'li" className={input} />
          {error === "name" && <span className="mt-1 block text-sm text-red-600">Familiya va ismni to&apos;liq kiriting.</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">Tug&apos;ilgan yil</span>
          <input name="birthYear" type="number" min={1940} max={2020} defaultValue={user.birthYear ?? ""} className={input} />
        </label>
        <label className="block">
          <span className="text-sm font-bold">Hudud</span>
          <select name="region" defaultValue={user.region ?? ""} className={input}>
            <option value="">— tanlang —</option>
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <p className="text-sm text-ink/60">Telefon: {user.phone ?? "—"}</p>
        <button className="w-full rounded-full bg-brand-600 py-3 font-bold text-white hover:bg-brand-700">Saqlash</button>
      </form>
    </div>
  );
}

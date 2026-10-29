import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Card, PageHeader, Table, inputCls } from "@/components/admin/ui";
import { deleteFeedback } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Fitbeklar" };

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
const tone = (n: number) => (n >= 4 ? "bg-emerald-50 text-emerald-700" : n <= 2 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700");

export default async function FeedbacksPage({ searchParams }: PageProps<"/admin/feedbacks">) {
  const { course, rating } = await searchParams;
  const courseId = typeof course === "string" ? course : "";
  const ratingFilter = typeof rating === "string" ? rating : "";

  const [all, courses] = await Promise.all([
    db.feedback.findMany({
      where: courseId ? { courseId } : {},
      orderBy: { createdAt: "desc" },
      include: { user: true, course: true },
    }),
    db.course.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
  ]);

  // statistika tanlangan kurs bo'yicha, jadval esa baho filtri bilan
  const total = all.length;
  const positive = all.filter((f) => f.rating >= 4).length;
  const negative = all.filter((f) => f.rating <= 2).length;
  const neutral = total - positive - negative;
  const avg = total ? all.reduce((s, f) => s + f.rating, 0) / total : 0;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const perStar = [5, 4, 3, 2, 1].map((s) => ({ s, n: all.filter((f) => f.rating === s).length }));

  const rows = all.filter((f) =>
    ratingFilter === "pos" ? f.rating >= 4 : ratingFilter === "neg" ? f.rating <= 2 : ratingFilter === "neu" ? f.rating === 3 : true
  );

  const cards = [
    { value: avg.toFixed(1), label: "O'rtacha baho", sub: "★".repeat(Math.round(avg)) || "—", color: "text-sky-600", subColor: "text-gold-500" },
    { value: `${pct(positive)}%`, label: "Ijobiy (4–5 ★)", sub: `${positive} ta`, color: "text-emerald-600", subColor: "text-emerald-500" },
    { value: `${pct(neutral)}%`, label: "Neytral (3 ★)", sub: `${neutral} ta`, color: "text-amber-600", subColor: "text-amber-500" },
    { value: `${pct(negative)}%`, label: "Salbiy (1–2 ★)", sub: `${negative} ta`, color: "text-red-600", subColor: "text-red-500" },
  ];

  return (
    <>
      <PageHeader title="Fitbeklar" subtitle={`Jami: ${total} ta · o'quvchilar kursni tamomlagach qoldiradi`} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="text-center">
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.label}</p>
            <p className={`mt-1 text-sm ${c.subColor}`}>{c.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 space-y-2.5">
        <p className="mb-2 font-semibold text-slate-700">Taqsimot</p>
        {perStar.map(({ s, n }) => (
          <div key={s} className="flex items-center gap-3 text-sm">
            <span className="w-14 text-gold-500">{"★".repeat(s)}</span>
            <div className="h-3 flex-1 rounded-full bg-slate-100">
              <div className={`h-3 rounded-full ${s >= 4 ? "bg-emerald-500" : s === 3 ? "bg-amber-400" : "bg-red-500"}`} style={{ width: `${pct(n)}%` }} />
            </div>
            <span className="w-16 text-right font-semibold">{pct(n)}% <span className="font-normal text-slate-400">({n})</span></span>
          </div>
        ))}
      </Card>

      <form className="mb-4 mt-6 flex flex-wrap gap-2">
        <select name="course" defaultValue={courseId} className={`${inputCls} max-w-xs`}>
          <option value="">Barcha kurslar</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select name="rating" defaultValue={ratingFilter} className={`${inputCls} max-w-[12rem]`}>
          <option value="">Barcha baholar</option>
          <option value="pos">Ijobiy (4–5)</option>
          <option value="neu">Neytral (3)</option>
          <option value="neg">Salbiy (1–2)</option>
        </select>
        <button className="rounded-xl bg-slate-900 px-4 text-sm font-medium text-white">Filtrlash</button>
      </form>

      <Table head={["Tinglovchi", "Kurs", "Baho", "Izoh", "Sana", ""]} empty={rows.length === 0}>
        {rows.map((f) => (
          <tr key={f.id} className="align-top hover:bg-slate-50">
            <td className="px-4 py-3">
              <Link href={`/admin/users/${f.userId}`} className="font-medium hover:text-brand-600">{f.user.fullName || f.user.firstName}</Link>
              <p className="font-mono text-xs text-slate-400">{f.user.phone}</p>
            </td>
            <td className="max-w-[180px] px-4 py-3 text-slate-600">{f.course.title}</td>
            <td className="px-4 py-3">
              <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-semibold ${tone(f.rating)}`}>
                {f.rating}/5 <span className="text-gold-500">{stars(f.rating)}</span>
              </span>
            </td>
            <td className="max-w-md px-4 py-3 text-slate-600">
              {f.comment ? <span className="whitespace-pre-line">{f.comment}</span> : <span className="italic text-slate-300">Izoh yo&apos;q</span>}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{formatDate(f.createdAt)}</td>
            <td className="px-4 py-3 text-right">
              <form action={deleteFeedback}>
                <input type="hidden" name="id" value={f.id} />
                <ConfirmButton message="Fitbekni o'chirasizmi?" className="text-xs text-red-500 hover:underline">o&apos;chirish</ConfirmButton>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}

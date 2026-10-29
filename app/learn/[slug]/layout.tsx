import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCourseWithLessons, flatLessons, getProgress } from "@/lib/learning";

export default async function LearnLayout({ children, params }: LayoutProps<"/learn/[slug]">) {
  const { slug } = await params;
  const user = await requireUser(`/learn/${slug}`);
  const course = await getCourseWithLessons(slug);
  if (!course) notFound();
  const { enrollment, doneIds, certificate } = await getProgress(user.id, course.id);
  const lessons = flatLessons(course);
  const percent = lessons.length ? Math.round((doneIds.size / lessons.length) * 100) : 0;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[300px_1fr]">
      <aside className="no-print h-fit rounded-3xl border border-brand-100 bg-white p-5 lg:sticky lg:top-20">
        <Link href={`/courses/${course.slug}`} className="text-xs font-bold uppercase tracking-wider text-brand-500 hover:underline">
          ← Kurs sahifasi
        </Link>
        <p className="mt-2 font-serif text-lg font-bold">
          {course.emoji} {course.title}
        </p>
        {enrollment && (
          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-brand-50">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-1 text-xs text-ink/60">
              {doneIds.size} / {lessons.length} dars · {percent}%
            </p>
          </div>
        )}
        <nav className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto pr-1 text-sm">
          {course.modules.map((m, mi) => (
            <div key={m.id}>
              <p className="mb-1 text-xs font-bold uppercase text-ink/50">
                {mi + 1}. {m.title}
              </p>
              <ul className="space-y-0.5">
                {m.lessons.map((l) => {
                  const open = !!enrollment || l.isPreview;
                  return (
                    <li key={l.id}>
                      {open ? (
                        <Link href={`/learn/${course.slug}/${l.id}`} className="block rounded-lg px-2 py-1.5 hover:bg-brand-50">
                          {doneIds.has(l.id) ? "✅" : "○"} {l.title}
                        </Link>
                      ) : (
                        <span className="block px-2 py-1.5 text-ink/40">🔒 {l.title}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        {enrollment && (
          <Link
            href={`/learn/${course.slug}/exam`}
            className={`mt-4 block rounded-xl px-3 py-2.5 text-center text-sm font-bold ${
              certificate ? "bg-emerald-50 text-emerald-700" : "bg-gold-50 text-gold-700 hover:bg-gold-100"
            }`}
          >
            {certificate ? "🎓 Sertifikat olingan" : "📝 Yakuniy imtihon"}
          </Link>
        )}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

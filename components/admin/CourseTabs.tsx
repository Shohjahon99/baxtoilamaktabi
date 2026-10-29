import Link from "next/link";

export function CourseTabs({ id, active, counts }: { id: string; active: "info" | "lessons" | "exam"; counts: { lessons: number; exam: number } }) {
  const tabs = [
    { key: "info", href: `/admin/courses/${id}`, label: "Ma'lumotlar" },
    { key: "lessons", href: `/admin/courses/${id}/lessons`, label: `Darslar va testlar (${counts.lessons})` },
    { key: "exam", href: `/admin/courses/${id}/exam`, label: `Yakuniy imtihon (${counts.exam})` },
  ];
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-200/60 p-1 text-sm">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
            active === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

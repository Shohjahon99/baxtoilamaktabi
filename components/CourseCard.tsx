import Link from "next/link";
import Image from "next/image";
import { priceLabel } from "@/lib/format";

const COLORS: Record<string, string> = {
  rose: "from-brand-100 to-brand-50 text-brand-800",
  gold: "from-gold-100 to-gold-50 text-gold-700",
  teal: "from-teal-100 to-teal-50 text-teal-800",
  sky: "from-sky-100 to-sky-50 text-sky-800",
  violet: "from-violet-100 to-violet-50 text-violet-800",
};

export function courseColor(color: string) {
  return COLORS[color] ?? COLORS.rose;
}

type Props = {
  course: {
    slug: string;
    title: string;
    audience: string;
    shortDesc: string;
    emoji: string;
    image: string | null;
    color: string;
    price: number;
    status: string;
  };
  lessons: number;
};

export function CourseCard({ course, lessons }: Props) {
  const soon = course.status !== "PUBLISHED" || lessons === 0;
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-brand-100 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/10"
    >
      <div className="relative h-56 overflow-hidden">
        {course.image ? (
          <Image
            src={`${course.image}?auto=format&fit=crop&w=800&q=75`}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-[1.2s] ease-out group-hover:scale-110"
          />
        ) : (
          <div className={`flex h-full items-center justify-center bg-gradient-to-br text-6xl ${courseColor(course.color)}`}>{course.emoji}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/10 to-transparent" />
        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-extrabold shadow-lg backdrop-blur ${
            course.price === 0 ? "bg-emerald-500/90 text-white" : "bg-white/90 text-brand-800"
          }`}
        >
          {priceLabel(course.price)}
        </span>
        {soon && (
          <span className="absolute left-4 top-4 rounded-full bg-gold-300/95 px-3 py-1 text-xs font-extrabold text-ink shadow-lg">Tez kunda</span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-white/80">{course.audience}</p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-white">{course.title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm leading-relaxed text-ink/70">{course.shortDesc}</p>
        <div className="mt-5 flex items-center justify-between text-sm font-bold">
          <span className="text-ink/50">{soon ? "Dastur tayyorlanmoqda" : `${lessons} ta dars · sertifikat`}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition duration-300 group-hover:translate-x-1 group-hover:bg-brand-600 group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/CourseCard";
import { Hero } from "@/components/home/Hero";
import { FamilyStats } from "@/components/home/FamilyStats";
import { Reveal, Tilt } from "@/components/motion";

const TOPICS = [
  "Oila psixologiyasi", "Muomala madaniyati", "Oila kodeksi", "Sog'lom avlod", "Nizolarni hal qilish",
  "Oila byudjeti", "Farzand tarbiyasi", "Qaynona-kelin munosabati", "Otalik va onalik", "Ma'naviy qadriyatlar",
];

const STEPS = [
  { n: "01", t: "Telegram orqali kiring", d: "Bir bosishda ro'yxatdan o'tasiz — parol eslab qolish shart emas.", icon: "💬" },
  { n: "02", t: "Kursni tanlang", d: "Bepul kurslar darhol ochiladi, pulliklari Click orqali bir daqiqada.", icon: "📚" },
  { n: "03", t: "O'z tezligingizda o'qing", d: "Telefondan ham, kompyuterdan ham. Har dars oxirida qisqa test.", icon: "⏱" },
  { n: "04", t: "Sertifikat oling", d: "Yakuniy imtihondan so'ng 9 ballik, QR-kodli rasmiy sertifikat.", icon: "🎓" },
];

export default async function Home() {
  const [courses, students, certificates] = await Promise.all([
    db.course.findMany({
      orderBy: { order: "asc" },
      include: { modules: { include: { _count: { select: { lessons: true } } } } },
    }),
    db.user.count(),
    db.certificate.count(),
  ]);

  return (
    <>
      <Hero students={students} certificates={certificates} courses={courses.length} />

      {/* Mavzular lentasi */}
      <div className="relative overflow-hidden border-y border-brand-100 bg-white py-5">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-serif text-xl font-bold text-brand-800/80">
          {[...TOPICS, ...TOPICS].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t}
              <span className="text-gold-500">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Kurslar */}
      <section id="kurslar" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-brand-500">Kurslarimiz</p>
              <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold text-brand-900 sm:text-5xl">Hayotning har bir bosqichi uchun</h2>
            </div>
            <Link href="/courses" className="rounded-full border border-brand-200 px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white">
              Barcha kurslar →
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.12}>
              <CourseCard course={c} lessons={c.modules.reduce((s, m) => s + m._count.lessons, 0)} />
            </Reveal>
          ))}
        </div>
      </section>

      <FamilyStats />

      {/* Qanday ishlaydi */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <Reveal>
          <p className="text-center text-sm font-extrabold uppercase tracking-[0.3em] text-brand-500">100% avtomatik</p>
          <h2 className="mt-3 text-center font-serif text-4xl font-bold text-brand-900 sm:text-5xl">To&apos;rt qadamda sertifikatgacha</h2>
        </Reveal>
        <div className="relative mt-16 grid gap-6 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-brand-100 via-brand-300 to-gold-300 md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.15} className="relative">
              <div className="group h-full rounded-[1.75rem] border border-brand-100 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:shadow-xl">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl shadow-lg shadow-brand-600/30 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {s.icon}
                </span>
                <p className="mt-5 font-mono text-xs font-bold text-brand-400">{s.n}</p>
                <h3 className="mt-1 text-lg font-extrabold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sertifikat */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid items-center gap-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-800 to-brand-900 p-8 text-white md:grid-cols-2 md:p-14">
          <Reveal>
            <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-gold-300">Sertifikat</p>
            <h2 className="mt-3 font-serif text-4xl font-bold">IELTS kabi ballik baholash</h2>
            <p className="mt-4 text-white/75">
              Yakuniy imtihon natijasi 0 dan 9 gacha ball bilan baholanadi. Har bir sertifikatda noyob raqam va QR-kod bor —
              uni istalgan kishi bir soniyada tekshira oladi.
            </p>
            <ul className="mt-8 space-y-3">
              {[["8.5 – 9.0", "A'lo daraja"], ["7.0 – 8.0", "Yuqori daraja"], ["5.5 – 6.5", "O'rta daraja"], ["5.0", "Boshlang'ich daraja"]].map(([b, l]) => (
                <li key={b} className="flex items-center gap-4">
                  <span className="w-24 rounded-full bg-white/10 px-3 py-1 text-center font-mono text-sm font-bold text-gold-300">{b}</span>
                  <span className="text-white/85">{l}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <Tilt className="mx-auto max-w-md">
              <div className="relative rounded-2xl border-[6px] border-double border-gold-300 bg-cream p-8 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
                <p className="text-center text-xs uppercase tracking-[0.35em] text-gold-700">Sertifikat</p>
                <p className="mt-4 text-center font-serif text-3xl font-bold text-brand-800">Aliyev Sardor</p>
                <p className="mt-1 text-center text-sm text-ink/60">«Ideal kuyov» kursini tamomladi</p>
                <div className="mx-auto mt-6 flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-gold-500 bg-white">
                  <span className="font-serif text-3xl font-bold text-gold-700">7.5</span>
                  <span className="text-[10px] text-ink/50">/ 9.0</span>
                </div>
                <p className="mt-4 text-center font-mono text-xs text-ink/50">BO-2026-000001 · namuna</p>
              </div>
            </Tilt>
          </Reveal>
        </div>
      </section>

      {/* Yakuniy chaqiriq */}
      <section className="relative isolate overflow-hidden py-28 text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?auto=format&fit=crop&w=1920&q=70"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-brand-900/75" />
        <Reveal className="mx-auto max-w-3xl px-4">
          <p className="font-serif text-2xl italic text-gold-300">«Oila — kichik Vatan. Oila tinch bo&apos;lsa, Vatan tinch bo&apos;ladi.»</p>
          <h2 className="mt-6 font-serif text-4xl font-bold sm:text-5xl">Baxtli oilangiz sari birinchi qadamni bugun qo&apos;ying</h2>
          <Link href="/courses" className="mt-10 inline-block rounded-full bg-gold-300 px-10 py-4 font-extrabold text-ink shadow-2xl transition hover:scale-105">
            Bepul boshlash
          </Link>
        </Reveal>
      </section>
    </>
  );
}

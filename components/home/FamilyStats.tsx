import Link from "next/link";
import Image from "next/image";
import { CountUp, GrowBar, Parallax, Reveal } from "@/components/motion";
import {
  DIVORCES,
  DIVORCES_2024,
  DIVORCES_PER_DAY,
  DIVORCE_RATIO,
  GROWTH_2020_2023,
  SOURCES,
} from "@/lib/family-stats";

const max = Math.max(...DIVORCES.map((d) => d.value));

export function FamilyStats() {
  return (
    <section id="oila-statistika" className="relative isolate scroll-mt-16 overflow-hidden bg-[#1c0d14] py-24 text-white">
      <Parallax className="absolute inset-0 -z-10 opacity-25">
        <Image
          src="https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=1920&q=60"
          alt=""
          fill
          sizes="100vw"
          className="object-cover grayscale"
        />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1c0d14] via-[#1c0d14]/80 to-[#1c0d14]" />

      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <p className="text-center text-sm font-extrabold uppercase tracking-[0.3em] text-gold-300">Oila — shunchaki so&apos;z emas</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Har bir ajrim ortida <span className="text-brand-400">buzilgan taqdir</span> va ko&apos;pincha — bola turadi
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-white/70">
            Raqamlar sovuq, lekin ularning har biri — bir oila. Oilaga beparvo qarash butun jamiyatga qimmatga tushadi.
          </p>
        </Reveal>

        {/* Asosiy raqamlar */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <StatCard delay={0}>
            <p className="font-serif text-6xl font-bold text-brand-400"><CountUp to={DIVORCES_2024} /></p>
            <p className="mt-3 text-lg font-bold">oila 2024-yilda ajrashgan</p>
            <p className="mt-2 text-sm text-white/60">
              Bu kuniga o&apos;rtacha <b className="text-white">{DIVORCES_PER_DAY} ta</b> oila degani — har {Math.round(1440 / DIVORCES_PER_DAY)} daqiqada bitta.
            </p>
          </StatCard>
          <StatCard delay={0.1}>
            <p className="font-serif text-6xl font-bold text-gold-300">
              1 / <CountUp to={DIVORCE_RATIO} />
            </p>
            <p className="mt-3 text-lg font-bold">har {DIVORCE_RATIO} ta nikohga bitta ajrim</p>
            <p className="mt-2 text-sm text-white/60">2024-yilda 271,8 ming nikoh va 45,1 ming ajrim qayd etilgan.</p>
          </StatCard>
          <StatCard delay={0.2}>
            <p className="font-serif text-6xl font-bold text-brand-400">
              +<CountUp to={GROWTH_2020_2023} suffix="%" />
            </p>
            <p className="mt-3 text-lg font-bold">ajrimlar o&apos;sishi (2020 → 2023)</p>
            <p className="mt-2 text-sm text-white/60">3 yilda yillik ajrimlar 28 mingdan 49 mingga yetdi.</p>
          </StatCard>
        </div>

        {/* Diagramma + bolalar */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Reveal className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="font-bold">O&apos;zbekistonda yillik ajrimlar soni</p>
            <div className="mt-8 flex h-64 items-end gap-3 sm:gap-6">
              {DIVORCES.map((d, i) => (
                <div key={d.year} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-bold text-white/80 sm:text-sm">{(d.value / 1000).toFixed(1)}k</span>
                  <GrowBar
                    percent={(d.value / max) * 100}
                    delay={i * 0.12}
                    className="w-full rounded-t-xl bg-gradient-to-t from-brand-700 to-brand-400 shadow-[0_0_30px_-5px] shadow-brand-500/50"
                  />
                  <span className="text-xs text-white/60 sm:text-sm">{d.year}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-5">
            <StatCard delay={0.1}>
              <p className="font-serif text-5xl font-bold text-gold-300"><CountUp to={2000} suffix="+" /></p>
              <p className="mt-2 font-bold">ota-ona 3 yilda ota-onalik huquqidan mahrum etilgan</p>
              <p className="mt-2 text-sm text-white/60">
                Holatlarning <b className="text-white">86%</b> sababi — farzand oldidagi majburiyatlarni bajarmaslik. Ota-onasi tirik bo&apos;la turib qarovsiz qolgan bolalar — «tirik yetimlar».
              </p>
            </StatCard>
            <StatCard delay={0.2}>
              <p className="font-serif text-5xl font-bold text-brand-400">≈ 2×</p>
              <p className="mt-2 font-bold">otasiz o&apos;sgan o&apos;smirlarda qamoqqa tushish xavfi</p>
              <p className="mt-2 text-sm text-white/60">
                AQShda o&apos;tkazilgan uzoq muddatli tadqiqot: daromad va boshqa omillar hisobga olingandan keyin ham otasiz oiladagi o&apos;smirlarning qamalish ehtimoli taxminan ikki baravar yuqori.
              </p>
            </StatCard>
          </div>
        </div>

        {/* Xulosa */}
        <Reveal className="mt-16">
          <div className="grid items-center gap-8 rounded-[2rem] bg-gradient-to-r from-brand-700 to-brand-600 p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <p className="font-serif text-3xl font-bold leading-snug">
                Ajrimlarning aksariyati turmushning dastlabki yillarida — tayyorgarlik yetishmasligidan yuz beradi.
              </p>
              <p className="mt-3 text-white/80">
                Psixologiya, muloqot, huquq va oila iqtisodi maktabda o&apos;rgatilmaydi. Biz aynan shu bo&apos;shliqni to&apos;ldiramiz — kasallikni davolashdan ko&apos;ra, oldini olish afzal.
              </p>
            </div>
            <Link href="/courses" className="shrink-0 rounded-full bg-white px-8 py-4 text-center font-extrabold text-brand-800 shadow-xl transition hover:scale-105">
              Oilamni asrashni o&apos;rganaman
            </Link>
          </div>
        </Reveal>

        <details className="mt-8 text-xs text-white/50">
          <summary className="cursor-pointer font-bold hover:text-white/80">Manbalar</summary>
          <ul className="mt-3 space-y-1">
            {Object.values(SOURCES).map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{s.label}</a>
              </li>
            ))}
          </ul>
          <p className="mt-2">2024-yil ma&apos;lumotlari Statistika agentligining rasmiy yillik hisoboti chiqqach yangilanadi.</p>
        </details>
      </div>
    </section>
  );
}

function StatCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur transition duration-500 hover:border-white/25 hover:bg-white/10">
      {children}
    </Reveal>
  );
}

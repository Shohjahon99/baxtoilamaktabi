import Link from "next/link";
import Image from "next/image";
import { existsSync } from "fs";
import path from "path";
import { CountUp, Float, Reveal, RotatingWord } from "@/components/motion";

const photo = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

// public/hero.mp4 qo'yilsa, fon sifatida avtomatik video ishlatiladi
const hasVideo = () => existsSync(path.join(process.cwd(), "public", "hero.mp4"));

export function Hero({ students, certificates, courses }: { students: number; certificates: number; courses: number }) {
  return (
    <section className="relative isolate -mt-[73px] flex min-h-[100svh] items-center overflow-hidden bg-brand-900 pt-[73px] text-white">
      {/* Fon: video yoki sekin kattalashuvchi rasm */}
      <div className="absolute inset-0 -z-10">
        {hasVideo() ? (
          <video src="/hero.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
        ) : (
          <Image src={photo("1511895426328-dc8714191300", 1920)} alt="" fill priority sizes="100vw" className="kenburns object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/85 to-brand-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent" />
        <div className="blob absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-brand-500/30 blur-3xl" />
        <div className="blob absolute -bottom-40 right-10 h-[26rem] w-[26rem] rounded-full bg-gold-500/25 blur-3xl [animation-delay:-6s]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-bold backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Butun O&apos;zbekiston bo&apos;ylab onlayn
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              Baxtli oila
              <br />
              <RotatingWord words={["bilimdan", "hurmatdan", "muloqotdan", "sabrdan"]} className="text-gold-300" />
              <br />
              boshlanadi
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Turmush qurish arafasidagi yoshlar, bo&apos;lajak ota-onalar va o&apos;smirlar uchun oila psixologiyasi,
              muomala madaniyati, huquqiy va tibbiy bilimlar. Uydan chiqmasdan o&apos;qing va 9 ballik sertifikat oling.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="group relative overflow-hidden rounded-full bg-gold-300 px-8 py-4 font-extrabold text-ink shadow-2xl shadow-gold-500/30 transition hover:scale-105"
              >
                <span className="shine absolute inset-0" />
                <span className="relative">O&apos;qishni boshlash →</span>
              </Link>
              <a href="#oila-statistika" className="rounded-full border border-white/30 bg-white/5 px-8 py-4 font-bold backdrop-blur transition hover:bg-white/15">
                Nega bu muhim?
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/60">Kurslar</dt>
                <dd className="font-serif text-3xl font-bold"><CountUp to={courses} /></dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/60">Tinglovchilar</dt>
                <dd className="font-serif text-3xl font-bold"><CountUp to={students} /></dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/60">Sertifikatlar</dt>
                <dd className="font-serif text-3xl font-bold"><CountUp to={certificates} /></dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* O'ng tomon: suzib yuruvchi rasm kollaji */}
        <div className="relative hidden h-[560px] lg:block">
          <Float delay={0.3} className="absolute right-0 top-0 h-80 w-64 overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl">
            <Image src={photo("1609220136736-443140cffec6", 600)} alt="Ota farzandlari bilan" fill sizes="256px" className="object-cover" />
          </Float>
          <Float delay={0.6} distance={18} className="absolute bottom-6 left-0 h-72 w-60 overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl">
            <Image src={photo("1543342384-1f1350e27861", 600)} alt="Yosh ota-ona chaqaloq bilan" fill sizes="240px" className="object-cover" />
          </Float>
          <Float delay={0.9} distance={10} className="absolute bottom-0 right-8 h-52 w-56 overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl">
            <Image src={photo("1588979355313-6711a095465f", 600)} alt="Baxtli oila" fill sizes="224px" className="object-cover" />
          </Float>
          <Float delay={1.2} distance={8} className="absolute left-6 top-16 rounded-2xl bg-white p-4 text-ink shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Sertifikat</p>
            <p className="font-serif text-3xl font-bold text-gold-700">7.5 <span className="text-sm text-ink/50">/ 9.0</span></p>
            <p className="text-xs font-bold text-emerald-600">✓ QR orqali tasdiqlangan</p>
          </Float>
          <Float delay={1.5} distance={12} className="absolute right-56 top-[52%] rounded-2xl bg-brand-600 px-4 py-3 shadow-2xl">
            <p className="text-sm font-bold">💬 Telegram orqali kirish</p>
          </Float>
        </div>
      </div>

      <a href="#kurslar" aria-label="Pastga" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/60 md:flex">
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-white/40 pt-2">
          <span className="scroll-dot h-2 w-1 rounded-full bg-white" />
        </span>
      </a>
    </section>
  );
}

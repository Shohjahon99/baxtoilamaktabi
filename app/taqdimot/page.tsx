import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { db } from "@/lib/db";
import { Deck } from "@/components/taqdimot/Deck";
import { CountUp, GrowBar, GrowWidth, Reveal } from "@/components/motion";
import { Logo } from "@/components/Logo";
import { DIVORCES, DIVORCES_2024, DIVORCES_PER_DAY, DIVORCE_RATIO, GROWTH_2020_2023 } from "@/lib/family-stats";
import { priceLabel } from "@/lib/format";

// Taqdimot faqat /taqdimot manzili orqali ochiladi: saytda havolasi yo'q, qidiruv tizimlari indekslamaydi
// statistika bazadan har safar yangidan olinadi (build paytida baza bo'lmasligi mumkin)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Taqdimot",
  robots: { index: false, follow: false },
};

const photo = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const maxDiv = Math.max(...DIVORCES.map((d) => d.value));

// ---------- yordamchi bloklar ----------

function Dark({ children, img, className = "" }: { children: ReactNode; img?: string; className?: string }) {
  return (
    <div className={`relative isolate flex min-h-[100svh] w-full items-center bg-[#1c0d14] text-white ${className}`}>
      {img && (
        <>
          <Image src={photo(img)} alt="" fill sizes="100vw" className="kenburns -z-20 object-cover opacity-30" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1c0d14]/95 via-[#1c0d14]/80 to-brand-900/70" />
        </>
      )}
      <div className="blob absolute -left-40 top-1/4 -z-10 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">{children}</div>
    </div>
  );
}

function Light({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative isolate flex min-h-[100svh] w-full items-center bg-cream text-ink ${className}`}>
      <div className="blob absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
      <div className="blob absolute -bottom-40 -left-20 -z-10 h-96 w-96 rounded-full bg-gold-100 blur-3xl [animation-delay:-5s]" />
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">{children}</div>
    </div>
  );
}

function Kicker({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <p className={`text-xs font-extrabold uppercase tracking-[0.3em] md:text-sm ${dark ? "text-gold-300" : "text-brand-500"}`}>{children}</p>;
}

function Title({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`mt-3 font-serif text-3xl font-bold leading-tight md:text-5xl ${className}`}>{children}</h2>;
}

function Src({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <p className={`mt-8 text-[11px] ${dark ? "text-white/40" : "text-ink/40"}`}>Manba: {children}</p>;
}

// ---------- sahifa ----------

export default async function TaqdimotPage() {
  const [courses, users, certs] = await Promise.all([
    db.course.findMany({ orderBy: { order: "asc" }, include: { modules: { include: { _count: { select: { lessons: true } } } } } }),
    db.user.count(),
    db.certificate.count(),
  ]);

  return (
    <Deck>
      {/* 1. Muqova */}
      <Dark img="1511895426328-dc8714191300">
        <Reveal>
          <div className="[&_*]:!text-white">
            <Logo />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <h1 className="mt-10 font-serif text-5xl font-bold leading-[1.05] md:text-8xl">
            Mustahkam oila —<br />
            <span className="text-gold-300">mustahkam Vatan</span>
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-8 max-w-2xl text-lg text-white/75 md:text-2xl">
            O&apos;zbekiston yoshlari uchun 100% avtomatik onlayn oila maktabi: ilmiy asoslangan bilim, milliy va diniy qadriyatlar, 9 ballik sertifikat.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-white/50">«IT Center Surxon» MChJ · {new Date().getFullYear()}</p>
        </Reveal>
      </Dark>

      {/* 2. Muammo: ajrimlar */}
      <Dark>
        <Reveal>
          <Kicker dark>Muammo</Kicker>
          <Title>Har bir ajrim ortida buzilgan taqdir va ko&apos;pincha — bola turadi</Title>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [<CountUp key="a" to={DIVORCES_2024} />, "oila 2024-yilda ajrashgan", `kuniga ~${DIVORCES_PER_DAY} ta oila`, "text-brand-400"],
            [<span key="b">1 / <CountUp to={DIVORCE_RATIO} /></span>, `har ${DIVORCE_RATIO} ta nikohga bitta ajrim`, "271,8 ming nikoh · 45,1 ming ajrim", "text-gold-300"],
            [<span key="c">+<CountUp to={GROWTH_2020_2023} suffix="%" /></span>, "ajrimlar o'sishi, 2020 → 2023", "28 mingdan 49 mingga", "text-brand-400"],
          ].map(([v, t, s, c], i) => (
            <Reveal key={i} delay={i * 0.12} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
              <p className={`font-serif text-5xl font-bold md:text-6xl ${c}`}>{v}</p>
              <p className="mt-3 text-lg font-bold">{t}</p>
              <p className="mt-1 text-sm text-white/55">{s}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3} className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="flex h-44 items-end gap-4 md:gap-8">
            {DIVORCES.map((d, i) => (
              <div key={d.year} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-bold text-white/80">{(d.value / 1000).toFixed(1)}k</span>
                <GrowBar percent={(d.value / maxDiv) * 100} delay={i * 0.1} className="w-full rounded-t-xl bg-gradient-to-t from-brand-700 to-brand-400" />
                <span className="text-xs text-white/55">{d.year}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Src dark>O&apos;zbekiston Statistika agentligi (2020–2023), 2024 — Daryo.uz orqali</Src>
      </Dark>

      {/* 3. Bolalar */}
      <Light>
        <Reveal>
          <Kicker>Oqibati</Kicker>
          <Title className="text-brand-900">Oila buzilsa, eng ko&apos;p bola zarar ko&apos;radi</Title>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["2 000+", "ota-ona 3 yilda ota-onalik huquqidan mahrum etilgan", "86% holatda sabab — farzand oldidagi majburiyatni bajarmaslik. Ota-onasi tirik «tirik yetimlar»."],
            ["≈ 2×", "otasiz o'sgan o'smirlarda qamoqqa tushish xavfi", "Daromad va boshqa omillar hisobga olingandan keyin ham (AQSh, uzoq muddatli kuzatuv)."],
            ["1–3 yil", "ajrimlarning aksariyati nikohning dastlabki yillarida", "Sabab — muloqot, moliya va qarindoshlar bilan munosabatga tayyor emaslik."],
          ].map(([v, t, d], i) => (
            <Reveal key={v} delay={i * 0.12} className="rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
              <p className="font-serif text-5xl font-bold text-brand-600">{v}</p>
              <p className="mt-3 font-bold">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{d}</p>
            </Reveal>
          ))}
        </div>
        <Src>Bolalar ombudsmani (Kun.uz, 2024); Harper &amp; McLanahan, «Father Absence and Youth Incarceration»</Src>
      </Light>

      {/* 4. Ildiz */}
      <Dark img="1541199249251-f713e6145474">
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Kicker dark>Ildiz sabab</Kicker>
            <Title>Oiladagi muammolarning ildizi — bilimsizlik</Title>
            <p className="mt-6 text-lg leading-relaxed text-white/75">
              Psixologiya, muloqot, oila huquqi va oila iqtisodi maktabda ham, oliy ta&apos;limda ham o&apos;rgatilmaydi. Yoshlar oilaga
              faqat to&apos;yga tayyorlanib kiradi — hayotga emas.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="space-y-3">
            {["Muloqot ko'nikmasining yo'qligi", "To'y qarzi va moliyaviy stress", "Qarindoshlarning haddan ortiq aralashuvi", "Huquqiy va tibbiy bilim yetishmasligi", "Ruhiy jihatdan tayyor emaslik"].map((t, i) => (
              <div key={t} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                <span className="font-mono text-sm font-bold text-gold-300">0{i + 1}</span>
                <span className="font-semibold">{t}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </Dark>

      {/* 5. Olimlar */}
      <Light>
        <Reveal>
          <Kicker>Dunyo ilmi</Kicker>
          <Title className="text-brand-900">Oila haqida 50 yillik ilmiy kuzatuvlar nima deydi?</Title>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["John va Julie Gottman", "3 000+ juftlikni laboratoriyada kuzatgan", "Oilani nima buzishini va nima saqlashini aniqlagan"],
            ["Sue Johnson", "Emotsiyaga yo'naltirilgan terapiya", "Janjal ortida «Men senga keraklimanmi?» degan savol turadi"],
            ["Markman va Stanley", "PREP dasturi", "Munosabatni oqimga qo'ymasdan, ongli tanlov bilan qurish"],
            ["Karney va Bradbury", "Yosh oilalarni yillab kuzatgan", "Oilani ko'pincha tashqi stress — qarz, ishsizlik buzadi"],
            ["David Olson", "PREPARE/ENRICH", "To'ydan oldingi qadriyatlar mosligi barqarorlikni bashorat qiladi"],
            ["Bowen va Minuchin", "Oila tizimlari nazariyasi", "Yosh oila ota-ona oilasidan sog'lom chegarada bo'lishi kerak"],
          ].map(([n, w, f], i) => (
            <Reveal key={n} delay={(i % 3) * 0.1} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="font-serif text-xl font-bold text-brand-800">{n}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gold-700">{w}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{f}</p>
            </Reveal>
          ))}
        </div>
      </Light>

      {/* 6. Asosiy raqamlar */}
      <Dark>
        <Reveal>
          <Kicker dark>Eng zarur bilimlar</Kicker>
          <Title>Baxtli oilaning uchta «sirli» raqami</Title>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["86% / 33%", "Kichik e'tiborga javob", "Birga qolgan juftliklar turmush o'rtog'ining kichik murojaatlariga 86% javob bergan, ajrashganlar — atigi 33%."],
            ["5 : 1", "Ijobiy va salbiy nisbati", "Baxtli juftliklarda har bir salbiy gapga kamida 5 ta ijobiy so'z, tabassum yoki minnatdorchilik to'g'ri keladi."],
            ["69%", "Hal bo'lmaydigan muammolar", "Kelishmovchiliklarning ko'pi xarakter farqidan — maqsad ularni yo'q qilish emas, hurmat bilan birga yashash."],
          ].map(([v, t, d], i) => (
            <Reveal key={v} delay={i * 0.15} className="rounded-3xl bg-gradient-to-br from-brand-700/60 to-brand-900/60 p-8 ring-1 ring-white/10">
              <p className="font-serif text-5xl font-bold text-gold-300">{v}</p>
              <p className="mt-4 text-lg font-bold">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{d}</p>
            </Reveal>
          ))}
        </div>
        <Src dark>Gottman Institute tadqiqotlari</Src>
      </Dark>

      {/* 7. 4 xavfli odat */}
      <Light>
        <Reveal>
          <Kicker>Nima qilmaslik kerak</Kicker>
          <Title className="text-brand-900">Oilani buzadigan 4 ta odat — va ularning davosi</Title>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            ["Tanqid", "«Sen doim shunaqasan!»", "«Men» tilida gapirish: «Kechiksang xavotir olaman»"],
            ["Kamsitish va masxara", "Eng xavflisi — ajrimning eng kuchli bashoratchisi", "Har kuni minnatdorchilik va hurmat bildirish"],
            ["O'zini oqlash", "Har tanbehga qarshi ayblov", "O'z ulushini tan olish: «To'g'ri, men ham xato qildim»"],
            ["Devor bo'lib olish", "Jim bo'lib qolish, uydan chiqib ketish", "«20 daqiqa tinchlanaylik» — va albatta suhbatga qaytish"],
          ].map(([h, bad, good], i) => (
            <Reveal key={h} delay={(i % 2) * 0.12} className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 bg-red-50 px-6 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">{i + 1}</span>
                <div>
                  <p className="font-bold text-red-700">{h}</p>
                  <p className="text-xs text-red-700/70">{bad}</p>
                </div>
              </div>
              <p className="px-6 py-4 text-sm"><span className="font-bold text-emerald-600">✓ Davosi:</span> {good}</p>
            </Reveal>
          ))}
        </div>
      </Light>

      {/* 8. Din va ilm */}
      <Dark img="1609220136736-443140cffec6">
        <Reveal>
          <Kicker dark>Qadriyatlarimiz</Kicker>
          <Title>Din, an&apos;ana va ilm — bir yo&apos;lda</Title>
        </Reveal>
        <div className="mt-10 space-y-4">
          {[
            ["«...O'rtangizda mehr va rahmat paydo qildi»", "Rum, 21", "Hissiy bog'liqlik — oila mustahkamligining asosi (S. Johnson)"],
            ["«Sizlarning eng yaxshilaringiz oilasiga yaxshi bo'lganlaringizdir»", "Termiziy", "Har kungi mehr va e'tibor — 86% qoidasi (Gottman)"],
            ["Payg'ambarimiz (s.a.v.) uyda oila a'zolari xizmatida bo'lganlar", "Buxoriy", "Otaning uy ishi va tarbiyadagi ishtiroki oilani saqlaydi"],
            ["«Eng barakali nikoh — xarajati eng oz bo'lganidir»", "Ahmad", "Qarzsiz boshlash — tashqi stressdan himoya (Karney va Bradbury)"],
          ].map(([q, s, sc], i) => (
            <Reveal key={s} delay={i * 0.1} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:grid-cols-[1.3fr_auto_1fr] md:items-center">
              <p className="font-serif text-lg italic">{q} <span className="not-italic text-xs text-gold-300">— {s}</span></p>
              <span className="hidden text-2xl text-gold-300 md:block">⟷</span>
              <p className="text-sm text-white/75">🔬 {sc}</p>
            </Reveal>
          ))}
        </div>
      </Dark>

      {/* 9. Ixcham to'y */}
      <Light>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <Kicker>Davlat siyosati + ta&apos;lim</Kicker>
            <Title className="text-brand-900">Ixcham to&apos;y — mustahkam oilaning birinchi qadami</Title>
            <p className="mt-5 leading-relaxed text-ink/70">
              Qarorlar bor, lekin amalda ko&apos;pincha bajarilmayapti. Chunki odatni taqiq emas, <b>tushuncha</b> o&apos;zgartiradi.
              Nikoh oldi kursi — yoshlar va ota-onalar to&apos;y haqida qaror qabul qiladigan aynan o&apos;sha payt.
            </p>
            <div className="mt-6 rounded-3xl bg-brand-800 p-6 text-white">
              <p className="font-bold text-gold-300">Bizning yechim — kursda alohida mavzu:</p>
              <ul className="mt-3 space-y-2 text-sm text-white/85">
                <li>💸 To&apos;y krediti oila hayotini qanday stress bilan boshlatadi</li>
                <li>📊 Tejangan pul bilan nima qilish mumkin: uy-joy, kasb, biznes</li>
                <li>🕌 Diniy asos: eng barakali nikoh — eng kam xarajatli</li>
                <li>👵 Qaynota-qaynonalar kursida ham — qaror ko&apos;pincha ota-onadan chiqadi</li>
              </ul>
            </div>
          </Reveal>
          <div className="space-y-4">
            <Reveal delay={0.1} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gold-700">2019-yil 14-sentabr · Oliy Majlis palatalari kengashlarining qo&apos;shma qarori</p>
              <p className="mt-1 font-bold">To&apos;y va oilaviy tantanalarni o&apos;tkazish tartibi (2020-yil 1-yanvardan)</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[["200", "mehmongacha (oshda 250)"], ["06:00–23:00", "faqat bir kunda"], ["3 ta", "mashinadan ortiq emas"], ["2 ta", "xonanda yoki 1 guruh"]].map(([v, t]) => (
                  <div key={t} className="rounded-2xl bg-brand-50 p-3">
                    <p className="font-serif text-2xl font-bold text-brand-700">{v}</p>
                    <p className="text-xs text-ink/60">{t}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink/60">Taqiqlangan: «kelin navkari», «sep yoydi», «pul sochish», isrofgarchilik va dabdaba.</p>
            </Reveal>
            <Reveal delay={0.2} className="rounded-3xl border border-gold-300 bg-gold-50 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gold-700">2025-yil · Korrupsiyaga qarshi farmon doirasida</p>
              <p className="mt-1 font-bold">To&apos;ylarni tartibga soluvchi yangi qo&apos;shma qaror loyihasi va yoshlarda tejamkorlik madaniyatini shakllantirish</p>
              <p className="mt-2 text-sm text-ink/70">Ijtimoiy roliklar, filmlar va targ&apos;ibot rejalashtirilgan. Platforma — shu targ&apos;ibotning tayyor ta&apos;lim kanali.</p>
            </Reveal>
          </div>
        </div>
        <Src>Qalampir.uz, Daryo.uz (2019); Gazeta.uz (2025-yil aprel)</Src>
      </Light>

      {/* 10. Jinsiy tarbiya */}
      <Dark>
        <Reveal>
          <Kicker dark>Jinsiy tarbiya · ilmiy dalillar</Kicker>
          <Title>Uyalmasdan, lekin odob bilan: bilim bolani himoya qiladi</Title>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            ["JSST va UNESCO", "Sifatli, yoshga mos ta'lim jinsiy hayot boshlanishini kechiktiradi va xavfli xulqni kamaytiradi. Bilim berish erta jinsiy faollikka undamaydi.", "📚"],
            ["Faqat «taqiq»ga asoslangan dasturlar", "AQShda 2017-yilgi tahlil: erta jinsiy hayotning oldini olmagan. Taqiq + tushuntirish birga bo'lgan dasturlar samaraliroq.", "⚠️"],
            ["Cochrane, 2015 · 24 tadqiqot · 5 802 bola", "«Tana xavfsizligi» darslari bolalarning himoya ko'nikmasini oshirgan, zo'ravonlik haqida aytish 1000 tadan 4 tadan 14 taga ko'tarilgan, qo'rquv oshmagan.", "🛡️"],
            ["Widman va hamkorlari, 2016 · 52 tadqiqot · 25 314 o'smir", "Ota-ona bilan ochiq suhbat — himoya omili. Ta'siri kichik, lekin barqaror; ayniqsa onalar bilan suhbatda kuchliroq.", "👪"],
          ].map(([h, d, ic], i) => (
            <Reveal key={h} delay={(i % 2) * 0.12} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-2xl">{ic}</p>
              <p className="mt-2 font-bold text-gold-300">{h}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{d}</p>
            </Reveal>
          ))}
        </div>
        <Src dark>WHO fact sheet; UNESCO International Technical Guidance (2018); Walsh et al., Cochrane (2015); Widman et al., JAMA Pediatrics (2016)</Src>
      </Dark>

      {/* 11. Jinsiy tarbiya — bizning yondashuv */}
      <Light>
        <Reveal>
          <Kicker>Milliy va diniy qadriyatlarga mos yondashuv</Kicker>
          <Title className="text-brand-900">Yoshga qarab, ota-ona bilan birga, hayo doirasida</Title>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            ["6–10 yosh", "Tana xavfsizligi", "«Mening tanam — mening omonatim», yaxshi va yomon teginish, sirni ota-onaga aytish"],
            ["10–14 yosh", "Balog'at davri", "Tanadagi o'zgarishlar, gigiyena (tahorat, g'usl), hayo, internetdagi xavflar"],
            ["15–18 yosh", "Mas'uliyat", "Reproduktiv salomatlik, erta nikoh va qarindosh nikohi zarari, hurmat va «yo'q» deya olish"],
            ["Nikoh oldidan", "Oila hayotiga tayyorgarlik", "Tibbiy ko'rik, sog'lom homiladorlik, er-xotin yaqinligi madaniyati — shifokor tilida"],
          ].map(([a, t, d], i) => (
            <Reveal key={a} delay={i * 0.1} className="relative rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
              <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">{a}</span>
              <p className="mt-4 font-serif text-xl font-bold text-brand-800">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4} className="mt-6 rounded-3xl bg-gold-50 p-5 text-sm text-ink/80">
          🤝 Har bir bosqich uchun <b>ota-onaga yo&apos;riqnoma</b>: farzand bilan qanday gaplashish kerak. Material shifokor, psixolog va ilohiyotchi
          ekspertizasidan o&apos;tadi.
        </Reveal>
      </Light>

      {/* 12. O'zbek oilasi muammolari */}
      <Dark img="1478061653917-455ba7f4a541">
        <Reveal>
          <Kicker dark>O&apos;zbekistonga xos yechimlar</Kicker>
          <Title>Dunyo ilmi + milliy an&apos;ana</Title>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["👵", "Qaynona-kelin", "Kuyov — ko'prik; qaynota-qaynonalarga alohida kurs"],
            ["💍", "Sovchilik", "An'ana saqlanadi + to'ydan oldin 20 ta muhim savol"],
            ["💸", "To'y qarzi", "Ixcham to'y va birinchi kundan oila byudjeti"],
            ["✈️", "Migratsiya", "Masofadagi oila moduli — dunyoda deyarli yo'q"],
            ["🗣", "«Odamlar nima deydi»", "Oldini olish — ha; zo'ravonlikka chidash — yo'q"],
            ["💬", "«Erkak yig'lamaydi»", "O'g'il bolalarga his-tuyg'ularini so'zlashni o'rgatish"],
            ["🧬", "Qarindosh nikohi", "Irsiy kasalliklar xavfi — tibbiy dalillar bilan"],
            ["🏘", "Mahalla", "Ajrimdan keyin emas, to'ydan oldin yordam"],
          ].map(([ic, t, d], i) => (
            <Reveal key={t} delay={(i % 4) * 0.08} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-3xl">{ic}</p>
              <p className="mt-2 font-bold">{t}</p>
              <p className="mt-1 text-sm text-white/65">{d}</p>
            </Reveal>
          ))}
        </div>
      </Dark>

      {/* 13. Platforma */}
      <Light>
        <Reveal>
          <Kicker>Platforma</Kicker>
          <Title className="text-brand-900">100% avtomatik — odam aralashuvisiz millionlab yoshlarga yetadi</Title>
        </Reveal>
        <div className="relative mt-12 grid gap-4 md:grid-cols-5">
          <div className="absolute left-0 right-0 top-10 hidden h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-gold-300 md:block" />
          {[
            ["💬", "Telegram orqali kirish", "Parolsiz, 1 daqiqada"],
            ["📚", "Kurs tanlash", "Bepul yoki Click orqali"],
            ["🎬", "Darslar", "Matn, video, har darsda test"],
            ["📝", "Imtihon", "Tasodifiy savollar banki"],
            ["🎓", "Sertifikat", "9 ballik, QR-kod bilan tekshiriladi"],
          ].map(([ic, t, d], i) => (
            <Reveal key={t} delay={i * 0.12} className="relative text-center">
              <span className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-3xl shadow-xl shadow-brand-600/30">{ic}</span>
              <p className="mt-4 font-bold">{t}</p>
              <p className="text-sm text-ink/60">{d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.5} className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            [courses.length, "kurs"],
            [users, "ro'yxatdan o'tgan"],
            [certs, "berilgan sertifikat"],
          ].map(([v, l]) => (
            <div key={String(l)} className="rounded-3xl bg-white p-6 text-center shadow-sm">
              <p className="font-serif text-4xl font-bold text-brand-600"><CountUp to={Number(v)} /></p>
              <p className="text-sm text-ink/60">{l}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-6 text-center text-sm text-ink/50">Admin panel: kurs va testlarni yaratish, to&apos;lovlar, sertifikatlar, fitbeklar va statistika — bitta joyda.</p>
      </Light>

      {/* 14. Kurslar */}
      <Dark>
        <Reveal>
          <Kicker dark>Kurslar</Kicker>
          <Title>Hayotning har bir bosqichi uchun</Title>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {courses.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08} className="group overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
              <div className="relative h-36 overflow-hidden">
                {c.image && <Image src={`${c.image}?auto=format&fit=crop&w=500&q=70`} alt={c.title} fill sizes="20vw" className="object-cover transition duration-700 group-hover:scale-110" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c0d14] to-transparent" />
              </div>
              <div className="p-4">
                <p className="font-serif text-lg font-bold">{c.title}</p>
                <p className="mt-1 text-xs text-white/60">{c.audience}</p>
                <p className="mt-3 text-xs font-bold text-gold-300">{priceLabel(c.price)} · {c.modules.reduce((s, m) => s + m._count.lessons, 0) || "tayyorlanmoqda"}{c.modules.length ? " dars" : ""}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4} className="mt-8 grid gap-3 text-sm md:grid-cols-4">
          {["🧠 Psixologiya va muloqot", "⚖️ Oila kodeksi va huquq", "🩺 Sog'lom avlod va tibbiyot", "💰 Oila iqtisodi va ixcham to'y"].map((t) => (
            <p key={t} className="rounded-2xl bg-white/5 px-4 py-3 text-center ring-1 ring-white/10">{t}</p>
          ))}
        </Reveal>
      </Dark>

      {/* 15. Dunyo tajribasi va ustunlik */}
      <Light>
        <Reveal>
          <Kicker>Dunyo tajribasi</Kicker>
          <Title className="text-brand-900">Boshqalar xatosidan o&apos;rganib, kuchliroq model</Title>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal className="space-y-3">
            {[
              ["Turkiya", "1,6 mln qatnashchi — lekin samarasi o'lchanmagan"],
              ["Malayziya", "Majburiy 2 kunlik kurs — ajrimni atigi ~1% kamaytirgan"],
              ["Eron", "1991-yildan majburiy — bilim oshgan, ajrimga ta'siri noma'lum"],
              ["OurRelationship (AQSh)", "Onlayn + murabbiy: tasodifiy tajribalarda munosabatlar sezilarli yaxshilangan"],
            ].map(([c, t]) => (
              <div key={c} className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
                <span className="w-36 shrink-0 font-bold">{c}</span>
                <span className="text-sm text-ink/70">{t}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.2} className="rounded-3xl bg-brand-800 p-7 text-white">
            <p className="font-bold text-gold-300">Meta-tahlil xulosasi (munosabat sifatiga ta&apos;sir, d):</p>
            {[
              ["Faqat onlayn, o'zi o'qiydi", 0.03],
              ["An'anaviy auditoriya kursi", 0.25],
              ["Onlayn + jonli maslahatchi", 0.43],
            ].map(([l, v], i) => (
              <div key={String(l)} className="mt-4">
                <div className="flex justify-between text-sm"><span>{l}</span><span className="font-bold">{Number(v).toFixed(2)}</span></div>
                <div className="mt-1 h-3 rounded-full bg-white/10">
                  <GrowWidth percent={Math.max(3, (Number(v) / 0.43) * 100)} delay={i * 0.15} className="h-3 rounded-full bg-gradient-to-r from-gold-300 to-brand-400" />
                </div>
              </div>
            ))}
            <p className="mt-6 text-sm text-white/80">
              ✅ Shuning uchun «Baxt oila»: onlayn kurs + <b>jonli psixolog konsultatsiyasi</b> + har dars testi + bitiruvchilar natijasini <b>6–12 oydan keyin o&apos;lchash</b>.
            </p>
          </Reveal>
        </div>
        <Src>Hawkins et al. (2008); McAllister et al. (2012); Doss et al. (2016, 2020); aile.gov.tr</Src>
      </Light>

      {/* 16. Hamkorlik va yakun */}
      <Dark img="1475503572774-15a45e5d60b9">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <Kicker dark>Davlat bilan hamkorlik</Kicker>
              <Title>Har bir yosh oila — tayyor oila</Title>
            </Reveal>
            <Reveal delay={0.15} className="mt-8 space-y-3">
              {[
                "Nikoh arizasi bilan bog'lash: FHDYo va my.gov.uz orqali kursga yo'llanma",
                "Oila va xotin-qizlar qo'mitasi ekspertizasi va sertifikatni tan olish",
                "Yoshlar agentligi va maktablar orqali «Yosh nihol» kursi",
                "To'ylarni ixchamlashtirish targ'ibotining ta'lim kanali",
                "Mahalla faollari uchun tavsiya va kuzatuv vositasi",
              ].map((t) => (
                <p key={t} className="flex gap-3 text-white/85"><span className="text-gold-300">✦</span>{t}</p>
              ))}
            </Reveal>
          </div>
          <Reveal delay={0.3} className="rounded-[2rem] bg-white/10 p-8 text-center ring-1 ring-white/20 backdrop-blur">
            <p className="font-serif text-2xl italic leading-relaxed text-gold-300">«Oila — kichik Vatan. Oila tinch bo&apos;lsa, Vatan tinch bo&apos;ladi.»</p>
            <div className="mx-auto my-8 h-px w-24 bg-white/30" />
            <div className="flex justify-center [&_*]:!text-white">
              <Logo />
            </div>
            <p className="mt-4 text-sm text-white/60">«IT Center Surxon» MChJ · Surxondaryo</p>
            <p className="mt-1 text-sm text-white/60">Rahbar: Muhammadiyev Shohjahon</p>
          </Reveal>
        </div>
      </Dark>
    </Deck>
  );
}

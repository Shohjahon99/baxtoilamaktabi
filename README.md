# Baxt oila online maktabi

To'liq avtomatik onlayn oila maktabi: Telegram orqali kirish, bepul va pullik (Click) kurslar, dars testlari, yakuniy imtihon va 9 ballik QR-kodli sertifikat.

**Stek:** Next.js 16 (App Router, server actions) · Prisma 6 · PostgreSQL (Neon) · Tailwind 4

## Ishga tushirish (lokal)

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

`.env.example` dan nusxa olib `.env` yarating. `DEV_LOGIN=1` bo'lsa, `/login` sahifasida test kirish (va Click sozlanmagan bo'lsa test to'lov) chiqadi.

## Avtomatik oqim

1. **Kirish** — `/login` → bot havolasi (`t.me/BOT?start=login_KOD`) → botda telefon raqam yuboriladi → «Kirishni tasdiqlash» → sayt so'rovni (poll) tekshirib sessiya ochadi.
2. **Kursga yozilish** — bepul kurs darhol ochiladi; pullik kurs uchun `Payment` yaratiladi va Click'ga yo'naltiriladi. Click `Complete` so'rovidan keyin kurs avtomatik ochiladi va Telegram'ga xabar ketadi.
3. **Darslar** — har dars oxirida test; ≥60% bo'lsa dars tugatilgan hisoblanadi.
4. **Imtihon** — barcha darslar tugagach ochiladi; banklardan tasodifiy savollar, sutkasiga 3 urinish.
5. **Sertifikat** — ball ≥ kursning `passingBand` (sukut bo'yicha 5.0) bo'lsa, `BO-YYYY-NNNNNN` raqamli sertifikat avtomatik beriladi; `/certificates/RAQAM` sahifasi QR orqali tekshiriladi.

## Telegram bot

- @BotFather'da bot yarating, `TELEGRAM_BOT_TOKEN` va `TELEGRAM_BOT_USERNAME` ni `.env` ga yozing.
- Lokal: `npm run bot:dev` (long polling).
- Server: webhook o'rnating:
  `https://api.telegram.org/bot<TOKEN>/setWebhook?url=<APP_URL>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>`
- `ADMIN_TELEGRAM_IDS` dagi foydalanuvchilar birinchi kirishda ADMIN bo'ladi.

## Click

Click kabinetida Prepare va Complete URL: `<APP_URL>/api/click`. `CLICK_SERVICE_ID`, `CLICK_MERCHANT_ID`, `CLICK_SECRET_KEY` to'ldiriladi.

## Kontent

Kurslar `prisma/content/` da. `npm run db:seed` xavfsiz: darslari bor kursning kontentiga tegmaydi. Kontentni qayta yozish (progress o'chadi!): `SEED_FORCE=1 npm run db:seed`. Matnlarni admin paneldan (`/admin` → dars) ham tahrirlash mumkin.

> «Ideal kuyov» kursi AI tomonidan yozilgan qoralama — huquqiy, tibbiy va diniy qismlarni mutaxassislar tekshirishi shart.

## Admin panel

`/admin` — platformadan alohida, login/parol bilan (Telegram emas). Boshlang'ich login/parol `.env` dagi `ADMIN_LOGIN` / `ADMIN_PASSWORD`; birinchi kirishdan keyin «Sozlamalar»dan almashtiring (bazada scrypt xeshi saqlanadi, eski sessiyalar yopiladi). 10 daqiqada 5 ta noto'g'ri urinishdan keyin kirish vaqtincha bloklanadi.

Bo'limlar: Dashboard · Kurslar (yaratish, tahrirlash, modul/dars, dars testlari, yakuniy imtihon banki, rasm yuklash) · Foydalanuvchilar (qidiruv, progress, kursni qo'lda ochish) · To'lovlar (qo'lda tasdiqlash/bekor qilish) · Sertifikatlar (qidiruv, bekor qilish) · Click sozlama (admin paroli bilan) · Sozlamalar.

Yuklangan rasmlar `uploads/` papkasida (gitignore'da) — serverda zaxira nusxasini oling.

## Dizayn: video, rasmlar, statistika

- **Hero video:** `public/hero.mp4` faylini qo'ysangiz, bosh sahifa fonida avtomatik ovozsiz takrorlanib o'ynaydi (fayl bo'lmasa — animatsiyali rasm). Tavsiya: 10–20 soniya, 1920×1080, 5 MB dan kichik.
- **Kurs rasmlari:** `Course.image` (hozir Unsplash, bepul litsenziya). O'z rasmlaringizni `public/` ga qo'yib, URL ni almashtirish mumkin.
- **«Oila nega muhim» statistikasi:** `lib/family-stats.ts` — har bir raqam manbasi bilan. Yangi rasmiy ma'lumot chiqqanda shu faylni yangilang.

## Vercel'ga deploy (Neon Postgres + Blob)

1. Vercel → loyiha → **Storage → Create → Neon (Postgres)** → loyihaga ulang (prefiks standart: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`).
2. **Storage → Create → Blob** → loyihaga ulang (`BLOB_READ_WRITE_TOKEN` qo'shiladi) — admin rasm yuklashi uchun.
3. **Settings → Environment Variables**: `SESSION_SECRET` (32+ belgi), `ADMIN_LOGIN`, `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`. `APP_URL` ixtiyoriy (bo'lmasa Vercel domeni).
4. Redeploy. `vercel-build` skripti o'zi: `prisma migrate deploy` → `prisma db seed` (kurslar) → `next build`.

Lokal ishlash uchun `.env` ga Neon'dagi ulanish satrlarini qo'ying (Vercel → Storage → Neon → `.env.local` bo'limi).

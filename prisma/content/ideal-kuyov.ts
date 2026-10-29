// «Ideal kuyov» kursi — AI tomonidan tayyorlangan qoralama.
// Diqqat: huquqiy, tibbiy va diniy qismlar mutaxassislar tomonidan tekshirilishi shart.
import type { CourseData } from "./types";

export const idealKuyov: CourseData = {
  slug: "ideal-kuyov",
  title: "Ideal kuyov",
  audience: "Turmush qurish arafasidagi yigitlar",
  shortDesc:
    "Oila boshlig'i bo'lishga tayyorgarlik: psixologiya, muomala, oila huquqi, sog'lom avlod va oila iqtisodi.",
  emoji: "🤵",
  image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
  color: "sky",
  price: 0,
  status: "PUBLISHED",
  order: 1,
  examSize: 20,
  description: `Ushbu kurs turmush qurishni rejalashtirayotgan yigitlar uchun mo'ljallangan. Kurs davomida siz:

- oilaning mohiyati va turmushga **haqiqiy tayyorlik** nimadan iboratligini;
- ayol va erkak psixologiyasidagi farqlarni, **tinglash va kelishish** san'atini;
- O'zbekiston **Oila kodeksi** bo'yicha nikoh tartibi, er-xotinning huquq va majburiyatlarini;
- nikohdan oldingi **tibbiy ko'rik** va sog'lom avlod haqidagi bilimlarni;
- oila **byudjeti**, qarindoshlar bilan munosabat va **otalik mas'uliyatini** o'rganasiz.

Har bir dars oxirida qisqa test bor. Barcha darslarni tugatgach, yakuniy imtihon topshirasiz va 9 ballik tizimda baholangan sertifikat olasiz.

> Kurs materiallari mutaxassislar ishtirokida doimiy yangilanib boriladi.`,
  modules: [
    {
      title: "Oila — hayot poydevori",
      lessons: [
        {
          title: "Oila nima va nega u muhim?",
          minutes: 12,
          isPreview: true,
          content: `## Oila — jamiyatning birinchi hujayrasi

Inson shaxs sifatida birinchi navbatda oilada shakllanadi. Bola mehr-muhabbatni, hurmatni, mas'uliyatni va hatto Vatanga sadoqatni ham avvalo oilada ko'radi va o'rganadi. Shuning uchun xalqimiz «Oila — kichik Vatan» deydi.

Mustahkam oila — bu nafaqat er va xotinning baxti, balki:

- **farzandlarning sog'lom ruhiy rivojlanishi** — tinch oilada o'sgan bola o'ziga ishonchli, jamiyatga moslashgan bo'ladi;
- **huquqbuzarliklarning oldini olish** — tadqiqotlar voyaga yetmaganlar orasidagi huquqbuzarliklarning katta qismi oiladagi muammolar va ajrimlar bilan bog'liqligini ko'rsatadi;
- **iqtisodiy barqarorlik** — oilada tinchlik bor odam ishda ham unumli ishlaydi.

## Nega bugun bu mavzu dolzarb?

Statistika ma'lumotlariga ko'ra, O'zbekistonda har yili 290–300 mingga yaqin nikoh tuziladi, ammo ajrimlar soni ham yildan-yilga oshib bormoqda. Ajrimlarning katta qismi **turmushning dastlabki 1–3 yilida**, ya'ni yosh oilalarda yuz beradi.

Mutaxassislar buning asosiy sabablari sifatida quyidagilarni ko'rsatadi:

1. Yoshlarning oilaviy hayotga **psixologik va amaliy jihatdan tayyor emasligi**;
2. Er-xotin o'rtasida **muloqot ko'nikmasining yo'qligi**;
3. **Moliyaviy muammolar** va katta to'y xarajatlari ortidan kelgan qarzlar;
4. Qarindoshlarning oila ishlariga **haddan ortiq aralashuvi**;
5. Huquqiy va tibbiy **bilimlarning yetishmasligi**.

E'tibor bering: bu sabablarning deyarli barchasi **bilim va tayyorgarlik** bilan bog'liq. Demak, ularning oldini olish mumkin.

> «Kasallikni davolagandan ko'ra, uning oldini olgan afzal.»

## Bu kursdan nima kutish mumkin?

Biz sizga «ideal» bo'lishni o'rgatmoqchi emasmiz — ideal odam bo'lmaydi. Maqsad — **ongli, mas'uliyatli va tayyor** kuyov bo'lish. Oila qurish — bu bir kunlik to'y emas, balki butun umrlik ish. Har qanday ish kabi unga ham tayyorgarlik kerak.`,
          quiz: [
            {
              text: "Mutaxassislarga ko'ra, ajrimlarning katta qismi qaysi davrda yuz beradi?",
              options: ["Turmushning dastlabki 1–3 yilida", "Turmushning 20 yilidan keyin", "Faqat farzandlar katta bo'lganda", "Nafaqa yoshida"],
              correct: 0,
              explanation: "Yosh oilalarda tayyorgarlik yetishmasligi sabab ajrimlar ko'proq dastlabki yillarda bo'ladi.",
            },
            {
              text: "Quyidagilardan qaysi biri ajrimlarning asosiy sabablaridan biri sifatida ko'rsatilgan?",
              options: ["Oilada kitob ko'pligi", "Er-xotin o'rtasida muloqot ko'nikmasining yo'qligi", "Uyning kattaligi", "Sport bilan shug'ullanish"],
              correct: 1,
            },
            {
              text: "Kursning asosiy maqsadi nima?",
              options: ["Mukammal, xatosiz odam bo'lish", "Faqat to'yni yaxshi o'tkazish", "Ongli, mas'uliyatli va oilaga tayyor kuyov bo'lish", "Qarindoshlarni rozi qilish"],
              correct: 2,
            },
          ],
        },
        {
          title: "Turmushga tayyorlik: yosh emas, yetuklik",
          minutes: 12,
          content: `## Tayyorlik nimadan iborat?

Ko'pchilik «yoshim yetdi — uylanish vaqti keldi» deb o'ylaydi. Ammo qonuniy nikoh yoshiga yetish — bu faqat **eng kamida zarur shart**. Haqiqiy tayyorlik bir nechta yo'nalishdan iborat:

### 1. Ruhiy (emotsional) yetuklik
- O'z his-tuyg'ularingizni, ayniqsa jahlingizni boshqara olasizmi?
- Xatoingizni tan olib, kechirim so'ray olasizmi?
- Boshqa odamning fikrini, hatto u siznikidan farq qilsa ham, hurmat qila olasizmi?

### 2. Iqtisodiy tayyorlik
Oila boshlig'i oilani **ta'minlash mas'uliyatini** oladi. Bu katta boylik degani emas, lekin barqaror daromad manbai, kasb yoki hech bo'lmaganda aniq reja bo'lishi kerak.

### 3. Mustaqillik
Uylanadigan yigit kundalik masalalarni o'zi hal qila olishi kerak: qaror qabul qilish, hujjatlar bilan ishlash, uy-ro'zg'or ishlariga yordam berish. Har bir kichik masalada ota-onasiga suyanib qolgan yigit oilada ham qiyinchilikka uchraydi.

### 4. Ma'naviy tayyorlik
Oila — bu **«men»dan «biz»ga** o'tish. Endi qarorlar faqat siz uchun emas, umr yo'ldoshingiz va kelajakdagi farzandlaringiz uchun ham qabul qilinadi.

## O'zingizni tekshiring

Quyidagi savollarga o'zingizga halol javob bering:

| Savol | Ha | Yo'q |
|---|---|---|
| Doimiy daromadim yoki aniq kasbim bor | | |
| Janjal paytida baqirmasdan gaplasha olaman | | |
| Uy ishlarida yordam berishni or deb bilmayman | | |
| Turmush o'rtog'im bilan maslahatlashib qaror qabul qilishga tayyorman | | |
| Uylanish qarori o'zimniki, bosim ostida emas | | |

Agar ko'p javoblaringiz «yo'q» bo'lsa — bu xavotir uchun sabab emas, balki **o'sish uchun yo'nalish**. Ayni shu kurs sizga bu yo'lda yordam beradi.

## Bosim ostida uylanmang

«Qo'ni-qo'shnilar nima deydi», «tengdoshlaring uylanib bo'ldi» kabi gaplar ta'sirida qabul qilingan qaror ko'pincha keyinchalik pushaymonlikka olib keladi. Nikoh — **ikki kishining ixtiyoriy va ongli qarori** bo'lishi kerak. Bu hatto qonunda ham mustahkamlangan: nikoh faqat tomonlarning o'zaro roziligi bilan tuziladi.`,
          quiz: [
            {
              text: "Turmushga tayyorlikning eng to'g'ri ta'rifi qaysi?",
              options: ["Faqat nikoh yoshiga yetish", "Ruhiy, iqtisodiy, mustaqillik va ma'naviy yetuklik", "Katta to'y uchun pul yig'ish", "Ota-onaning qaror qilishi"],
              correct: 1,
            },
            {
              text: "Oila qurishda «men»dan «biz»ga o'tish nimani anglatadi?",
              options: [
                "Qarorlarni faqat o'zi uchun qabul qilish",
                "Qarorlarni umr yo'ldoshi va farzandlarni ham hisobga olib qabul qilish",
                "Do'stlar bilan ko'proq vaqt o'tkazish",
                "Hamma qarorni qarindoshlarga topshirish",
              ],
              correct: 1,
            },
            {
              text: "Qonunga ko'ra nikoh qanday tuziladi?",
              options: ["Ota-onalar kelishuvi bilan", "Faqat kuyovning xohishi bilan", "Tomonlarning o'zaro ixtiyoriy roziligi bilan", "Mahalla qarori bilan"],
              correct: 2,
            },
          ],
        },
        {
          title: "Juft tanlash: nimalarga e'tibor berish kerak?",
          minutes: 14,
          content: `## Tashqi ko'rinishdan chuqurroq qarang

Juft tanlashda ko'pchilik birinchi navbatda tashqi ko'rinishga, oilaning moddiy ahvoliga yoki boshqalarning fikriga qaraydi. Albatta, yoqtirish muhim. Ammo uzoq yillik baxtli turmush uchun quyidagilar ancha muhimroq:

### Qadriyatlar mosligi
Hayotdagi asosiy masalalar bo'yicha qarashlaringiz qanchalik yaqin?
- Din va urf-odatlarga munosabat;
- Farzandlar tarbiyasi haqidagi tasavvurlar;
- Ayolning o'qishi va ishlashiga munosabat;
- Qayerda yashash (ota-ona bilan yoki alohida).

Bu savollarni **to'ydan oldin** ochiq muhokama qilish keyingi ko'plab janjallarning oldini oladi.

### Xarakter va muomala
Bo'lajak umr yo'ldoshingiz:
- jahli chiqqanda o'zini qanday tutadi?
- ota-onasi, ukalari va xizmat ko'rsatuvchi odamlar bilan qanday muomala qiladi?
- muammoni muhokama qila oladimi yoki gapirmay qo'yadimi?

> Odamning haqiqiy xarakteri u sizga emas, boshqalarga qanday munosabatda bo'lishida ko'rinadi.

### Oila muhiti
Har bir inson o'z oilasidagi munosabatlar modelini o'zi bilan olib keladi. Bu hukm chiqarish uchun emas, balki **tushunish** uchun muhim. Shuning uchun ikki oila bir-biri bilan yaxshi tanishishi foydali.

## Qarindoshlar o'rtasidagi nikoh

O'zbekistonda yaqin qarindoshlar (masalan, amakivachcha, xolavachcha) o'rtasidagi nikohlar hali ham uchrab turadi. Tibbiyot shuni ko'rsatadiki, bunday nikohlarda farzandlarda **irsiy kasalliklar** paydo bo'lish xavfi sezilarli darajada yuqori bo'ladi. Bu haqda «Tibbiy ko'rik» darsida batafsil gaplashamiz.

## Majburlash — qat'iyan yo'q

Yigit yoki qizni uning xohishiga qarshi turmushga majburlash nafaqat axloqan noto'g'ri, balki **qonunga zid**. O'zaro rozilik — mustahkam oilaning birinchi sharti.

## Amaliy maslahat

Tanishuv davrida bir-biringizga quyidagi savollarni bering:
1. Besh yildan keyin o'zingizni qayerda ko'rasiz?
2. Oilada pul masalalarini kim va qanday hal qilishi kerak deb o'ylaysiz?
3. Kelishmovchilik bo'lsa, uni qanday hal qilish kerak?

Javoblar mos kelmasa ham xavotir olmang — muhimi, ular haqida **gaplasha olishingiz**.`,
          quiz: [
            {
              text: "Juft tanlashda uzoq muddatli baxt uchun eng muhim omillardan biri qaysi?",
              options: ["Faqat tashqi ko'rinish", "Oilaning boyligi", "Hayotiy qadriyatlar va xarakter mosligi", "Qo'shnilarning fikri"],
              correct: 2,
            },
            {
              text: "Yaqin qarindoshlar o'rtasidagi nikohning asosiy tibbiy xavfi nima?",
              options: ["Hech qanday xavf yo'q", "Farzandlarda irsiy kasalliklar xavfining ortishi", "Faqat iqtisodiy zarar", "To'y xarajatining oshishi"],
              correct: 1,
            },
            {
              text: "Odamning haqiqiy xarakteri ko'proq nimada namoyon bo'ladi?",
              options: ["Sizga sovg'a berishida", "Ijtimoiy tarmoqdagi rasmlarida", "Boshqa odamlarga qanday munosabatda bo'lishida", "Kiyinishida"],
              correct: 2,
            },
          ],
        },
      ],
    },
    {
      title: "Muomala madaniyati va oila psixologiyasi",
      lessons: [
        {
          title: "Erkak va ayol: bir-birini tushunish",
          minutes: 13,
          content: `## Farqlar — muammo emas, boylik

Erkak va ayol ko'p narsani turlicha qabul qilishi mumkin. Bu farqlarni bilish va hurmat qilish oiladagi ko'plab tushunmovchiliklarning oldini oladi. Albatta, har bir inson individual — quyidagilar umumiy tendensiyalar, qat'iy qoidalar emas.

### Muammoga yondashuv
- Ko'pincha erkaklar muammo haqida eshitganda darhol **yechim taklif qilishga** shoshiladi.
- Ayollar esa ko'pincha avval **eshitilishni va tushunilishni** xohlaydi; yechim keyinroq kerak bo'ladi.

**Misol:** Turmush o'rtog'ingiz ishdagi qiyin kun haqida gapirmoqda. «Unda ishdan ket» deyish o'rniga, avval: «Haqiqatan ham og'ir kun bo'lgan ekan, nima bo'ldi?» deb so'rang. Ko'pincha shuning o'zi yetarli bo'ladi.

### E'tibor va minnatdorchilik
Har bir inson **qadrlanganini his qilishga** muhtoj. Kichik e'tibor belgilari — rahmat aytish, kichik sovg'a, birga choy ichish, telefon qilib holini so'rash — katta sovg'alardan ham ko'proq ta'sir qiladi.

### Hissiyotlarni ifodalash
O'g'il bolalarga ko'pincha bolalikdan «erkak yig'lamaydi», «hissiyotingni ko'rsatma» deyiladi. Natijada ko'p erkaklar his-tuyg'ularini so'z bilan ifodalashda qiynaladi. Oilada esa «Men xafa bo'ldim», «Men charchadim», «Senga minnatdorman» degan oddiy gaplar juda muhim.

## Hurmat — har qanday munosabatning asosi

Sevgi hissi vaqti-vaqti bilan susayishi mumkin, ammo **hurmat** saqlanib qolsa, munosabatlar ham saqlanadi. Hurmat bu:
- turmush o'rtog'ingizni boshqalar oldida kamsitmaslik;
- uning fikrini so'rash va inobatga olish;
- shaxsiy hayoti, ota-onasi va do'stlariga hurmat bilan qarash.

> Oilada «kim haq» emas, «biz qanday qilib birga yaxshiroq yashaymiz» degan savol muhim.

## Rashk va nazorat

Biroz rashk tabiiy bo'lishi mumkin, ammo telefonni tekshirish, har qadamni nazorat qilish, do'stlar bilan ko'rishishni taqiqlash — bular **sevgi emas, ishonchsizlik** belgisidir. Bunday xatti-harakatlar oilaviy munosabatlarni buzadi.`,
          quiz: [
            {
              text: "Turmush o'rtog'ingiz qiyin kuni haqida gapirganda eng yaxshi birinchi qadam qaysi?",
              options: ["Darhol yechim aytish", "Mavzuni o'zgartirish", "Avval tinglab, hamdardlik bildirish", "Uni ayblash"],
              correct: 2,
            },
            {
              text: "Munosabatlarni uzoq yillar saqlab turadigan asosiy omil qaysi deb ko'rsatilgan?",
              options: ["Qimmat sovg'alar", "Hurmat", "Doimiy nazorat", "Ko'p pul"],
              correct: 1,
            },
            {
              text: "Turmush o'rtog'ining telefonini doimiy tekshirish nimaning belgisi?",
              options: ["Kuchli sevgining", "G'amxo'rlikning", "Ishonchsizlikning", "Mas'uliyatning"],
              correct: 2,
            },
          ],
        },
        {
          title: "Tinglash va gaplashish san'ati",
          minutes: 12,
          content: `## Oilada eng ko'p yetishmaydigan ko'nikma

Psixologlarning kuzatishicha, oilaviy maslahatga murojaat qilgan juftliklarning eng ko'p uchraydigan shikoyati — **«U meni eshitmaydi»**. Tinglash — bu shunchaki jim turish emas, balki faol jarayon.

## Faol tinglashning 4 qoidasi

1. **Diqqatni to'liq qarating.** Gaplashayotganda telefonni chetga qo'ying, televizorni o'chiring, ko'zga qarang.
2. **Gapni bo'lmang.** Suhbatdoshingiz fikrini oxirigacha aytib bo'lsin.
3. **Tushunganingizni qaytaring.** «Demak, sen meni ota-onang oldida qo'llab-quvvatlamaganimdan xafa bo'lding, shundaymi?»
4. **Hissiyotni tan oling.** «Seni tushunaman, bu haqiqatan ham alamli».

## «Men» tilida gapiring

Ayblovchi gaplar suhbatdoshni himoyalanishga majbur qiladi va janjal kuchayadi. Uning o'rniga o'z hissiyotingiz haqida gapiring:

| ❌ Ayblovchi («Sen» tili) | ✅ Konstruktiv («Men» tili) |
|---|---|
| Sen hech qachon vaqtida kelmaysan! | Kechikkaningda xavotir olaman, iltimos, oldindan xabar ber. |
| Sen meni umuman tushunmaysan! | Men o'zimni tushunilmagandek his qilyapman, keling, yana gaplashaylik. |
| Sening onang doim aralashadi! | Ba'zi qarorlarni ikkalamiz o'zimiz qabul qilsak, menga yengilroq bo'lardi. |

## Gaplashish uchun to'g'ri vaqt

Jiddiy mavzularni muhokama qilish uchun:
- ikkalangiz ham **charchamagan, och bo'lmagan** paytni tanlang;
- boshqalar (ayniqsa qarindoshlar va bolalar) **guvoh bo'lmasin**;
- bir vaqtda faqat **bitta muammo** haqida gapiring, eski xafagarchiliklarni qo'shmang.

## Kundalik muloqot odati

Har kuni 15–20 daqiqa faqat bir-biringiz uchun ajrating: kun qanday o'tdi, nima quvontirdi, nima tashvishlantirdi. Bu kichik odat yillar davomida oilani mustahkam ushlab turadi.`,
          quiz: [
            {
              text: "Faol tinglashning qoidalaridan biri qaysi?",
              options: ["Gapni tezroq bo'lish", "Tushunganingizni o'z so'zlaringiz bilan qaytarish", "Telefonda yozishib o'tirish", "Darhol tanqid qilish"],
              correct: 1,
            },
            {
              text: "Qaysi gap «Men» tilida aytilgan?",
              options: ["Sen doim kechikasan!", "Sen hech narsani tushunmaysan!", "Kechikkaningda xavotir olaman, oldindan xabar ber", "Hammasi sening aybing"],
              correct: 2,
            },
            {
              text: "Jiddiy mavzuni muhokama qilish uchun qaysi holat eng mos?",
              options: [
                "Qarindoshlar yig'ilganda",
                "Ikkalasi ham charchagan va och paytda",
                "Tinch, xoli vaqtda, bir vaqtda bitta muammo haqida",
                "Ish paytida telefonda",
              ],
              correct: 2,
            },
          ],
        },
        {
          title: "Nizolarni hal qilish: janjalsiz kelishish",
          minutes: 14,
          content: `## Kelishmovchilik — tabiiy hol

Hech bir oila kelishmovchiliksiz yashamaydi. Muhimi — kelishmovchilik bo'ladimi-yo'qmi emas, balki **u qanday hal qilinadi**. Sog'lom oilada nizolar munosabatni buzmaydi, aksincha, bir-birini yaxshiroq tushunishga yordam beradi.

## Oilani buzadigan 4 xavfli odat

Oilaviy munosabatlar bo'yicha tadqiqotlar quyidagi xatti-harakatlar ajrimning eng kuchli bashoratchilari ekanini ko'rsatadi:

1. **Tanqid** — xatti-harakatni emas, shaxsni ayblash: «Sen dangasasan».
2. **Kamsitish (nafrat)** — masxara qilish, ko'z o'ynatish, kinoya. Bu eng zararlisi.
3. **O'zini oqlash** — har qanday tanbehga javoban faqat qarshi ayblov qilish.
4. **Devor bo'lib olish** — gaplashishdan bosh tortish, jim bo'lib qolish, uydan chiqib ketish.

## Ularning o'rniga nima qilish kerak?

| Xavfli odat | Uning o'rniga |
|---|---|
| Tanqid | Aniq xatti-harakat va o'z hissingiz haqida gapiring |
| Kamsitish | Minnatdorchilik va hurmat madaniyatini shakllantiring |
| O'zini oqlash | O'z ulushingiz uchun mas'uliyatni tan oling: «To'g'ri, men ham xato qildim» |
| Devor bo'lib olish | Tanaffus so'rang: «20 daqiqa tinchlanib, keyin gaplashaylik» — va albatta qayting |

## Nizoni hal qilish bosqichlari

1. **Tinchlaning.** Jahl ustida aytilgan so'z keyin qaytib olinmaydi.
2. **Muammoni aniqlang.** Aslida nima haqida bahslashyapsiz?
3. **Ikkala tomonni tinglang.** Har biri o'z fikrini to'liq aytsin.
4. **Variantlarni toping.** Ikkalangizga ham maqbul bo'lgan 2–3 yechim o'ylab ko'ring.
5. **Kelishib oling va bajaring.**

## Qizil chiziq: zo'ravonlik

Hech qanday vaziyatda **jismoniy, ruhiy yoki iqtisodiy zo'ravonlik** qo'llanilishi mumkin emas. Baqirish, haqorat qilish, qo'rqitish, pulsiz qoldirish ham zo'ravonlik turlari hisoblanadi. O'zbekistonda «Xotin-qizlarni tazyiq va zo'ravonlikdan himoya qilish to'g'risida»gi qonun amal qiladi va zo'ravonlik uchun javobgarlik belgilangan.

> Haqiqiy erkaklik — kuch ishlatishda emas, o'zini boshqara olishda.

## Kechirim so'rash va kechira olish

«Kechir, men noto'g'ri qildim» deyish — zaiflik emas, yetuklik belgisi. Kechirishni bilish esa oilada eski xafagarchiliklar to'planib qolishining oldini oladi.`,
          quiz: [
            {
              text: "Tadqiqotlarga ko'ra, eng zararli oilaviy odat qaysi?",
              options: ["Tanaffus so'rash", "Kamsitish va masxara qilish", "Minnatdorchilik bildirish", "Kechirim so'rash"],
              correct: 1,
            },
            {
              text: "«Devor bo'lib olish» o'rniga nima qilish tavsiya etiladi?",
              options: [
                "Uydan butunlay chiqib ketish",
                "Bir hafta gaplashmaslik",
                "Tanaffus so'rab, tinchlangach suhbatga qaytish",
                "Qarindoshlarni chaqirish",
              ],
              correct: 2,
            },
            {
              text: "Quyidagilardan qaysi biri ham zo'ravonlik turi hisoblanadi?",
              options: ["Birga sayrga chiqish", "Haqorat qilish va qo'rqitish", "Maslahatlashish", "Minnatdorchilik aytish"],
              correct: 1,
            },
          ],
        },
      ],
    },
    {
      title: "Huquqiy va tibbiy bilimlar",
      lessons: [
        {
          title: "Oila kodeksi: nikoh qanday tuziladi?",
          minutes: 14,
          content: `## Nikoh — huquqiy ittifoq

O'zbekiston Respublikasi qonunchiligiga ko'ra, faqat **FHDYo (fuqarolik holati dalolatnomalarini yozish) organlarida** ro'yxatdan o'tkazilgan nikoh tan olinadi va huquqiy oqibatlarga ega bo'ladi.

> **Muhim:** Faqat diniy marosim (nikoh o'qitish) yoki to'y — bu qonuniy nikoh emas. Bunday holatda ayol va bolalarning mulkiy va boshqa huquqlari himoyasiz qolishi mumkin. Shuning uchun avval davlat ro'yxatidan o'tish shart.

## Nikoh tuzish shartlari

1. **O'zaro ixtiyoriy rozilik.** Nikoh faqat bo'lajak er va xotinning erkin roziligi bilan tuziladi.
2. **Nikoh yoshi.** O'zbekistonda nikoh yoshi erkaklar va ayollar uchun **18 yosh** etib belgilangan. Alohida hollarda qonunda belgilangan tartibda bu yosh ko'pi bilan bir yilga kamaytirilishi mumkin.
3. **Tibbiy ko'rik.** Nikohlanuvchilar nikohdan oldin majburiy tibbiy ko'rikdan o'tadilar.

## Nikoh tuzilishiga to'sqinlik qiladigan holatlar

Qonunga ko'ra nikoh tuzilishiga yo'l qo'yilmaydi:
- shaxslardan biri boshqa **ro'yxatdan o'tgan nikohda** bo'lsa;
- **yaqin qarindoshlar** o'rtasida (ota-ona va farzand, aka-uka, opa-singillar va boshqalar);
- farzandlikka oluvchi va farzandlikka olingan shaxs o'rtasida;
- shaxslardan biri ruhiy kasallik sababli sud tomonidan **muomalaga layoqatsiz** deb topilgan bo'lsa.

## Nikoh tuzish tartibi

1. Bo'lajak er-xotin birgalikda FHDYo organiga (bugungi kunda ko'plab hollarda Davlat xizmatlari markazlari yoki elektron xizmatlar orqali ham) **ariza** beradilar.
2. Odatda nikoh ariza berilgan kundan **bir oy o'tgach** tuziladi. Bu muddat tomonlarga qarorni yana bir bor o'ylab ko'rish imkonini beradi. Uzrli sabablar bo'lsa, muddat qisqartirilishi mumkin.
3. Shu davrda **tibbiy ko'rikdan** o'tiladi.
4. Belgilangan kunda nikoh tantanali yoki oddiy tartibda ro'yxatdan o'tkaziladi va **nikoh guvohnomasi** beriladi.

## Nikoh shartnomasi

Er-xotin o'zlarining mulkiy huquq va majburiyatlarini **nikoh shartnomasi** orqali belgilashlari mumkin. U nikohdan oldin ham, nikoh davomida ham tuzilishi va notarial tasdiqlanishi kerak. Bu ishonchsizlik belgisi emas, balki oldindan kelishib olish vositasidir.

*Eslatma: qonunchilik o'zgarib turishi mumkin. Aniq holatingiz bo'yicha FHDYo organi yoki yurist bilan maslahatlashing.*`,
          quiz: [
            {
              text: "O'zbekistonda qaysi nikoh huquqiy jihatdan tan olinadi?",
              options: ["Faqat to'y o'tkazilgan nikoh", "Faqat diniy nikoh", "FHDYo organlarida ro'yxatdan o'tkazilgan nikoh", "Mahallada e'lon qilingan nikoh"],
              correct: 2,
            },
            {
              text: "O'zbekistonda erkaklar va ayollar uchun belgilangan nikoh yoshi necha yosh?",
              options: ["16 yosh", "17 yosh", "18 yosh", "21 yosh"],
              correct: 2,
            },
            {
              text: "Nikoh odatda ariza berilgandan qancha vaqt o'tgach tuziladi?",
              options: ["Shu kuniyoq", "Bir hafta", "Bir oy", "Bir yil"],
              correct: 2,
            },
          ],
        },
        {
          title: "Er va xotinning huquq va majburiyatlari",
          minutes: 13,
          content: `## Tenglik tamoyili

Qonunga ko'ra, oilada **er va xotin teng huquqlarga** ega. Oilaviy hayotga oid barcha masalalar — farzand tarbiyasi, yashash joyi, oila byudjeti — er-xotin tomonidan **birgalikda** hal qilinadi.

## Shaxsiy huquqlar

- Har bir er-xotin **kasb, mashg'ulot va yashash joyini** tanlashda erkin.
- Nikohdan keyin er-xotin istagiga ko'ra umumiy familiyani tanlashi yoki o'z familiyasini saqlab qolishi mumkin.
- Hech kim turmush o'rtog'ini o'qishdan, ishlashdan yoki qarindoshlari bilan ko'rishishdan **majburan** cheklashga haqli emas.

## Mulkiy munosabatlar

### Umumiy mulk
Nikoh davomida orttirilgan mol-mulk (ish haqi, uy, avtomobil va hokazo) — kim nomiga rasmiylashtirilganidan va kim ishlab topganidan qat'i nazar — odatda er-xotinning **umumiy birgalikdagi mulki** hisoblanadi. Uy bekasi bo'lgan ayolning uy-ro'zg'or va bola tarbiyasi bilan band bo'lishi ham oila farovonligiga qo'shilgan hissa sifatida e'tirof etiladi.

### Shaxsiy mulk
Quyidagilar odatda har birining **shaxsiy mulki** hisoblanadi:
- nikohgacha bo'lgan mol-mulk;
- nikoh davrida sovg'a yoki meros tariqasida olingan mol-mulk;
- shaxsiy foydalanish buyumlari (qimmatbaho zeb-ziynatlardan tashqari).

## O'zaro ta'minot majburiyati

Er-xotin bir-birini **moddiy jihatdan qo'llab-quvvatlashi** shart. Masalan, homiladorlik davrida va farzand tug'ilgandan keyin ma'lum muddat ayol erdan ta'minot olishga haqli.

## Farzandlar oldidagi majburiyatlar

Ota-onalar farzandlari oldida **teng huquq va majburiyatlarga** ega: ularni tarbiyalash, sog'lig'i va ta'limi haqida g'amxo'rlik qilish. Ajrim bo'lgan taqdirda ham ota farzandini ta'minlash majburiyatidan ozod bo'lmaydi. Qonunga ko'ra voyaga yetmagan farzandlar uchun aliment odatda ota-onaning daromadidan quyidagicha undiriladi:

| Farzandlar soni | Daromaddan ulush |
|---|---|
| 1 nafar | 1/4 qism |
| 2 nafar | 1/3 qism |
| 3 va undan ortiq | 1/2 qism |

> Qonun — oxirgi chora. Baxtli oilada bu masalalar sudda emas, mehr va kelishuv bilan hal bo'ladi. Ammo o'z huquq va majburiyatlarini bilish har bir oila a'zosini himoya qiladi.`,
          quiz: [
            {
              text: "Qonunga ko'ra oiladagi asosiy masalalar qanday hal qilinadi?",
              options: ["Faqat er tomonidan", "Faqat qaynona tomonidan", "Er-xotin tomonidan birgalikda", "Mahalla tomonidan"],
              correct: 2,
            },
            {
              text: "Nikoh davrida meros sifatida olingan mol-mulk odatda kimning mulki hisoblanadi?",
              options: ["Er-xotinning umumiy mulki", "Meros olgan shaxsning shaxsiy mulki", "Davlat mulki", "Qaynota mulki"],
              correct: 1,
            },
            {
              text: "Bitta voyaga yetmagan farzand uchun aliment odatda daromadning qancha qismi miqdorida undiriladi?",
              options: ["1/2 qism", "1/3 qism", "1/4 qism", "1/10 qism"],
              correct: 2,
            },
          ],
        },
        {
          title: "Nikohdan oldingi tibbiy ko'rik va sog'lom avlod",
          minutes: 14,
          content: `## Nega tibbiy ko'rik kerak?

Nikohdan oldingi tibbiy ko'rik — bu ishonchsizlik emas, balki **o'zingiz, umr yo'ldoshingiz va bo'lajak farzandlaringizga g'amxo'rlik**. O'zbekistonda nikohlanuvchilar uchun tibbiy ko'rik majburiy hisoblanadi.

Ko'rikning maqsadi:
- yuqumli kasalliklarni (sil, jinsiy yo'l bilan yuqadigan infeksiyalar, OIV va boshqalar) **o'z vaqtida aniqlash va davolash**;
- irsiy kasalliklar xavfini baholash;
- bo'lajak homiladorlikka tayyorgarlik ko'rish.

Ko'rik natijalari **tibbiy sir** hisoblanadi va bo'lajak er-xotinga ma'lum qilinadi. Natijalar haqida bir-biringizga ochiq bo'lish — halollik va mas'uliyat belgisi.

## Ko'rik nimalarni o'z ichiga oladi?

Odatda quyidagi mutaxassislar ko'rigi va tahlillar o'tkaziladi (aniq ro'yxat tibbiyot muassasasi tomonidan belgilanadi):
- terapevt, dermatovenerolog, psixiatr, narkolog;
- ayollar uchun ginekolog, zarur bo'lsa — genetik maslahat;
- qon tahlillari, flyuorografiya.

### Qon guruhi va rezus-omil
Ayol rezus-manfiy, erkak esa rezus-musbat bo'lsa, homiladorlik davrida maxsus kuzatuv talab qilinishi mumkin. Bu nikohga to'siq emas — shunchaki shifokor bilan oldindan maslahat kerak.

## Qarindoshlar nikohi va irsiy kasalliklar

Yaqin qarindoshlarda bir xil «yashirin» kasallik genlari bo'lish ehtimoli yuqori. Shu sabab ular farzandlarida **irsiy kasalliklar** (masalan, ayrim qon kasalliklari, eshitish va ko'rish nuqsonlari, aqliy rivojlanish muammolari) paydo bo'lish xavfi oddiy nikohlarga qaraganda bir necha baravar yuqori bo'lishi mumkin. Shuning uchun shifokorlar qarindoshlar o'rtasidagi nikohdan saqlanishni maslahat beradi; agar shunday nikoh rejalashtirilsa, albatta **tibbiy-genetik maslahat** olish lozim.

## Sog'lom turmush tarzi

Bo'lajak ota sog'lig'i ham farzand sog'lig'iga ta'sir qiladi:
- **chekish va alkogol** — reproduktiv salomatlikka jiddiy zarar yetkazadi;
- to'g'ri ovqatlanish va jismoniy faollik;
- surunkali kasalliklarni nikohdan oldin davolash.

## Intim hayot madaniyati

Er-xotin o'rtasidagi yaqinlik — oilaviy baxtning muhim qismi. Uning asosi — **o'zaro hurmat, sabr va rozilik**. Bu mavzuda ishonchsiz manbalardan (internetdagi tasodifiy videolar) emas, shifokor va ishonchli adabiyotlardan bilim olish kerak. Savollar bo'lsa, uyalmasdan mutaxassisga murojaat qiling.`,
          quiz: [
            {
              text: "Nikohdan oldingi tibbiy ko'rikning asosiy maqsadlaridan biri qaysi?",
              options: [
                "To'yni kechiktirish",
                "Kasalliklarni o'z vaqtida aniqlash va irsiy xavfni baholash",
                "Qarindoshlarga hisobot berish",
                "Faqat rasmiyatchilik",
              ],
              correct: 1,
            },
            {
              text: "Yaqin qarindoshlar nikohida farzandlarda nima xavfi ortadi?",
              options: ["Irsiy kasalliklar", "Bo'y o'sishi", "Ko'p tillilik", "Hech narsa"],
              correct: 0,
            },
            {
              text: "Ayol rezus-manfiy, erkak rezus-musbat bo'lsa, nima qilish kerak?",
              options: [
                "Nikoh qat'iyan taqiqlanadi",
                "Hech narsa qilish shart emas",
                "Homiladorlik davrida shifokor kuzatuvi va oldindan maslahat olish",
                "Faqat dori ichish",
              ],
              correct: 2,
            },
          ],
        },
      ],
    },
    {
      title: "Mas'uliyatli er va ota",
      lessons: [
        {
          title: "Oila iqtisodi: byudjet, qarz va to'y xarajatlari",
          minutes: 13,
          content: `## To'y — bir kun, oila — bir umr

Ko'plab yosh oilalar hayotini **katta qarz bilan** boshlaydi: to'y uchun olingan kredit, qarzga olingan pul, nasiyaga olingan sep-sarpo. Natijada dastlabki yillar quvonch o'rniga qarz to'lash tashvishi bilan o'tadi, bu esa ko'plab janjallarga sabab bo'ladi.

> Hasham to'y baxtli oila kafolati emas. Ixcham, qarzsiz to'y esa yosh oilaga mustahkam start beradi.

Payg'ambarimiz (s.a.v.) ham: **«Eng barakali nikoh — xarajati eng oz bo'lganidir»**, deganlar (Imom Ahmad rivoyati). Oila olimlarining kuzatuvlari ham shuni tasdiqlaydi: yosh oilalarni ko'pincha sevgining yo'qligi emas, **tashqi stress** — qarz va moliyaviy qiyinchilik buzadi.

### Davlat nima deydi?

2019-yil 14-sentabrda Oliy Majlis palatalari kengashlarining qo'shma qarori bilan **to'y va oilaviy tantanalarni o'tkazish tartibi** tasdiqlangan (2020-yil 1-yanvardan amalda):

- to'yga **200 kishigacha** (oshga 250 kishigacha) mehmon;
- tadbir **bir kunda, 06:00 dan 23:00 gacha**;
- to'y kortejida **3 tadan ortiq** avtomobil emas, **2 ta xonanda** yoki bitta guruh;
- «kelin navkari», «sep yoydi», «pul sochish» kabi ortiqcha marosimlar, dabdaba va isrofgarchilik taqiqlangan.

2025-yilda bu sohani yanada tartibga solish va yoshlarda **tejamkorlik madaniyatini** shakllantirish bo'yicha yangi choralar belgilandi. Lekin hech qanday qaror sizning o'rningizga qaror qabul qilmaydi: ixcham to'y — bu avvalo **kuyov va kelinning, ularning ota-onalarining ongli tanlovi**.

### O'zingizga savol bering

- To'y uchun qarz olsak, uni necha oyda to'laymiz? Shu oylar oilamizga qanday ta'sir qiladi?
- Tejangan pul bilan nima qilish mumkin: uy-joy uchun boshlang'ich to'lov, kasb o'rganish, kichik biznes?
- To'y hajmi haqida ota-onalar bilan **to'ydan ancha oldin**, xotirjam gaplasha olamizmi?

## Oila byudjetini tuzish

Oila byudjeti — bu daromad va xarajatlarni oldindan rejalashtirish. Oddiy usullardan biri — **50/30/20 qoidasi**:

| Ulush | Yo'nalish | Misollar |
|---|---|---|
| 50% | Zarur xarajatlar | Oziq-ovqat, kommunal to'lovlar, ijara, yo'l kira |
| 30% | Istaklar | Kiyim, mehmondorchilik, dam olish |
| 20% | Jamg'arma va qarz to'lovi | Favqulodda holatlar uchun zaxira, kelajak rejalari |

Daromad kam bo'lsa, foizlar o'zgarishi mumkin, lekin **har oy ozgina bo'lsa ham jamg'arish** odatini shakllantirish muhim.

## Pul masalasida shaffoflik

- Er-xotin oilaning umumiy daromadi va xarajatlarini **birgalikda bilishi** kerak.
- Katta xaridlar (mashina, uy jihozlari) **maslahatlashib** qilinadi.
- Turmush o'rtog'idan yashirincha qarz olish yoki kredit rasmiylashtirish ishonchni buzadi.

## Qarz va kreditlar

Kredit olishdan oldin o'zingizga savol bering:
1. Bu xarid **haqiqatan zarurmi** yoki kutsa bo'ladimi?
2. Oylik to'lov daromadimizning **uchdan biridan** oshmaydimi?
3. Daromad to'xtab qolsa, to'lovni qanday davom ettiramiz?

Mikroqarzlar va onlayn kreditlarning foiz stavkalari juda yuqori bo'lishi mumkin — shartnomani diqqat bilan o'qing.

## Moliyaviy zaxira

Kutilmagan holatlar (kasallik, ishsizlik) uchun kamida **3 oylik xarajatga teng** zaxira yig'ishga harakat qiling. Bu oilani ko'plab stresslardan himoya qiladi.`,
          quiz: [
            {
              text: "50/30/20 qoidasiga ko'ra daromadning 20% qismi nimaga ajratiladi?",
              options: ["Dam olishga", "Jamg'arma va qarz to'loviga", "Kiyim-kechakka", "Mehmondorchilikka"],
              correct: 1,
            },
            {
              text: "Kredit olishda oylik to'lov odatda daromadning qancha qismidan oshmasligi tavsiya etiladi?",
              options: ["Uchdan biridan", "To'liq daromaddan", "Ikki baravaridan", "Cheklov yo'q"],
              correct: 0,
            },
            {
              text: "Favqulodda holatlar uchun moliyaviy zaxira kamida qancha bo'lishi tavsiya qilinadi?",
              options: ["1 kunlik xarajat", "1 haftalik xarajat", "3 oylik xarajat", "Zaxira kerak emas"],
              correct: 2,
            },
          ],
        },
        {
          title: "Qaynota-qaynona va qarindoshlar bilan munosabat",
          minutes: 12,
          content: `## Ikki oila — bitta yangi oila

Nikoh orqali siz nafaqat umr yo'ldosh, balki **yangi oila a'zolari** — qaynota, qaynona, qaynog'a va qaynsingillarga ham ega bo'lasiz. Bu munosabatlarning sifati oilaviy baxtga katta ta'sir ko'rsatadi.

## Kuyovning o'rni

O'zbek oilalarida ko'pincha kelin kuyovning ota-onasi bilan birga yashaydi. Bunday holatda kuyov — **ikki tomon o'rtasidagi ko'prik**. Uning vazifasi:
- ota-onasiga hurmatni saqlagan holda, **xotinining huquq va qadr-qimmatini himoya qilish**;
- kelinni oilaga moslashishida qo'llab-quvvatlash — u yangi muhitga tushib qolgan;
- kelishmovchiliklarni tomonlarning birini ayblamasdan, **xotirjam hal qilish**.

> Ota-onaga hurmat va xotinga g'amxo'rlik bir-biriga zid emas. Yetuk erkak ikkalasini ham uddalaydi.

## Chegaralar

Ota-onalar tajribasi va maslahati qimmatli. Ammo **oilaning ichki qarorlari** — farzand tarbiyasi, byudjet, shaxsiy masalalar — avvalo er va xotin o'rtasida hal qilinishi kerak. Er-xotin o'rtasidagi har bir kichik kelishmovchilikni qarindoshlarga yetkazish ziddiyatni chuqurlashtiradi.

### Amaliy maslahatlar
1. Turmush o'rtog'ingiz haqida ota-onangizga **shikoyat qilmang** — siz yarashib ketasiz, ular esa xafagarchilikni uzoq eslab qolishi mumkin.
2. Xotiningizning ota-onasini ham **o'z ota-onangizdek hurmat qiling**: bayramlarda tabriklang, holidan xabar oling.
3. Ikkala oilaga ham **teng e'tibor** bering.
4. Imkon qadar, ayniqsa birinchi yillarda, er-xotinga **alohida xona va shaxsiy vaqt** bo'lishiga harakat qiling.

## Kelinga munosabat

Kelin — xizmatkor emas, **oilaning teng huquqli a'zosi**. Uy ishlarida unga yordam berish, uning charchoq va his-tuyg'ulariga e'tibor qaratish — kuyovning burchi. Kelinning o'qishi, ishlashi va ota-onasini ko'rishga borishi kabi masalalar uning o'zi bilan maslahatlashib hal qilinadi.`,
          quiz: [
            {
              text: "Kelin kuyovning ota-onasi bilan yashaganda kuyovning asosiy roli qanday?",
              options: [
                "Har doim faqat ota-onasi tomonini olish",
                "Aralashmaslik",
                "Ikki tomon o'rtasida ko'prik bo'lish va xotinining qadr-qimmatini himoya qilish",
                "Faqat xotinining tomonini olish",
              ],
              correct: 2,
            },
            {
              text: "Er-xotin o'rtasidagi kichik kelishmovchiliklarni ota-onaga aytib shikoyat qilish nimaga olib keladi?",
              options: ["Muammoni darhol hal qiladi", "Ziddiyatni chuqurlashtirishi mumkin", "Hech narsaga ta'sir qilmaydi", "Oilani mustahkamlaydi"],
              correct: 1,
            },
            {
              text: "Kelinning oiladagi maqomi qanday bo'lishi kerak?",
              options: ["Xizmatkor", "Mehmon", "Oilaning teng huquqli a'zosi", "Vaqtinchalik a'zo"],
              correct: 2,
            },
          ],
        },
        {
          title: "Ota bo'lishga tayyorlik",
          minutes: 13,
          content: `## Otalik — homiladorlikdan boshlanadi

Ko'pchilik otalik farzand tug'ilgandan keyin boshlanadi deb o'ylaydi. Aslida u **homiladorlik davridan** boshlanadi. Bu davrda bo'lajak ota:
- turmush o'rtog'ini shifokor ko'riklariga **kuzatib boradi**;
- uning ovqatlanishi va dam olishiga g'amxo'rlik qiladi;
- uyda **xotirjam, stresssiz muhit** yaratadi — onaning ruhiy holati homilaga ta'sir qiladi;
- og'ir uy ishlarini o'z zimmasiga oladi.

## Tug'ruqdan keyingi davr

Tug'ruqdan keyingi birinchi oylar yosh ona uchun jismonan va ruhan juda og'ir. Ba'zi ayollarda **tug'ruqdan keyingi depressiya** kuzatiladi: doimiy yig'loqilik, qayg'u, bolaga befarqlik, uyqusizlik. Bu «injiqlik» emas — bu tibbiy holat. Bunday belgilar sezilsa, xotiningizni qo'llab-quvvatlang va **shifokorga murojaat qiling**.

## Faol ota bo'ling

Tadqiqotlar shuni ko'rsatadiki, otasi tarbiyada faol qatnashgan bolalar:
- o'ziga ko'proq ishonadi;
- o'qishda yaxshiroq natija ko'rsatadi;
- xulq-atvor muammolariga kamroq duch keladi.

Faol ota bo'lish uchun katta vaqt shart emas:
- har kuni bola bilan **o'ynash, kitob o'qib berish**;
- uni cho'miltirish, yotqizish kabi oddiy ishlarda qatnashish;
- bolaning gaplarini diqqat bilan tinglash.

## Tarbiya — o'rnak orqali

Bolalar aytgan gapimizni emas, **qilgan ishimizni** takrorlaydi. Agar ota onasini hurmat qilsa, bola ham ayollarni hurmat qilishni o'rganadi. Agar ota jahlini boshqara olsa, bola ham shuni o'rganadi.

> Farzandga beriladigan eng yaxshi tarbiya — uning ota-onasi o'rtasidagi mehr va hurmatni ko'rib o'sishi.

## Jismoniy jazo — yo'q

Bolani urish, qo'rqitish yoki kamsitish uning ruhiyatiga uzoq muddatli zarar yetkazadi. Intizomni **tushuntirish, aniq qoidalar va shaxsiy o'rnak** orqali shakllantiring.

## Kursni yakunlash

Tabriklaymiz! Siz kursning barcha darslarini o'rgandingiz. Endi yakuniy imtihonni topshirib, bilimingizni tasdiqlang va sertifikat oling. Esda tuting: haqiqiy imtihon — bu sizning kelajakdagi oilaviy hayotingiz. Omad!`,
          quiz: [
            {
              text: "Otalik mas'uliyati qachondan boshlanadi?",
              options: ["Bola maktabga borganda", "Homiladorlik davridan", "Bola 18 yoshga to'lganda", "Bola gapira boshlaganda"],
              correct: 1,
            },
            {
              text: "Tug'ruqdan keyingi depressiya belgilari sezilsa nima qilish kerak?",
              options: ["E'tibor bermaslik", "Injiqlik deb hisoblab, tanbeh berish", "Qo'llab-quvvatlash va shifokorga murojaat qilish", "Qarindoshlarga shikoyat qilish"],
              correct: 2,
            },
            {
              text: "Bolalar tarbiyasi asosan nima orqali shakllanadi?",
              options: ["Jismoniy jazo orqali", "Ota-onaning shaxsiy o'rnagi orqali", "Faqat maktab orqali", "Telefon va televizor orqali"],
              correct: 1,
            },
          ],
        },
      ],
    },
  ],
  exam: [
    { text: "«Oila — kichik Vatan» iborasi nimani anglatadi?", options: ["Oila faqat uy-joy degani", "Inson shaxs va fuqaro sifatida avvalo oilada shakllanadi", "Oila davlatdan ustun", "Oila faqat iqtisodiy birlik"], correct: 1 },
    { text: "Yosh oilalardagi ajrimlarning asosiy sabablaridan biri qaysi?", options: ["Ko'p kitob o'qish", "Oilaviy hayotga tayyorgarlik va bilim yetishmasligi", "Sport bilan shug'ullanish", "Sayohat qilish"], correct: 1 },
    { text: "Quyidagilardan qaysi biri turmushga iqtisodiy tayyorlikni bildiradi?", options: ["Hashamatli to'y qilish", "Barqaror daromad manbai yoki aniq reja", "Qimmat telefon", "Ota-ona hisobidan yashash"], correct: 1 },
    { text: "Nikoh qarori qanday bo'lishi kerak?", options: ["Qo'ni-qo'shnilar bosimi bilan", "Ikki kishining ixtiyoriy va ongli qarori", "Faqat ota-onaning qarori", "Tengdoshlarga ergashib"], correct: 1 },
    { text: "To'ydan oldin muhokama qilish tavsiya etiladigan mavzu qaysi?", options: ["Faqat to'y menyusi", "Farzand tarbiyasi, yashash joyi, ayolning o'qishi va ishlashi", "Hech narsa muhokama qilinmaydi", "Faqat sep-sarpo"], correct: 1 },
    { text: "Yaqin qarindoshlar o'rtasidagi nikoh rejalashtirilsa, shifokorlar nimani tavsiya qiladi?", options: ["Hech narsa", "Tibbiy-genetik maslahat olishni", "Faqat diniy nikohni", "To'yni kattaroq qilishni"], correct: 1 },
    { text: "Muammo haqida gapirayotgan ayol ko'pincha avvalo nimani xohlaydi?", options: ["Darhol yechimni", "Eshitilish va tushunilishni", "Tanqidni", "Jim turishni"], correct: 1 },
    { text: "Quyidagilardan qaysi biri «Men» tilidagi gap?", options: ["Sen hech narsaga yaramaysan", "Men o'zimni e'tiborsiz qolgandek his qilyapman", "Hammasi sen tufayli", "Sen doim shunaqasan"], correct: 1 },
    { text: "Faol tinglashda nima qilinmaydi?", options: ["Ko'zga qarash", "Tushunganini qaytarish", "Suhbatdosh gapini bo'lish", "Hissiyotni tan olish"], correct: 2 },
    { text: "Jiddiy mavzuni muhokama qilishda qaysi qoida to'g'ri?", options: ["Eski xafagarchiliklarni ham qo'shish", "Bir vaqtda faqat bitta muammo haqida gapirish", "Qarindoshlar oldida gaplashish", "Charchagan paytni tanlash"], correct: 1 },
    { text: "Oilaviy munosabatlar tadqiqotlariga ko'ra ajrimning eng kuchli bashoratchisi bo'lgan xatti-harakat qaysi?", options: ["Minnatdorchilik", "Kamsitish va masxara qilish", "Tanaffus so'rash", "Kechirim so'rash"], correct: 1 },
    { text: "Shaxsni ayblash («Sen dangasasan») qaysi xavfli odatga kiradi?", options: ["Tanqid", "Minnatdorchilik", "Faol tinglash", "Kelishuv"], correct: 0 },
    { text: "Janjal qizib ketganda eng to'g'ri harakat qaysi?", options: ["Baqirish", "Uydan butunlay ketib qolish", "Tanaffus so'rab, tinchlangach suhbatga qaytish", "Narsalarni sindirish"], correct: 2 },
    { text: "Quyidagilardan qaysi biri iqtisodiy zo'ravonlik hisoblanadi?", options: ["Birgalikda byudjet tuzish", "Turmush o'rtog'ini ataylab pulsiz qoldirish", "Jamg'arma qilish", "Maslahatlashib xarid qilish"], correct: 1 },
    { text: "Nikoh huquqiy kuchga ega bo'lishi uchun qayerda ro'yxatdan o'tkazilishi kerak?", options: ["Masjidda", "To'yxonada", "FHDYo organlarida", "Mahalla guzarida"], correct: 2 },
    { text: "Faqat diniy nikoh bilan yashash qanday xavf tug'diradi?", options: ["Hech qanday xavf yo'q", "Ayol va bolalarning mulkiy va boshqa huquqlari himoyasiz qolishi mumkin", "Soliq ko'payadi", "Pasport bekor bo'ladi"], correct: 1 },
    { text: "Quyidagi qaysi holatda nikoh tuzilishiga yo'l qo'yilmaydi?", options: ["Tomonlar turli viloyatdan bo'lsa", "Shaxslardan biri boshqa ro'yxatdan o'tgan nikohda bo'lsa", "Kuyov talaba bo'lsa", "Kelin ishlasa"], correct: 1 },
    { text: "Nikoh shartnomasi nimani tartibga soladi?", options: ["To'y marosimini", "Er-xotinning mulkiy huquq va majburiyatlarini", "Farzandlar ismini", "Mehmonlar ro'yxatini"], correct: 1 },
    { text: "Qonunga ko'ra, oilada er va xotin qanday huquqlarga ega?", options: ["Er ko'proq huquqqa ega", "Xotin ko'proq huquqqa ega", "Teng huquqlarga ega", "Huquqlarni qaynota belgilaydi"], correct: 2 },
    { text: "Nikoh davrida ish haqi hisobiga sotib olingan uy odatda kimning mulki hisoblanadi?", options: ["Faqat nomiga yozilgan shaxsning", "Er-xotinning umumiy birgalikdagi mulki", "Ota-onaning", "Davlatning"], correct: 1 },
    { text: "Ikki nafar voyaga yetmagan farzand uchun aliment odatda daromadning qancha qismini tashkil etadi?", options: ["1/4", "1/3", "1/2", "1/10"], correct: 1 },
    { text: "Nikohdan oldingi tibbiy ko'rik natijalari qanday hisoblanadi?", options: ["Hammaga e'lon qilinadi", "Tibbiy sir bo'lib, bo'lajak er-xotinga ma'lum qilinadi", "Mahallaga yuboriladi", "Ish joyiga yuboriladi"], correct: 1 },
    { text: "Chekish va alkogol bo'lajak otaning qaysi salomatligiga jiddiy zarar yetkazadi?", options: ["Reproduktiv salomatligiga", "Faqat tishlariga", "Faqat sochlariga", "Hech qanday zarari yo'q"], correct: 0 },
    { text: "Intim hayot haqida bilimni qayerdan olish to'g'ri?", options: ["Tasodifiy internet videolaridan", "Shifokor va ishonchli adabiyotlardan", "Tengdoshlarning gaplaridan", "Hech qayerdan"], correct: 1 },
    { text: "Ixcham, qarzsiz to'yning yosh oila uchun asosiy foydasi nima?", options: ["Mehmonlar kam xafa bo'ladi", "Oila hayotini qarz tashvishisiz boshlash imkoni", "Hech qanday foydasi yo'q", "Ko'proq sovg'a olinadi"], correct: 1 },
    { text: "50/30/20 qoidasida daromadning 50% qismi nimaga sarflanadi?", options: ["Zarur xarajatlarga", "Dam olishga", "Jamg'armaga", "Sovg'alarga"], correct: 0 },
    { text: "Turmush o'rtog'idan yashirincha kredit olish nimaga olib keladi?", options: ["Oilani mustahkamlaydi", "Ishonchni buzadi", "Byudjetni yaxshilaydi", "Hech narsaga"], correct: 1 },
    { text: "Er-xotin o'rtasidagi kichik kelishmovchiliklar haqida ota-onaga shikoyat qilish haqida qaysi fikr to'g'ri?", options: ["Har doim shikoyat qilish kerak", "Shikoyat qilmaslik kerak — er-xotin yarashadi, ota-ona esa xafagarchilikni uzoq eslashi mumkin", "Faqat qaynonaga aytish kerak", "Ijtimoiy tarmoqda yozish kerak"], correct: 1 },
    { text: "Tug'ruqdan keyingi depressiya qanday holat?", options: ["Injiqlik", "Davolash va qo'llab-quvvatlash talab qiladigan tibbiy holat", "Odatiy charchoq, e'tibor shart emas", "Faqat erkaklarda bo'ladi"], correct: 1 },
    { text: "Bola intizomini shakllantirishning to'g'ri usuli qaysi?", options: ["Urish va qo'rqitish", "Tushuntirish, aniq qoidalar va shaxsiy o'rnak", "Kamsitish", "E'tiborsiz qoldirish"], correct: 1 },
  ],
};

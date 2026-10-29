// «Oila nega muhim» bo'limi uchun statistika.
// Har bir raqam manbasi bilan. Yangi rasmiy ma'lumot chiqsa, shu yerda yangilang.

export const SOURCES = {
  stat2022: { label: "Statistika agentligi, 2022-yil (dastlabki ma'lumot)", url: "https://stat.uz/uz/matbuot-markazi/qo-mita-yangiliklar/33756-o-zbekistonda-2022-yil-davomida-qancha-nikohdan-ajralish-holatlari-qayd-etildi" },
  stat2023: { label: "Statistika agentligi, demografiya press-relizi (2024-yil yanvar)", url: "https://www.stat.uz/img/demografiya-press-reliz-26_01_2024-uzb.pdf" },
  daryo2024: { label: "Daryo.uz, Statistika agentligi ma'lumotlari asosida (2024-yil)", url: "https://daryo.uz/ndCAqDpt" },
  ombudsman: { label: "Bolalar ombudsmani, Kun.uz (2024-yil oktabr)", url: "https://kun.uz/en/news/2024/10/01/over-2000-parents-in-uzbekistan-lost-parental-rights-in-three-years" },
  harper: { label: "Harper & McLanahan, «Father Absence and Youth Incarceration» (AQSh, NLSY)", url: "https://ojp.gov/ncjrs/virtual-library/abstracts/father-absence-and-youth-incarceration" },
  cobbClark: { label: "Cobb-Clark & Tekin, otalar va o'smirlar xulqi tadqiqoti", url: "https://freakonomics.com/2011/10/fathers-and-delinquency-in-the-american-family/" },
} as const;

// Yillik ajrimlar soni (O'zbekiston)
export const DIVORCES = [
  { year: 2020, value: 28_233, source: "Statistika agentligi (stat.uz)" },
  { year: 2021, value: 39_349, source: "Statistika agentligi (stat.uz)" },
  { year: 2022, value: 48_734, source: "Statistika agentligi, dastlabki" },
  { year: 2023, value: 49_198, source: "Statistika agentligi" },
  { year: 2024, value: 45_100, source: "Statistika agentligi (Daryo.uz orqali)" },
];

export const MARRIAGES_2024 = 271_800;
export const DIVORCES_2024 = 45_100;
export const DIVORCES_PER_DAY = Math.round(DIVORCES_2024 / 366); // 2024 — kabisa yili
export const DIVORCE_RATIO = Math.round(MARRIAGES_2024 / DIVORCES_2024); // har N nikohga 1 ajrim
export const GROWTH_2020_2023 = Math.round((49_198 / 28_233 - 1) * 100);

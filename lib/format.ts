export function formatSum(amount: number) {
  return amount.toLocaleString("ru-RU").replace(/,/g, " ") + " so'm";
}

export function priceLabel(amount: number) {
  return amount === 0 ? "Bepul" : formatSum(amount);
}

export function formatDate(d: Date) {
  const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  return `${d.getDate()}-${months[d.getMonth()]}, ${d.getFullYear()}-yil`;
}

export const REGIONS = [
  "Andijon viloyati", "Buxoro viloyati", "Farg'ona viloyati", "Jizzax viloyati",
  "Xorazm viloyati", "Namangan viloyati", "Navoiy viloyati", "Qashqadaryo viloyati",
  "Qoraqalpog'iston Respublikasi", "Samarqand viloyati", "Sirdaryo viloyati",
  "Surxondaryo viloyati", "Toshkent viloyati", "Toshkent shahri",
];

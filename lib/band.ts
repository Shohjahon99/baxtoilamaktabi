// IELTS uslubidagi ballik tizim: foiz -> 0–9 band (0.5 qadam bilan)
export function percentToBand(percent: number) {
  const band = Math.round((percent / 100) * 9 * 2) / 2;
  return Math.max(0, Math.min(9, band));
}

export function bandLevel(band: number) {
  if (band >= 8.5) return "A'lo daraja";
  if (band >= 7) return "Yuqori daraja";
  if (band >= 5.5) return "O'rta daraja";
  if (band >= 5) return "Boshlang'ich daraja";
  return "Yetarli emas";
}

export const formatBand = (band: number) => band.toFixed(1);

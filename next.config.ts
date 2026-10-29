import type { NextConfig } from "next";

// cacheComponents o'chirilgan: platforma deyarli to'liq foydalanuvchiga bog'liq
// (sessiya, progress), shuning uchun odatiy dinamik render modeli ishlatiladi.
const nextConfig: NextConfig = {
  // APP_URL berilmasa Vercel'ning asosiy domeni olinadi (Telegram, Click va sertifikat havolalari uchun)
  env: {
    APP_URL:
      process.env.APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // Rasmlar Unsplash CDN'dan o'lcham/format parametrlari bilan keladi (w=, auto=format),
    // serverda qayta optimizatsiya qilish shart emas va sekinlashtiradi.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

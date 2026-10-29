import type { NextConfig } from "next";

// cacheComponents o'chirilgan: platforma deyarli to'liq foydalanuvchiga bog'liq
// (sessiya, progress), shuning uchun odatiy dinamik render modeli ishlatiladi.
const nextConfig: NextConfig = {
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

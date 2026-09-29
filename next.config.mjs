/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    // ✅ تحسين الصور تلقائيًا (WebP/AVIF)
    formats: ["image/avif", "image/webp"],
    // ✅ Cache الصور لمدة 30 يوم
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // ✅ أحجام محسّنة للأجهزة المختلفة
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // ✅ ضغط الـ build
  compress: true,
  // ✅ شيل header "X-Powered-By"
  poweredByHeader: false,
  // ✅ React strict mode (يكشف المشاكل في dev)
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // استبعد المكتبات اللي whatsapp-web.js بيستوردها بس مش مستخدمة
      config.externals = config.externals || [];
      config.externals.push(
        "@aws-sdk/client-s3",
        "sharp",
        "canvas",
        "bufferutil",
        "utf-8-validate"
      );
    }
    return config;
  },
};

export default nextConfig;
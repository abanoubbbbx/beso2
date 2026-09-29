/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    unoptimized: true,
  },
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
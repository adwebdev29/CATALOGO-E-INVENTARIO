/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rurbeszsrsahjotyjojn.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co", // 🟢 Agregamos este
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Opcional: A veces los SVGs externos necesitan esta regla para funcionar en Next Image
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;

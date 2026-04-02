/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rurbeszsrsahjotyjojn.supabase.co", // 🟢 Tu dominio de Supabase
        port: "",
        pathname: "/storage/v1/object/public/**", // Permitir todo lo que esté en tu storage público
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // 🟢 Por si aún tienes los de prueba que inyectamos con SQL
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // 🟢 El que marcaba error en tu consola hace rato
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
// Nota: Si tu archivo es .js y no .mjs, usa "module.exports = nextConfig;" en lugar de "export default nextConfig;"

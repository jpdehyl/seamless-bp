/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: false,
  images: {
    domains: ['lh3.googleusercontent.com'],
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com", protocol: "https" },
    ],
  },
};

module.exports = nextConfig; 
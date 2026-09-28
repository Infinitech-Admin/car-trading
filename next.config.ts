import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

// Backend na nagse-serve ng /storage images (Laravel). Kung naka-set ang
// NEXT_PUBLIC_API_URL (hal. https://api.yoursite.com), otomatikong papayagan
// din ang host na iyon — para hindi na kailangang baguhin ito sa production.
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiPattern = (() => {
  if (!apiUrl) return null;
  try {
    const u = new URL(apiUrl);
    return {
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      port: u.port,
      pathname: "/storage/**",
    };
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Local dev backend
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      // Production backend (galing sa NEXT_PUBLIC_API_URL, kung meron)
      ...(apiPattern ? [apiPattern] : []),
    ],
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWAConfig(nextConfig);

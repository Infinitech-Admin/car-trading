import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import FloatingSocial from "@/components/floating-social";
import ChatWidget from "@/components/chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AutoTrade | Premium Cars for Sale",
    template: "%s | AutoTrade",
  },
  description:
    "Discover quality vehicles for sale. Browse premium cars, explore detailed specifications, view photos and videos, and inquire about your next vehicle.",
  keywords: [
    "cars for sale",
    "used cars",
    "pre-owned cars",
    "car dealership",
    "car trading",
    "vehicles for sale",
    "automotive",
    "premium cars",
  ],
  authors: [{ name: "AutoTrade" }],
  creator: "AutoTrade",
  publisher: "AutoTrade",

  robots: {
    index: true,
    follow: true,
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AutoTrade",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "AutoTrade | Premium Cars for Sale",
    description:
      "Explore quality vehicles with detailed specifications, photos, videos, and easy inquiry options.",
    siteName: "AutoTrade",
  },

  twitter: {
    card: "summary_large_image",
    title: "AutoTrade | Premium Cars for Sale",
    description:
      "Find your next vehicle. Browse our latest inventory and explore every car in detail.",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#BF980D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <CartProvider>
          {children}
          <FloatingSocial
            facebookHref="https://facebook.com/autotrade"
            chatHref="#"
            telegramHref="https://t.me/autotrade"
            email="info@autotrade.com"
            phone="+10000000000"
          />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}

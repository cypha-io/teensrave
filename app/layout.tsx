import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
});

export const metadata: Metadata = {
  metadataBase: new URL('https://teensrave.com'),
  title: {
    template: '%s | Teensrave Festival',
    default: 'Teensrave Festival - Experience the Ultimate 3D Immersive Festival',
  },
  description:
    "Experience the ultimate Teensrave Festival with mind-blowing 3D visuals and immersive experiences in Accra, Ghana",
  keywords: ["festival", "music", "teens", "rave", "afrofuturism", "ghana", "Accra", "3D visuals"],
  authors: [{ name: "TeensRave Team" }],
  creator: "TeensRave Team",
  publisher: "TeensRave Festival",
  icons: {
    icon: [
      {
        url: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Teensrave Festival 2025",
    description: "Experience the ultimate Teensrave Festival with mind-blowing 3D visuals and immersive experiences",
    type: "website",
    url: "https://teensrave.com",
    siteName: "Teensrave Festival",
    locale: "en_US",
    images: [
      {
        url: "https://teensrave.com/logo.png",
        width: 512,
        height: 512,
        alt: "TeensRave Festival Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@teensrave",
    creator: "@teensrave",
    title: "Teensrave Festival 2025",
    description: "Experience the ultimate Teensrave Festival with mind-blowing 3D visuals and immersive experiences",
    images: {
      url: "https://teensrave.com/logo.png",
      alt: "TeensRave Festival Logo",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://fonts.cdnfonts.com/css/dream" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link rel="dns-prefetch" href="https://fonts.cdnfonts.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

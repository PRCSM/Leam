import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@/styles/site.css";
import "@/styles/home.css";
import "@/styles/phones.css";
import "@/styles/pages.css";
import "@/styles/room.css";
import "@/styles/dashboard.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { MotionDirector } from "@/components/motion/MotionDirector";
import { SITE_URL } from "@/lib/utils";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Leam — Create your Universe", template: "%s · Leam" },
  description:
    "Live rooms and a community chat, safeguarded with anything you like: tickets, subscriptions, collectibles, merch. Leam is where creators turn followers into a community.",
  openGraph: {
    type: "website",
    siteName: "Leam",
    title: "Leam — Create your Universe",
    description: "Live rooms and community chat for creators and their top 1% fans.",
  },
  twitter: { card: "summary_large_image", title: "Leam — Create your Universe" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Hides scroll-reveal elements before first paint only when JS + motion are on,
// so content is never invisible for no-JS or reduced-motion visitors.
const motionBoot = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ready')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <SmoothScroll />
        <Cursor />
        <MotionDirector />
      </body>
    </html>
  );
}

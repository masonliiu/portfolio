import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

import RouteHeader from "@/components/portfolio/RouteHeader";
import ImmersiveSnapshotOverlay from "@/components/immersive/ImmersiveSnapshotOverlay";
import MotionOrchestrator from "@/components/portfolio/MotionOrchestrator";
import { ViewTransitions } from "next-view-transitions";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mason Liu | Portfolio",
  description: "Cinematic full-stack portfolio with an immersive 3D room.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="root-theme" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <MotionOrchestrator />
        <ImmersiveSnapshotOverlay />
        <ViewTransitions>
          <RouteHeader />
          {children}
        </ViewTransitions>
      </body>
    </html>
  );
}

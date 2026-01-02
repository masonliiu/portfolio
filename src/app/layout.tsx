import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import TerminalHeader from "@/components/portfolio/TerminalHeader";
import ThemeInitializer from "@/components/portfolio/ThemeInitializer";
import { ViewTransitions } from "next-view-transitions";

const jetBrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/JetBrainsMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono-Medium.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mason Liu | Portfolio",
  description: "Portfolio and immersive 3D room experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.variable} antialiased`}>
        <ThemeInitializer />
        <TerminalHeader />
        <ViewTransitions>{children}</ViewTransitions>
      </body>
    </html>
  );
}

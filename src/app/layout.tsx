import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import TerminalHeader from "@/components/portfolio/TerminalHeader";

const nunitoSans = localFont({
  src: [
    {
      path: "../../public/fonts/NunitoSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/NunitoSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-nunito-sans",
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
      <body className={`${nunitoSans.variable} antialiased`}>
        <TerminalHeader />
        {children}
      </body>
    </html>
  );
}

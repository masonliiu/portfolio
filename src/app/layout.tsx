import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const root = document.documentElement;
    const palettes = ["latte", "frappe", "macchiato", "mocha"];
    const accents = ["rosewater", "flamingo", "pink", "mauve", "red", "maroon", "peach", "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender"];
    const storedPalette = localStorage.getItem("palette");
    const palette = storedPalette && palettes.includes(storedPalette)
      ? storedPalette
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "mocha"
        : "latte";
    root.classList.remove(...palettes);
    root.classList.add(palette);
    const storedAccent = localStorage.getItem("accent");
    const accent = storedAccent && accents.includes(storedAccent)
      ? storedAccent
      : "peach";
    root.style.setProperty("--current-accent-color", \`var(--color-\${accent})\`);
    const bgEffect = localStorage.getItem("bgEffect");
    if (bgEffect === "false") {
      root.classList.remove("bg-effect");
    } else {
      root.classList.add("bg-effect");
    }
  } catch (err) {}
  try {
    const saved = sessionStorage.getItem("scrollY");
    if (saved) {
      history.scrollRestoration = "manual";
      window.scrollTo(0, Number(saved) || 0);
    }
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("scrollY", String(window.scrollY || 0));
    });
  } catch (err) {}
})();`,
          }}
        />
      </head>
      <body className={`${jetBrainsMono.variable} antialiased`}>
        <ThemeInitializer />
        <ViewTransitions>
          <TerminalHeader />
          {children}
        </ViewTransitions>
      </body>
    </html>
  );
}

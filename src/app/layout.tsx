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
    <html lang="en" className="mocha" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    root.style.overflowY = "hidden";
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
    root.classList.remove("ready");
  } catch (err) {}
  try {
    const root = document.documentElement;
    let readySet = false;
    const restoreScroll = () => {
      const saved = sessionStorage.getItem("scrollY");
      if (saved) {
        history.scrollRestoration = "manual";
        const target = Number(saved) || 0;
        window.scrollTo(0, target);
        return target;
      }
      return null;
    };
    const markReady = (targetScroll) => {
      if (readySet) return;
      readySet = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (typeof targetScroll === "number" && window.scrollY !== targetScroll) {
            window.scrollTo(0, targetScroll);
          }
          setTimeout(() => {
            root.style.overflowY = "";
            root.classList.add("ready");
            root.style.scrollBehavior = "";
          }, 0);
        });
      });
    };
    let ticking = false;
    const storeScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sessionStorage.setItem("scrollY", String(window.scrollY || 0));
        ticking = false;
      });
    };
    window.addEventListener("scroll", storeScroll, { passive: true });
    window.addEventListener("pagehide", storeScroll);
    window.addEventListener("DOMContentLoaded", () => {
      restoreScroll();
    });
    window.addEventListener("load", () => {
      const target = restoreScroll();
      markReady(target ?? undefined);
    });
    window.addEventListener("pageshow", () => {
      const target = restoreScroll();
      markReady(target ?? undefined);
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

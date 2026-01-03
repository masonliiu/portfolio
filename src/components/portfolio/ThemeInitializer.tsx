"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { accentOptions, paletteClasses } from "./theme";

export default function ThemeInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    const storedPalette = localStorage.getItem("palette");
    const palette =
      storedPalette
        ? storedPalette
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "mocha"
          : "latte";

    html.classList.remove(...paletteClasses);
    html.classList.add(palette);

    const storedAccent = localStorage.getItem("accent");
    const accent = accentOptions.some((option) => option.id === storedAccent)
      ? storedAccent
      : "peach";
    html.style.setProperty("--current-accent-color", `var(--color-${accent})`);

    const bgEffect = localStorage.getItem("bgEffect");
    if (bgEffect === "false") {
      html.classList.remove("bg-effect");
    } else {
      html.classList.add("bg-effect");
    }
  }, [pathname]);

  return null;
}

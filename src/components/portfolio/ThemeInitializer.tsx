"use client";

import { useEffect } from "react";
import { accentOptions, paletteClasses } from "./theme";

export default function ThemeInitializer() {
  useEffect(() => {
    const html = document.documentElement;
    const storedPalette = localStorage.getItem("palette");
    const palette =
      storedPalette && paletteClasses.includes(storedPalette)
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
  }, []);

  return null;
}

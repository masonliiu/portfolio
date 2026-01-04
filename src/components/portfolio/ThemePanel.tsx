"use client";

import { useEffect, useState } from "react";
import { accentOptions, paletteClasses, paletteOptions } from "./theme";

export default function ThemePanel() {
  const [palette, setPalette] = useState("mocha");
  const [accent, setAccent] = useState("peach");
  const [backgroundEffect, setBackgroundEffect] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const storedPalette = localStorage.getItem("palette");
    const resolvedPalette =
      storedPalette
        ? storedPalette
        : paletteClasses.find((name) => html.classList.contains(name)) ??
          (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "mocha"
            : "latte");
    const storedAccent = localStorage.getItem("accent");
    const resolvedAccent =
      storedAccent && accentOptions.some((option) => option.id === storedAccent)
        ? storedAccent
        : "peach";
    const storedBg = localStorage.getItem("bgEffect");
    const resolvedBg = storedBg ? storedBg === "true" : true;

    setPalette(resolvedPalette);
    setAccent(resolvedAccent);
    setBackgroundEffect(resolvedBg);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const html = document.documentElement;
    html.classList.remove(...paletteClasses);
    html.classList.add(palette);
    localStorage.setItem("palette", palette);
  }, [palette, isReady]);

  useEffect(() => {
    if (!isReady) return;
    document.documentElement.style.setProperty(
      "--current-accent-color",
      `var(--color-${accent})`
    );
    localStorage.setItem("accent", accent);
  }, [accent, isReady]);

  useEffect(() => {
    if (!isReady) return;
    const html = document.documentElement;
    if (backgroundEffect) {
      html.classList.add("bg-effect");
    } else {
      html.classList.remove("bg-effect");
    }
    localStorage.setItem("bgEffect", String(backgroundEffect));
  }, [backgroundEffect, isReady]);

  const activeIndex = accentOptions.findIndex((option) => option.id === accent);
  const columns = 7;
  const activeRow = Math.floor(activeIndex / columns);
  const activeCol = activeIndex % columns;

  return (
    <section className="terminal-card theme-panel p-4">
      <div className="flex items-center gap-2 text-base font-semibold">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 text-[var(--color-accent)]"
          fill="currentColor"
        >
          <path d="M12 3a9 9 0 0 0-9 9c0 4.42 3.58 8 8 8h1v-3h-1a5 5 0 0 1 0-10h1V3h-1zm5.76 4.18a1 1 0 0 0-1.4.12l-5.38 6.52-2.34-2.34a1 1 0 1 0-1.42 1.42l3.12 3.12a1 1 0 0 0 1.5-.1l6.1-7.4a1 1 0 0 0-.18-1.34z" />
        </svg>
        Theme
      </div>
      <div className="theme-panel__body mt-3 flex flex-col items-center gap-3 text-center">
        <div className="theme-panel__palettes">
          <div className="theme-panel__palette-grid">
          {paletteOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setPalette(option.id)}
              className={`rounded-[6px] border px-3 py-1 text-[13px] font-semibold lowercase tracking-[0.3em] transition hover:text-[var(--color-accent)] hover:border-[color-mix(in srgb,var(--color-accent) 70%,transparent)] ${
                palette === option.id
                  ? "border-[color-mix(in srgb,var(--color-accent) 70%,transparent)] text-[var(--color-text)] shadow-sm"
                  : "border-transparent text-[var(--color-subtext1)]"
              }`}
            >
              {option.label}
            </button>
          ))}
          </div>
        </div>
        <div
          className="swatch-grid"
          style={
            {
              "--swatch-size": "1.5rem",
              "--swatch-gap": "0.45rem",
              "--swatch-offset": "-3px",
              "--swatch-col": String(activeCol),
              "--swatch-row": String(activeRow),
            } as React.CSSProperties
          }
        >
          <span className="swatch-indicator" aria-hidden="true" />
          {accentOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setAccent(option.id)}
              className={`swatch-button aspect-square w-full rounded-[7px] shadow-sm ${
                accent === option.id ? "opacity-100" : "opacity-90"
              }`}
              style={{ backgroundColor: `var(--color-${option.id})` }}
              aria-label={`Select ${option.label} accent color`}
            >
              <span className="sr-only">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

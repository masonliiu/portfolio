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
      storedPalette && paletteClasses.includes(storedPalette)
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
    <section className="terminal-card p-4">
      <div className="terminal-title">Theme</div>
      <div className="mt-1 flex flex-wrap gap-2">
        {paletteOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setPalette(option.id)}
            className={`rounded-[6px] border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] transition hover:border-[color-mix(in srgb,var(--color-accent) 70%,transparent)] hover:text-[var(--color-accent)] hover:shadow-[0_0_10px_rgba(255,255,255,0.12)] ${
              palette === option.id
                ? "border-[color-mix(in srgb,var(--color-accent) 70%,transparent)] text-[var(--color-text)] shadow-sm"
                : "border-transparent text-[var(--color-subtext1)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div
        className="swatch-grid mt-2"
        style={
          {
            "--swatch-size": "1.2rem",
            "--swatch-gap": "0.7rem",
            "--swatch-offset": "-5px",
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
            className={`swatch-button aspect-square w-full rounded-[6px] shadow-sm ${
              accent === option.id ? "opacity-100" : "opacity-90"
            }`}
            style={{ backgroundColor: `var(--color-${option.id})` }}
            aria-label={`Select ${option.label} accent color`}
          >
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-1 flex items-center text-[10px] text-[var(--color-subtext1)]">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={backgroundEffect}
            onChange={() => setBackgroundEffect((value) => !value)}
            className="h-4 w-4 rounded border border-[var(--color-surface1)] text-[var(--color-accent)]"
            aria-label="Toggle background effect"
          />
          <span className="font-semibold uppercase tracking-[0.3em]">
            Background effect{" "}
            <span className="text-[var(--color-accent)]">
              {backgroundEffect ? "on" : "off"}
            </span>
          </span>
        </label>
      </div>
    </section>
  );
}

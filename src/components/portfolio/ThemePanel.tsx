"use client";

import { useEffect, useState } from "react";
import { accentOptions, paletteClasses, paletteOptions } from "./theme";

export default function ThemePanel() {
  const [palette, setPalette] = useState(() => {
    if (typeof window === "undefined") return "mocha";
    const stored = localStorage.getItem("palette");
    if (stored && paletteClasses.includes(stored)) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "mocha"
      : "latte";
  });
  const [accent, setAccent] = useState(() => {
    if (typeof window === "undefined") return "peach";
    const stored = localStorage.getItem("accent");
    return stored && accentOptions.some((option) => option.id === stored)
      ? stored
      : "peach";
  });
  const [backgroundEffect, setBackgroundEffect] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("bgEffect");
    return stored ? stored === "true" : true;
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(...paletteClasses);
    html.classList.add(palette);
    localStorage.setItem("palette", palette);
  }, [palette]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--current-accent-color",
      `var(--color-${accent})`
    );
    localStorage.setItem("accent", accent);
  }, [accent]);

  useEffect(() => {
    const html = document.documentElement;
    if (backgroundEffect) {
      html.classList.add("bg-effect");
    } else {
      html.classList.remove("bg-effect");
    }
    localStorage.setItem("bgEffect", String(backgroundEffect));
  }, [backgroundEffect]);

  return (
    <section className="terminal-card p-3">
      <div className="terminal-title">Theme</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {paletteOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setPalette(option.id)}
            className={`rounded-[6px] border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] transition ${
              palette === option.id
                ? "border-[color-mix(in srgb,var(--color-accent) 70%,transparent)] text-[var(--color-text)] shadow-sm"
                : "border-transparent text-[var(--color-subtext1)] hover:text-[var(--color-text)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="relative mt-2 grid grid-cols-7 gap-2.5">
        {accentOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setAccent(option.id)}
            className={`aspect-square min-h-6 w-full min-w-6 rounded-md shadow-sm transition ${
              accent === option.id
                ? "scale-105 outline outline-4 outline-[var(--color-accent)] outline-offset-2"
                : "opacity-80 hover:scale-110 hover:opacity-100"
            }`}
            style={{ backgroundColor: `var(--color-${option.id})` }}
            aria-label={`Select ${option.label} accent color`}
          >
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center text-xs text-[var(--color-subtext1)]">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={backgroundEffect}
            onChange={() => setBackgroundEffect((value) => !value)}
            className="h-4 w-4 rounded border border-[var(--color-surface1)] text-[var(--color-accent)]"
            aria-label="Toggle background effect"
          />
          <span>
            Background effect:{" "}
            <span className="text-[var(--color-accent)]">
              {backgroundEffect ? "on" : "off"}
            </span>
          </span>
        </label>
      </div>
    </section>
  );
}

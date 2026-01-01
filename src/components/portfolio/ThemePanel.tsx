"use client";

import { useEffect, useMemo, useState } from "react";
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

  const activeIndex = useMemo(
    () => accentOptions.findIndex((option) => option.id === accent),
    [accent]
  );
  const ringRow = Math.floor(activeIndex / 7);
  const ringColumn = activeIndex % 7;

  return (
    <section className="terminal-card hover-panel p-6">
      <div className="terminal-title">Theme</div>
      <div className="mt-4 flex flex-wrap gap-2">
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
      <div className="relative mt-4 grid grid-cols-7 gap-2.5">
        {accentOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setAccent(option.id)}
            className={`aspect-square min-h-6 w-full min-w-6 rounded-md shadow-sm transition ${
              accent === option.id
                ? "scale-105"
                : "opacity-80 hover:scale-110 hover:opacity-100"
            }`}
            style={{ backgroundColor: `var(--color-${option.id})` }}
            aria-label={`Select ${option.label} accent color`}
          >
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
        {activeIndex >= 0 ? (
          <div
            className="pointer-events-none absolute aspect-square min-h-6 min-w-6 rounded-md ring-2 ring-offset-2 ring-offset-[var(--color-base)] transition-all duration-300 ease-out"
            style={{
              transform: `translate(calc(${ringColumn} * (100% + 0.625rem)), calc(${ringRow} * (100% + 0.625rem)))`,
              width: "calc((100% - 6 * 0.625rem) / 7)",
              color: `var(--color-${accent})`,
              boxShadow: "0 0 0 1px currentColor",
            }}
          />
        ) : null}
      </div>
      <div className="mt-4 flex items-center text-xs text-[var(--color-subtext1)]">
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

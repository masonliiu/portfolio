"use client";

import { useEffect, useState } from "react";

const paletteOptions = [
  { id: "latte", label: "Latte" },
  { id: "frappe", label: "Frappe" },
  { id: "macchiato", label: "Macchiato" },
  { id: "mocha", label: "Mocha" },
];

const accentOptions = [
  { id: "peach", label: "Peach", color: "#f97316" },
  { id: "sky", label: "Sky", color: "#38bdf8" },
  { id: "mint", label: "Mint", color: "#34d399" },
  { id: "rose", label: "Rose", color: "#fb7185" },
  { id: "violet", label: "Violet", color: "#a78bfa" },
  { id: "gold", label: "Gold", color: "#f59e0b" },
  { id: "lime", label: "Lime", color: "#a3e635" },
];

const paletteClasses = paletteOptions.map((option) => option.id);

export default function ThemePanel() {
  const [palette, setPalette] = useState(() => {
    if (typeof window === "undefined") return "latte";
    const stored = localStorage.getItem("palette");
    return stored && paletteClasses.includes(stored) ? stored : "latte";
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
    const selected = accentOptions.find((option) => option.id === accent);
    if (selected) {
      document.documentElement.style.setProperty("--accent", selected.color);
      document.documentElement.style.setProperty(
        "--accent-soft",
        `${selected.color}33`
      );
      localStorage.setItem("accent", accent);
    }
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
    <section className="terminal-card p-6">
      <div className="terminal-title">Theme</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {paletteOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setPalette(option.id)}
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] transition ${
              palette === option.id
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {accentOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setAccent(option.id)}
            className={`h-7 w-7 rounded-md border transition ${
              accent === option.id
                ? "border-[var(--accent)]"
                : "border-transparent"
            }`}
            style={{ backgroundColor: option.color }}
            aria-label={`Set accent to ${option.label}`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
        <span className="uppercase tracking-[0.3em]">Background effect</span>
        <button
          type="button"
          onClick={() => setBackgroundEffect((value) => !value)}
          className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text)]"
        >
          {backgroundEffect ? "On" : "Off"}
        </button>
      </div>
    </section>
  );
}

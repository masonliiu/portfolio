"use client";

import { useEffect, useState } from "react";

export default function ClickCounter() {
  const [count, setCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem("click-count");
    const parsed = stored ? Number(stored) : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  });
  const [showIncrement, setShowIncrement] = useState(false);

  const handleClick = () => {
    setCount((value) => {
      const next = value + 1;
      localStorage.setItem("click-count", String(next));
      return next;
    });
    setShowIncrement(true);
  };

  useEffect(() => {
    if (!showIncrement) return;
    const timeout = setTimeout(() => setShowIncrement(false), 500);
    return () => clearTimeout(timeout);
  }, [showIncrement]);

  return (
    <section className="terminal-card flex items-center justify-between gap-3 p-3">
      <div>
        <div className="text-2xl font-semibold text-[var(--color-accent)]">
          {count.toLocaleString()}
        </div>
        <p className="text-xs text-[var(--color-subtext1)]">
          You&apos;ve clicked {count} times{" "}
          {showIncrement ? (
            <span className="text-[var(--color-accent)]">+1</span>
          ) : null}
        </p>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-crust)] transition hover:scale-105 hover:brightness-110"
      >
        Click me
      </button>
    </section>
  );
}

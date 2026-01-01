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
    <section className="terminal-card hover-panel flex flex-col items-center justify-center gap-2 p-4 text-center">
      <div className="text-3xl font-semibold text-[var(--color-accent)]">
        {count.toLocaleString()}
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-crust)] transition hover:brightness-110"
      >
        Click me
      </button>
      <p className="text-xs text-[var(--color-subtext1)]">
        You&apos;ve clicked {count} times{" "}
        {showIncrement ? (
          <span className="text-[var(--color-accent)]">+1</span>
        ) : null}
      </p>
    </section>
  );
}

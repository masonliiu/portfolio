"use client";

import { useEffect, useState } from "react";

export default function ClickCounter() {
  const [count, setCount] = useState(0);
  const [showIncrement, setShowIncrement] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("click-count");
    const parsed = stored ? Number(stored) : 0;
    setCount(Number.isNaN(parsed) ? 0 : parsed);
  }, []);

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
    <section className="terminal-card flex items-center justify-between gap-4 p-4">
      <div>
        <div className="text-3xl font-semibold text-[var(--color-accent)]">
          {count.toLocaleString()}
        </div>
        <p className="text-sm text-[var(--color-subtext1)]">
          You&apos;ve clicked {count} times{" "}
          {showIncrement ? (
            <span className="text-[var(--color-accent)]">+1</span>
          ) : null}
        </p>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-md bg-[var(--color-accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-crust)] transition hover:scale-110 hover:brightness-125 hover:shadow-[0_0_18px_rgba(255,255,255,0.15)]"
      >
        Click me
      </button>
    </section>
  );
}

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
    <section className="terminal-card click-card flex flex-col justify-between p-4">
      <div className="text-center">
        <div className="text-4xl font-bold text-[var(--color-accent)] py-5 tracking-[3px]">
          {count.toLocaleString()}
        </div>
        <div className="flex justify-center">
        <button
          type="button"
          onClick={handleClick}
          className="rounded-xl bg-[var(--color-accent)] px-3 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-crust)] transition hover:scale-102 hover:brightness-125 hover:shadow-[0_0_18px_rgba(255,255,255,0.15)]"
        >
          Click me
        </button>
      </div>
      </div>
      <p className="text-sm text-[var(--color-subtext1)] text-center py-5">
          You&apos;ve clicked {count} times{" "}
          {showIncrement ? (
            <span className="text-[var(--color-accent)]">+1</span>
          ) : null}
      </p>
    </section>
  );
}

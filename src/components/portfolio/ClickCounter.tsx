"use client";

import { useEffect, useState } from "react";

export default function ClickCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("click-count");
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) {
        setCount(parsed);
      }
    }
  }, []);

  const handleClick = () => {
    setCount((value) => {
      const next = value + 1;
      localStorage.setItem("click-count", String(next));
      return next;
    });
  };

  return (
    <section className="terminal-card flex flex-col items-center justify-center gap-3 p-4 text-center">
      <div className="text-3xl font-semibold text-[var(--color-accent)]">
        {count.toLocaleString()}
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-md bg-[color-mix(in srgb,var(--color-accent) 80%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-crust)] transition hover:bg-[var(--color-accent)]"
      >
        Click me
      </button>
      <p className="text-xs text-[var(--color-subtext1)]">
        You&apos;ve clicked {count} times
      </p>
    </section>
  );
}

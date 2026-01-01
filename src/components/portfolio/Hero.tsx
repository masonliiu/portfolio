export default function Hero() {
  return (
    <section
      id="hero"
      className="terminal-card relative z-10 flex flex-col gap-6 p-8"
    >
      <div className="terminal-title">Identity</div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Mason Liu
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Mason Liu is a CS student at UTD focused on full-stack development and
          game development.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="badge">Full-stack development</span>
        <span className="badge">Game development</span>
        <span className="badge">UTD CS</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <a
          className="rounded-full border border-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
          href="mailto:liumasn@gmail.com"
        >
          Email
        </a>
        <a
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)] hover:text-[var(--text)]"
          href="https://github.com/masonliiu"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)] hover:text-[var(--text)]"
          href="https://www.linkedin.com/in/masonliiu/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}

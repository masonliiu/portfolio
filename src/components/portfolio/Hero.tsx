export default function Hero() {
  return (
    <section
      id="hero"
      className="terminal-card relative z-10 flex flex-col gap-6 p-8"
    >
      <div className="terminal-title">Identity</div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Hey! I&apos;m{" "}
          <span className="text-[var(--color-accent)] underline decoration-dashed decoration-[color-mix(in srgb,var(--color-accent) 40%,transparent)] underline-offset-4">
            Mason Liu
          </span>
        </h1>
        <p className="mt-3 text-sm text-[var(--color-subtext0)]">
          Mason Liu is a CS student at UTD focused on full-stack development and
          game development.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--color-subtext1)]">
        <a
          className="hover:text-[var(--color-accent)]"
          href="https://github.com/masonliiu"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span className="text-[var(--color-surface1)]">|</span>
        <a
          className="hover:text-[var(--color-accent)]"
          href="https://www.linkedin.com/in/masonliiu/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <span className="text-[var(--color-surface1)]">|</span>
        <a
          className="hover:text-[var(--color-accent)]"
          href="mailto:liumasn@gmail.com"
        >
          Email
        </a>
      </div>
    </section>
  );
}

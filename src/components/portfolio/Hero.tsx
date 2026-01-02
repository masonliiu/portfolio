export default function Hero() {
  return (
    <section id="hero" className="relative z-10 flex flex-col gap-6 py-6">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
          Hey! I&apos;m{" "}
          <span className="text-[var(--color-accent)] underline decoration-dashed decoration-[color-mix(in srgb,var(--color-accent) 40%,transparent)] underline-offset-4">
            Mason Liu
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-subtext0)]">
          Mason Liu is a CS student at UTD focused on full-stack development and
          game development.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--color-subtext1)]">
        <a
          href="https://github.com/masonliiu"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span className="text-[var(--color-surface1)]">|</span>
        <a
          href="https://www.linkedin.com/in/masonliiu/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <span className="text-[var(--color-surface1)]">|</span>
        <a
          href="mailto:liumasn@gmail.com"
        >
          Email
        </a>
      </div>
    </section>
  );
}

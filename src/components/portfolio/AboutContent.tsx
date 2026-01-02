export default function AboutContent() {
  return (
    <>
      <div className="terminal-title">About</div>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">About Me</h1>

      <section className="mt-6 space-y-4 text-base text-[var(--color-subtext0)]">
        <p>
          Hey! I&apos;m Mason Liu — a CS student at UTD focused on full-stack
          development and game development. I like building systems that feel
          clean, fast, and thoughtful to use.
        </p>
        <p>
          My recent work includes Mase Labs Collective, Soundborn, a JVM memory
          arena experiment, and utility tools like a bionic reading extension.
          I&apos;m especially interested in product polish, interactive tooling,
          and platform-style projects.
        </p>
        <p>
          Outside of software, I spend time exploring photography, game design,
          and new creative workflows. If you want to collaborate or chat, feel
          free to reach out.
        </p>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]">
        <a href="mailto:liumasn@gmail.com">Email</a>
        <span className="text-[var(--color-surface1)]">|</span>
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
      </div>
    </>
  );
}

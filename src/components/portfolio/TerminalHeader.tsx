import Link from "next/link";

export default function TerminalHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color-mix(in srgb,var(--color-surface0) 60%,transparent)] bg-[var(--color-base)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-sm">
          <a className="wiggle text-[var(--color-accent)]" href="/">
            ~
          </a>
          <span className="text-[var(--color-overlay1)]">/</span>
          <span className="cursor-blink" aria-hidden="true" />
        </nav>
        <div className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] md:flex">
          <a className="hover:text-[var(--text)]" href="#projects">
            Projects
          </a>
          <a
            className="hover:text-[var(--text)]"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
          <a className="hover:text-[var(--text)]" href="#contact">
            Contact
          </a>
        </div>
        <Link
          className="rounded-full border border-[color-mix(in srgb,var(--color-surface0) 60%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          href="/immersive"
        >
          Immersive
        </Link>
      </div>
    </header>
  );
}

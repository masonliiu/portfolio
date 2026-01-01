import Link from "next/link";

export default function TerminalHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <span className="text-accent">~</span>
          <span className="text-[var(--muted)]">/</span>
          <span className="cursor-blink" aria-hidden="true" />
        </nav>
        <div className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)] md:flex">
          <a className="hover:text-[var(--text)]" href="#projects">
            Projects
          </a>
          <a className="hover:text-[var(--text)]" href="#contact">
            Contact
          </a>
        </div>
        <Link
          className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/immersive"
        >
          Immersive
        </Link>
      </div>
    </header>
  );
}

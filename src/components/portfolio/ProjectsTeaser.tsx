import Link from "next/link";

export default function ProjectsTeaser() {
  return (
    <section className="terminal-card hover-panel p-6">
      <div className="terminal-title">Projects</div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        Project catalog
      </h2>
      <p className="mt-3 text-sm text-[var(--color-subtext0)]">
        Browse the full project list with detailed previews, highlights, and
        links.
      </p>
      <Link
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-[var(--color-surface1)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]"
        href="/projects"
      >
        View projects
      </Link>
    </section>
  );
}

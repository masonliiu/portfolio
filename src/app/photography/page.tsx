import Link from "next/link";

export default function PhotographyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="terminal-title">Photography</div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Photography</h1>
      <p className="mt-4 text-sm text-[var(--color-subtext0)]">
        This gallery is in progress. I&apos;m curating a set of photos to share
        here soon.
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-surface1)] bg-[var(--color-mantle)]/40 p-6 text-sm text-[var(--color-subtext1)]">
        Placeholder grid for upcoming work.
      </div>

      <Link
        className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] hover:text-[var(--color-accent)]"
        href="/"
      >
        Back home
      </Link>
    </div>
  );
}

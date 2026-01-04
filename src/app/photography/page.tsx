import { Link } from "next-view-transitions";

export default function PhotographyPage() {
  return (
    <div className="page-shell">
      <div className="scroll-blur" />
      <div className="terminal-title">
        <span className="mt-3 text-3xl font-extrabold tracking-tight">photography</span>
      </div>
      <p className="mt-4 text-base text-[var(--color-subtext0)]">
        This gallery is in progress. I&apos;m curating a set of photos to share
        here soon.
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-surface1)] bg-[var(--color-mantle)]/40 p-6 text-sm text-[var(--color-subtext1)]">
        Placeholder grid for upcoming work.
      </div>

      <Link
        className="mt-10 inline-flex items-center gap-2 text-xs font-semibold lowercase tracking-[0.3em] text-[var(--color-subtext1)]"
        href="/"
      >
        Back home
      </Link>
    </div>
  );
}

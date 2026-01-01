export default function LocationCard() {
  return (
    <section className="terminal-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Currently Based In</h3>
        <span className="text-xs text-[var(--color-accent)]">●</span>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-[var(--color-surface1)] bg-[var(--color-mantle)]">
        <div className="relative h-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-surface2),transparent_60%)] opacity-60" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-[var(--color-base)]/90 px-3 py-1 text-xs text-[var(--color-text)] shadow-sm">
            Dallas, TX
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-[var(--color-subtext1)]">Dallas, TX</div>
    </section>
  );
}

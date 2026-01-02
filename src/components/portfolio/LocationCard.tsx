export default function LocationCard() {
  return (
    <section className="terminal-card flex items-center justify-between gap-3 p-3">
      <div>
        <h3 className="text-sm font-semibold">Currently Based In</h3>
        <p className="text-xs text-[var(--color-subtext1)]">Dallas, TX</p>
      </div>
      <div className="rounded-full border border-[var(--color-surface1)] bg-[var(--color-mantle)] px-3 py-1 text-xs text-[var(--color-text)]">
        Dallas, TX
      </div>
    </section>
  );
}

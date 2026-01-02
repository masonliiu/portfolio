export default function ConnectForm() {
  return (
    <section className="terminal-card flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between text-base">
        <h3 className="font-semibold">Focus Snapshot</h3>
        <span className="text-xs text-[var(--color-subtext1)]">UTD</span>
      </div>
      <p className="text-sm text-[var(--color-subtext1)]">
        CS student at UTD focused on full-stack development and game development.
      </p>
      <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]">
        <span className="badge">Full-stack</span>
        <span className="badge">Game Dev</span>
        <span className="badge">UTD CS</span>
      </div>
    </section>
  );
}

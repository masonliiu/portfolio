export default function LocationCard() {
  return (
    <section className="terminal-card location-card flex flex-col gap-3 p-4">
      <div className="text-base font-semibold">Currently Based In</div>
      <div className="flex flex-1 flex-col justify-center gap-3 text-center">
        <p className="text-sm text-[var(--color-subtext1)]">Dallas, TX</p>
        <div className="mx-auto w-fit rounded-full border border-[var(--color-surface1)] bg-[var(--color-mantle)] px-4 py-2 text-xs text-[var(--color-text)]">
          Dallas, TX
        </div>
      </div>
    </section>
  );
}

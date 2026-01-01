export default function FocusWidget() {
  return (
    <section className="terminal-card hover-panel p-4">
      <h3 className="text-sm font-semibold">Focus Snapshot</h3>
      <p className="mt-2 text-sm text-[var(--color-subtext0)]">
        Systems, product polish, and interactive tooling are my current
        priorities.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="tag-pill" style={{ ["--tag-color" as string]: "var(--color-sky)" }}>
          Systems
        </span>
        <span className="tag-pill" style={{ ["--tag-color" as string]: "var(--color-mauve)" }}>
          Product
        </span>
        <span className="tag-pill" style={{ ["--tag-color" as string]: "var(--color-green)" }}>
          Game Dev
        </span>
      </div>
    </section>
  );
}

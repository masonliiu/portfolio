export default function QuickLinks() {
  return (
    <section className="terminal-card p-4">
      <h3 className="text-sm font-semibold">Quick Links</h3>
      <div className="mt-3 space-y-2 text-xs text-[var(--color-subtext1)]">
        <a
          className="flex items-center justify-between rounded-md border border-[var(--color-surface1)] px-3 py-2 text-[var(--color-text)]"
          href="mailto:liumasn@gmail.com"
        >
          <span>Email</span>
          <span className="text-[var(--color-subtext1)]">liumasn@gmail.com</span>
        </a>
        <a
          className="flex items-center justify-between rounded-md border border-[var(--color-surface1)] px-3 py-2 text-[var(--color-text)]"
          href="https://github.com/masonliiu"
          target="_blank"
          rel="noreferrer"
        >
          <span>GitHub</span>
          <span className="text-[var(--color-subtext1)]">@masonliiu</span>
        </a>
        <a
          className="flex items-center justify-between rounded-md border border-[var(--color-surface1)] px-3 py-2 text-[var(--color-text)]"
          href="https://www.linkedin.com/in/masonliiu/"
          target="_blank"
          rel="noreferrer"
        >
          <span>LinkedIn</span>
          <span className="text-[var(--color-subtext1)]">/masonliiu</span>
        </a>
      </div>
    </section>
  );
}

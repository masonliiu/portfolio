import TerminalHeader from "@/components/portfolio/TerminalHeader";
import Hero from "@/components/portfolio/Hero";
import Projects from "@/components/portfolio/Projects";
import Contact from "@/components/portfolio/Contact";
import ThemePanel from "@/components/portfolio/ThemePanel";
import SessionStats from "@/components/portfolio/SessionStats";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <TerminalHeader />
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Hero />
          <div className="flex flex-col gap-6">
            <ThemePanel />
            <SessionStats />
            <div className="terminal-card p-6 text-xs text-[var(--muted)]">
              <div className="terminal-title">Quick Links</div>
              <div className="mt-4 space-y-3 text-[11px] uppercase tracking-[0.3em]">
                <a
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-[var(--text)] transition hover:border-[var(--accent)]"
                  href="mailto:liumasn@gmail.com"
                >
                  <span>Email</span>
                  <span className="text-[var(--muted)]">liumasn@gmail.com</span>
                </a>
                <a
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-[var(--text)] transition hover:border-[var(--accent)]"
                  href="https://github.com/masonliiu"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>GitHub</span>
                  <span className="text-[var(--muted)]">@masonliiu</span>
                </a>
                <a
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-[var(--text)] transition hover:border-[var(--accent)]"
                  href="https://www.linkedin.com/in/masonliiu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>LinkedIn</span>
                  <span className="text-[var(--muted)]">/masonliiu</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <Projects />
        <Contact />
      </main>
      <footer className="border-t border-[var(--border)] px-6 py-6 text-xs text-[var(--muted)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Mason Liu</span>
          <a className="hover:text-[var(--accent)]" href="#hero">
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}

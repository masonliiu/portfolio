"use client";

import { Link as TransitionLink } from "next-view-transitions";
import ImmersiveLaunchButton from "./ImmersiveLaunchButton";

export default function TerminalHeader() {
  const navItems = [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Photography", href: "/photography" },
    { label: "Resume", href: "/resume.pdf", external: true },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--soft-line)] bg-[rgba(244,240,232,0.92)] backdrop-blur">
      <div className="page-shell flex items-center justify-between py-4">
        <TransitionLink
          className="text-xs uppercase tracking-[0.4em] text-[var(--muted-2)]"
          href="/"
        >
          Mason Liu
        </TransitionLink>
        <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.3em] text-[var(--muted-2)]">
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[var(--accent)]"
                >
                  {item.label}
                </a>
              ) : (
                <TransitionLink
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-[var(--accent)]"
                >
                  {item.label}
                </TransitionLink>
              )
            )}
          </div>
          <ImmersiveLaunchButton className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">
            Immersive
          </ImmersiveLaunchButton>
        </nav>
      </div>
    </header>
  );
}

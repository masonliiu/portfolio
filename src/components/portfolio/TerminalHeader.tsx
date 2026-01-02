"use client";

import { Link as TransitionLink } from "next-view-transitions";
import { usePathname } from "next/navigation";

function buildSegments(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment,
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));
}

export default function TerminalHeader() {
  const pathname = usePathname();
  const segments = buildSegments(pathname);

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-base)]/85 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center px-8 py-4">
        <nav
          aria-label="Breadcrumbs"
          className="absolute left-0 flex items-center gap-1 text-sm"
        >
          <TransitionLink className="wiggle text-[var(--color-accent)]" href="/">
            ~
          </TransitionLink>
          <span className="text-[var(--color-overlay1)]">/</span>
          {segments.map((segment, index) => (
            <span key={segment.href} className="flex items-center gap-1">
              {index === segments.length - 1 ? (
                <span className="text-[var(--color-text)]">{segment.label}</span>
              ) : (
                <TransitionLink className="header-link" href={segment.href}>
                  {segment.label}
                </TransitionLink>
              )}
              {index < segments.length - 1 ? (
                <span className="text-[var(--color-overlay1)]">/</span>
              ) : null}
            </span>
          ))}
          <span className="cursor-blink" aria-hidden="true" />
        </nav>
        <div className="ml-auto hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] md:flex">
          <TransitionLink className="header-link nav-link" href="/about">
            About
          </TransitionLink>
          <TransitionLink className="header-link nav-link" href="/projects">
            Projects
          </TransitionLink>
          <TransitionLink
            className="header-link nav-link"
            href="/photography"
          >
            Photography
          </TransitionLink>
          <a
            className="header-link nav-link"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
          <a className="header-link" href="#contact">
            Contact
          </a>
        </div>
        <TransitionLink
          className="header-link ml-6 rounded-full border border-[color-mix(in srgb,var(--color-surface0) 60%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text)] transition"
          href="/immersive"
        >
          Immersive
        </TransitionLink>
      </div>
    </header>
  );
}

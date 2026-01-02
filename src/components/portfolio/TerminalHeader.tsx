"use client";

import Link from "next/link";
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-4">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-sm">
          <Link className="wiggle text-[var(--color-accent)]" href="/">
            ~
          </Link>
          <span className="text-[var(--color-overlay1)]">/</span>
          {segments.map((segment, index) => (
            <span key={segment.href} className="flex items-center gap-2">
              {index > 0 ? (
                <span className="text-[var(--color-overlay1)]">/</span>
              ) : null}
              {index === segments.length - 1 ? (
                <span className="text-[var(--color-text)]">{segment.label}</span>
              ) : (
                <Link href={segment.href}>
                  {segment.label}
                </Link>
              )}
            </span>
          ))}
          <span className="text-[var(--color-overlay1)]">/</span>
          <span className="cursor-blink" aria-hidden="true" />
        </nav>
        <div className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] md:flex">
          <Link className="nav-link" href="/about">
            About
          </Link>
          <Link className="nav-link" href="/projects">
            Projects
          </Link>
          <Link className="nav-link" href="/photography">
            Photography
          </Link>
          <a
            className="nav-link"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
          <a href="#contact">
            Contact
          </a>
        </div>
        <Link
          className="rounded-full border border-[color-mix(in srgb,var(--color-surface0) 60%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text)] transition"
          href="/immersive"
        >
          Immersive
        </Link>
      </div>
    </header>
  );
}

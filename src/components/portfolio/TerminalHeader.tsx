"use client";

import { Link as TransitionLink } from "next-view-transitions";
import { usePathname } from "next/navigation";
import ImmersiveLaunchButton from "./ImmersiveLaunchButton";

export default function TerminalHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const navItems = isHome
    ? [
        { label: "Work", href: "/#work" },
        { label: "Photo", href: "/#photography" },
        { label: "Signal", href: "/#signal" },
        { label: "Contact", href: "/#contact" },
      ]
    : [
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Photography", href: "/photography" },
        { label: "Resume", href: "/resume.pdf", external: true },
        { label: "Contact", href: "/#contact" },
      ];

  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <TransitionLink
          className="text-xs uppercase tracking-[0.4em] text-[var(--muted-2)]"
          href="/"
          data-magnet
          data-cursor="Home"
        >
          Mason Liu
        </TransitionLink>
        <nav className="header-nav">
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[var(--accent)]"
                  data-magnet
                  data-cursor={item.label}
                >
                  {item.label}
                </a>
              ) : (
                <TransitionLink
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-[var(--accent)]"
                  data-magnet
                  data-cursor={item.label}
                >
                  {item.label}
                </TransitionLink>
              )
            )}
          </div>
          <ImmersiveLaunchButton
            className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]"
            data-magnet
            data-cursor="Enter"
          >
            Immersive
          </ImmersiveLaunchButton>
        </nav>
      </div>
    </header>
  );
}

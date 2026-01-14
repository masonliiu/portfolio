"use client";

import { Link as TransitionLink } from "next-view-transitions";
import { usePathname } from "next/navigation";
import ImmersiveLaunchButton from "./ImmersiveLaunchButton";

const homeItems = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Signal", href: "/#signal" },
  { label: "Contact", href: "/#contact" },
];

const innerItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Photography", href: "/photography" },
  { label: "Resume", href: "/resume.pdf", external: true },
];

export default function TerminalHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navItems = isHome ? homeItems : innerItems;

  return (
    <header className="site-header">
      <div className="header-inner">
        <TransitionLink
          className="brand-mark"
          href="/"
          data-magnet
          data-cursor="Home"
          aria-label="Home"
        >
          ML
        </TransitionLink>
        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="nav-link"
                data-magnet
                data-cursor={item.label}
              >
                {item.label}
              </a>
            ) : (
              <TransitionLink
                key={item.label}
                href={item.href}
                className="nav-link"
                data-magnet
                data-cursor={item.label}
              >
                {item.label}
              </TransitionLink>
            )
          )}
          <ImmersiveLaunchButton
            className="nav-link nav-link--accent"
            data-magnet
            data-cursor="Enter"
            aria-label="Immersive"
          >
            Immersive
          </ImmersiveLaunchButton>
        </nav>
      </div>
    </header>
  );
}

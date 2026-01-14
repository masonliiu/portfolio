"use client";

import { Link as TransitionLink } from "next-view-transitions";
import { usePathname } from "next/navigation";
import ImmersiveLaunchButton from "./ImmersiveLaunchButton";

const homeItems = [
  { label: "About", href: "/#about", symbol: "A" },
  { label: "Work", href: "/#work", symbol: "W" },
  { label: "Photo", href: "/#photography", symbol: "P" },
  { label: "Signal", href: "/#signal", symbol: "S" },
  { label: "Contact", href: "/#contact", symbol: "C" },
];

const innerItems = [
  { label: "Home", href: "/", symbol: "H" },
  { label: "Projects", href: "/projects", symbol: "W" },
  { label: "Photography", href: "/photography", symbol: "P" },
  { label: "Resume", href: "/resume.pdf", symbol: "CV", external: true },
];

export default function TerminalHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navItems = isHome ? homeItems : innerItems;

  return (
    <header className="site-header">
      <div className="header-inner">
        <TransitionLink
          className="symbol-link brand-mark"
          href="/"
          data-label="Home"
          data-magnet
          data-cursor="Home"
          aria-label="Home"
        >
          ML
        </TransitionLink>
        <nav className="symbol-nav" aria-label="Primary">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="symbol-link"
                data-label={item.label}
                data-magnet
                data-cursor={item.label}
                aria-label={item.label}
              >
                {item.symbol}
              </a>
            ) : (
              <TransitionLink
                key={item.label}
                href={item.href}
                className="symbol-link"
                data-label={item.label}
                data-magnet
                data-cursor={item.label}
                aria-label={item.label}
              >
                {item.symbol}
              </TransitionLink>
            )
          )}
          <ImmersiveLaunchButton
            className="symbol-link symbol-link--accent"
            data-label="Immersive"
            data-magnet
            data-cursor="Enter"
            aria-label="Immersive"
          >
            IM
          </ImmersiveLaunchButton>
        </nav>
      </div>
    </header>
  );
}

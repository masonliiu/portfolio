"use client";

import { usePathname } from "next/navigation";
import ImmersiveLaunchButton from "@/components/portfolio/ImmersiveLaunchButton";

const quickLinks = [
  { label: "Resume", href: "/resume.pdf" },
  { label: "GitHub", href: "https://github.com/masonliiu" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/masonliiu/" },
  { label: "Email", href: "mailto:liumasn@gmail.com" },
];

export default function QuickLinksRail() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <aside className="quick-links-rail" aria-label="Quick links">
      {quickLinks.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          className="quick-link"
          data-magnet
        >
          {item.label}
        </a>
      ))}
      <ImmersiveLaunchButton className="quick-link quick-link--accent" data-magnet>
        Immersive
      </ImmersiveLaunchButton>
    </aside>
  );
}

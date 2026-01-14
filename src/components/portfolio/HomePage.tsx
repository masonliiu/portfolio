"use client";

import { useEffect, useRef } from "react";
import ImmersiveLaunchButton from "@/components/portfolio/ImmersiveLaunchButton";
import GitHubActivity from "@/components/portfolio/GitHubActivity";
import ContributionGraph from "@/components/portfolio/ContributionGraph";
import WorkFocus from "@/components/portfolio/WorkFocus";

const heroLines = ["Full-stack", "systems", "3D", "interaction"];

const quickLinks = [
  { label: "Resume", href: "/resume.pdf" },
  { label: "GitHub", href: "https://github.com/masonliiu" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/masonliiu/" },
  { label: "Email", href: "mailto:liumasn@gmail.com" },
];

const aboutChips = ["Dallas, TX", "CS @ UTD", "Full-stack", "3D"];

const immersiveHotspots = [
  "Projects",
  "Skills",
  "Experience",
  "Resume",
  "Contact",
];

export default function HomePage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !finePointer) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-blob-target]")
    );

    const updateBlob = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      let size = 52;
      for (const target of targets) {
        const targetRect = target.getBoundingClientRect();
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        if (distance < 180) {
          size = 280;
          break;
        }
      }
      document.documentElement.style.setProperty("--blob-x", `${x}px`);
      document.documentElement.style.setProperty("--blob-y", `${y}px`);
      document.documentElement.style.setProperty("--blob-size", `${size}px`);
    };

    updateBlob(
      new PointerEvent("pointermove", {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      })
    );

    window.addEventListener("pointermove", updateBlob);

    return () => {
      window.removeEventListener("pointermove", updateBlob);
    };
  }, []);

  return (
    <main className="home-shell">
      <section className="hero-stage blob-stage" ref={stageRef} data-reveal>
        <p className="hero-kicker">Mason Liu</p>
        <div className="hero-stack">
          <div className="hero-text hero-text--front" data-hero>
            {heroLines.map((line) => (
              <span key={line} data-blob-target>
                {line}
              </span>
            ))}
          </div>
          <div className="hero-text hero-text--accent" aria-hidden="true">
            {heroLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div className="hero-blob" aria-hidden="true" />
        </div>
        <p className="hero-subline">CS @ UTD · Full-stack systems · Dallas, TX</p>
        <div className="quick-links">
          {quickLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="quick-link"
              data-magnet
              data-cursor={item.label}
            >
              {item.label}
            </a>
          ))}
          <ImmersiveLaunchButton
            className="quick-link quick-link--accent"
            data-magnet
            data-cursor="Enter"
          >
            Immersive
          </ImmersiveLaunchButton>
        </div>
      </section>

      <section className="section-block section-center" id="about" data-reveal>
        <p className="section-kicker">About</p>
        <h2 className="section-title outline-fill" data-fill data-blob-target>
          Full-stack engineer. Interaction focus.
        </h2>
        <p className="section-subtitle">Shipping products, systems, and 3D experiments.</p>
        <div className="chip-row">
          {aboutChips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </section>

      <section className="section-block section-center collage-section" data-reveal>
        <p className="section-kicker">Photography</p>
        <h2 className="section-title outline-fill" data-fill data-blob-target>
          Visual studies.
        </h2>
        <div className="image-collage" aria-hidden="true">
          <div className="image-card image-card--wide" />
          <div className="image-card image-card--portrait" />
          <div className="image-card image-card--small" />
        </div>
      </section>

      <WorkFocus id="work" className="section-block work-section" />

      <section className="section-block immersive-panel" id="immersive" data-reveal>
        <p className="section-kicker">Immersive room</p>
        <h2 className="section-title outline-fill" data-fill data-blob-target>
          Walk the studio.
        </h2>
        <p className="section-subtitle">
          Optional 3D room with hotspots for projects, skills, and experience.
        </p>
        <div className="immersive-hotspots">
          {immersiveHotspots.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <ImmersiveLaunchButton
          className="immersive-link"
          data-magnet
          data-cursor="Enter"
        >
          Enter immersive →
        </ImmersiveLaunchButton>
      </section>

      <section className="section-block" id="signal" data-reveal>
        <div className="space-y-6">
          <div className="section-center">
            <p className="section-kicker">Signal</p>
            <h2 className="section-title outline-fill" data-fill data-blob-target>
              Shipping.
            </h2>
            <p className="section-subtitle">
              Recent commits and a full year of contribution cadence.
            </p>
          </div>
          <div className="signal-grid">
            <GitHubActivity />
            <ContributionGraph />
          </div>
        </div>
      </section>

      <section className="section-block section-center" id="contact" data-reveal>
        <p className="section-kicker">Contact</p>
        <h2 className="section-title outline-fill" data-fill data-blob-target>
          Let&apos;s build.
        </h2>
        <p className="section-subtitle">
          Open to internships, full-time roles, and collaborations.
        </p>
        <div className="contact-actions">
          <a href="mailto:liumasn@gmail.com" data-magnet data-cursor="Email">
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/masonliiu/"
            target="_blank"
            rel="noreferrer"
            data-magnet
            data-cursor="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/masonliiu"
            target="_blank"
            rel="noreferrer"
            data-magnet
            data-cursor="GitHub"
          >
            GitHub
          </a>
        </div>
        <p className="footer-inline">© {new Date().getFullYear()} Mason Liu</p>
      </section>
    </main>
  );
}

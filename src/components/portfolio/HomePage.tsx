"use client";

import { useEffect, useRef } from "react";
import ImmersiveLaunchButton from "@/components/portfolio/ImmersiveLaunchButton";
import GitHubActivity from "@/components/portfolio/GitHubActivity";
import ContributionGraph from "@/components/portfolio/ContributionGraph";
import WorkFocus from "@/components/portfolio/WorkFocus";

const heroLines = ["Making", "playful", "systems", "feel", "alive"];

const quickSymbols = [
  { label: "Resume", href: "/resume.pdf", symbol: "CV" },
  { label: "GitHub", href: "https://github.com/masonliiu", symbol: "GH" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/masonliiu/",
    symbol: "IN",
  },
  { label: "Email", href: "mailto:liumasn@gmail.com", symbol: "@" },
];

const aboutChips = [
  "CS @ UTD",
  "Full-stack systems",
  "Interactive UI",
  "Dallas, TX",
];

const immersiveHotspots = [
  "Projects",
  "Skills",
  "Experience",
  "Resume",
  "Contact",
];

const photoPlaceholders = [
  "Midnight streetlight",
  "Motion blur study",
  "Studio portrait",
  "Neon reflections",
  "Golden hour frames",
];

export default function HomePage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !finePointer) return;

    const targets = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-blob-target]")
    );

    const updateBlob = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let size = 220;
      for (const target of targets) {
        const targetRect = target.getBoundingClientRect();
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        const distance = Math.hypot(
          event.clientX - centerX,
          event.clientY - centerY
        );
        if (distance < 160) {
          size = 360;
          break;
        }
      }
      stage.style.setProperty("--blob-x", `${x}px`);
      stage.style.setProperty("--blob-y", `${y}px`);
      stage.style.setProperty("--blob-size", `${size}px`);
    };

    const hideBlob = () => {
      stage.style.setProperty("--blob-size", "0px");
    };

    stage.addEventListener("pointermove", updateBlob);
    stage.addEventListener("pointerleave", hideBlob);

    return () => {
      stage.removeEventListener("pointermove", updateBlob);
      stage.removeEventListener("pointerleave", hideBlob);
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
        <p className="hero-subline">
          Full-stack builder focused on tactile UI, reliable systems, and
          cinematic interactions.
        </p>
        <div className="symbol-row">
          {quickSymbols.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="symbol-link"
              data-label={item.label}
              data-magnet
              data-cursor={item.label}
            >
              {item.symbol}
            </a>
          ))}
          <ImmersiveLaunchButton
            className="symbol-link symbol-link--accent"
            data-label="Immersive"
            data-magnet
            data-cursor="Enter"
          >
            IM
          </ImmersiveLaunchButton>
        </div>
      </section>

      <section className="section-block section-center" id="about" data-reveal>
        <p className="section-kicker">About</p>
        <h2 className="section-title">A builder with a design pulse.</h2>
        <p className="section-subtitle">
          I craft full-stack products with a bias for clarity, motion, and
          systems that stay fast under pressure.
        </p>
        <div className="chip-row">
          {aboutChips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </section>

      <WorkFocus id="work" className="section-block work-section" />

      <section className="section-block immersive-panel" id="immersive" data-reveal>
        <p className="section-kicker">Immersive room</p>
        <h2 className="section-title">Walk the studio.</h2>
        <p className="section-subtitle">
          A cinematic 3D room with hotspots for projects, skills, and experience.
          Optional, but unforgettable.
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

      <section
        className="section-block section-center"
        id="photography"
        data-reveal
      >
        <p className="section-kicker">Photography</p>
        <h2 className="section-title">Light, texture, rhythm.</h2>
        <p className="section-subtitle">
          A curated strip of visual studies. Replace these placeholders with
          published work.
        </p>
        <div className="photo-strip">
          {photoPlaceholders.map((label) => (
            <div
              key={label}
              className="photo-frame"
              data-magnet
              data-cursor="View"
            >
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block" id="signal" data-reveal>
        <div className="space-y-6">
          <div className="section-center">
            <p className="section-kicker">Signal</p>
            <h2 className="section-title">Shipping in public.</h2>
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
        <h2 className="section-title">Let&apos;s build something memorable.</h2>
        <p className="section-subtitle">
          Open to internships, full-time roles, and collaborations that value
          craft and clarity.
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

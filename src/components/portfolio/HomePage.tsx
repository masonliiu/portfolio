"use client";

import { useEffect } from "react";
import { Link } from "next-view-transitions";
import ImmersiveLaunchButton from "@/components/portfolio/ImmersiveLaunchButton";
import GitHubActivity from "@/components/portfolio/GitHubActivity";
import ContributionGraph from "@/components/portfolio/ContributionGraph";
import WorkFocus from "@/components/portfolio/WorkFocus";

const heroLinks = [
  { label: "GitHub", href: "https://github.com/masonliiu", cursor: "GitHub" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/masonliiu/",
    cursor: "LinkedIn",
  },
  { label: "Email", href: "mailto:liumasn@gmail.com", cursor: "Email" },
  { label: "Resume", href: "/resume.pdf", cursor: "Resume" },
];

const beats = [
  {
    title: "Signal",
    detail: "Short, high-impact summaries that show what the work actually does.",
  },
  {
    title: "System",
    detail: "Architecture decisions, performance trade-offs, and scaling notes.",
  },
  {
    title: "Surface",
    detail: "Motion, interaction, and deliberate visual rhythm that guides focus.",
  },
  {
    title: "Story",
    detail: "A narrative arc that takes recruiters from context to outcomes.",
  },
];

const photoPlaceholders = [
  "Midnight streetlight",
  "Motion blur study",
  "Studio portrait",
  "Neon reflections",
  "Golden hour frames",
];

const immersiveHotspots = [
  "Projects",
  "Skills",
  "Experience",
  "Resume",
  "Contact",
];

export default function HomePage() {
  useEffect(() => {
    document.body.classList.add("horizontal-scroll");
    return () => {
      document.body.classList.remove("horizontal-scroll");
    };
  }, []);

  return (
    <main className="horizontal-shell">
      <div className="horizontal-track">
        <section className="horizontal-section hero-panel" id="intro" data-reveal>
          <p className="section-kicker">Mason Liu · Portfolio</p>
          <h1 className="hero-title" data-hero>
            Building cinematic software with <span>signal</span> and precision.
          </h1>
          <p className="hero-lead">
            Computer Science @ UTD. Full-stack builder focused on tactile UI,
            resilient systems, and playful interaction design.
          </p>
          <div className="hero-cta">
            {heroLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                data-magnet
                data-cursor={link.cursor}
              >
                {link.label}
              </a>
            ))}
            <Link href="/about" data-magnet data-cursor="Story">
              Story
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <p className="work-meta">Focus</p>
              <p>Full-stack systems · Interactive UI · 3D rooms</p>
            </div>
            <div>
              <p className="work-meta">Based</p>
              <p>Dallas, TX · UTD</p>
            </div>
          </div>
          <div className="scroll-hint" aria-hidden="true">
            Scroll →
          </div>
        </section>

        {beats.map((beat, index) => (
          <section
            key={beat.title}
            className="horizontal-section beat-panel"
            data-reveal
          >
            <span className="work-meta">0{index + 1}</span>
            <h2 className="section-title">{beat.title}</h2>
            <p className="section-subtitle">{beat.detail}</p>
          </section>
        ))}

        <WorkFocus id="work" className="horizontal-section work-panel" />

        <section
          className="horizontal-section immersive-panel"
          id="immersive"
          data-reveal
        >
          <p className="section-kicker">Immersive room</p>
          <h2 className="section-title">A 3D studio you can walk through.</h2>
          <p className="section-subtitle">
            Optional, but unforgettable. Tap hotspots to open projects, skills,
            and experience inside a cinematic room.
          </p>
          <div className="immersive-hotspots">
            {immersiveHotspots.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <ImmersiveLaunchButton className="immersive-link" data-magnet data-cursor="Enter">
            Enter immersive →
          </ImmersiveLaunchButton>
        </section>

        <section
          className="horizontal-section photography-panel"
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
              <div key={label} className="photo-frame" data-magnet data-cursor="View">
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          className="horizontal-section activity-panel"
          id="signal"
          data-reveal
        >
          <div className="space-y-6">
            <div>
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

        <section
          className="horizontal-section contact-panel"
          id="contact"
          data-reveal
        >
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
      </div>
    </main>
  );
}

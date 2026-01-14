"use client";

import { Link } from "next-view-transitions";
import ImmersiveLaunchButton from "@/components/portfolio/ImmersiveLaunchButton";
import GitHubActivity from "@/components/portfolio/GitHubActivity";
import ContributionGraph from "@/components/portfolio/ContributionGraph";
import RevealBlob from "@/components/portfolio/RevealBlob";
import WorkFocus from "@/components/portfolio/WorkFocus";
import HorizontalRail from "@/components/portfolio/HorizontalRail";
import ScrollTotem from "@/components/portfolio/ScrollTotem";

const heroLinks = [
  { label: "GitHub", href: "https://github.com/masonliiu" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/masonliiu/" },
  { label: "Email", href: "mailto:liumasn@gmail.com" },
  { label: "Resume", href: "/resume.pdf" },
];

const capabilityLoop = [
  "Full-stack product engineering",
  "Cinematic interaction design",
  "Performance-first systems",
  "3D experiences + spatial UI",
  "Design systems with personality",
  "Rapid prototyping",
];

const photoPlaceholders = [
  "Midnight streetlight",
  "Motion blur study",
  "Studio portrait",
  "Neon reflections",
  "Golden hour frames",
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="section-block" data-reveal>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <p className="section-kicker">Mason Liu · Portfolio</p>
            <h1 className="hero-title" data-hero>
              Expressive software, built with{" "}
              <span>precision and intent.</span>
            </h1>
            <p className="hero-lead">
              Computer Science @ UTD. Full-stack builder with a taste for
              cinematic interfaces, interactive 3D, and systems that stay fast
              under pressure.
            </p>
            <div className="hero-cta">
              {heroLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/about">Story</Link>
            </div>
          </div>
          <div className="hero-rail space-y-6">
            <div>
              <p className="section-kicker">Now</p>
              <p>Designing immersive storytelling for recruiters and teams.</p>
            </div>
            <div>
              <p className="section-kicker">Focus</p>
              <p>Full-stack systems, 3D interaction, and tactile UI.</p>
            </div>
          </div>
        </div>
      </section>

      <RevealBlob />
      <WorkFocus />
      <HorizontalRail />
      <ScrollTotem />

      <section className="section-block immersive-strip" data-reveal>
        <div className="space-y-6">
          <p className="section-kicker">Immersive mode</p>
          <h2 className="section-title">Step into the room.</h2>
          <p className="section-subtitle">
            A cinematic 3D studio that unlocks projects, skills, and experience
            through interactive hotspots. It is optional, but it is where the
            personality shows up loudest.
          </p>
          <ImmersiveLaunchButton className="immersive-link">
            Enter immersive →
          </ImmersiveLaunchButton>
        </div>
      </section>

      <section className="section-block" data-reveal>
        <div className="space-y-6">
          <p className="section-kicker">Capabilities</p>
          <h2 className="section-title">Studio-grade execution.</h2>
          <p className="section-subtitle">
            End-to-end builds with intentional motion, reliable systems, and
            experiences that feel alive.
          </p>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {capabilityLoop.concat(capabilityLoop).map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" data-reveal>
        <div className="space-y-6">
          <p className="section-kicker">Photography</p>
          <h2 className="section-title">Light, texture, rhythm.</h2>
          <p className="section-subtitle">
            A curated selection of visual studies. Replace these placeholders
            with your photography series when you are ready to publish.
          </p>
          <div className="photo-strip">
            {photoPlaceholders.map((label) => (
              <div key={label} className="photo-frame">
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" data-reveal>
        <div className="space-y-8">
          <div>
            <p className="section-kicker">Signal</p>
            <h2 className="section-title">Shipping in public.</h2>
            <p className="section-subtitle">
              A quick look at recent commits and a year of contribution cadence.
            </p>
          </div>
          <div className="signal-grid">
            <GitHubActivity />
            <ContributionGraph />
          </div>
        </div>
      </section>

      <section className="section-block" id="contact" data-reveal>
        <div className="contact-grid">
          <div>
            <p className="section-kicker">Contact</p>
            <h2 className="section-title">Let&apos;s build something memorable.</h2>
            <p className="section-subtitle">
              Open to internships, full-time roles, and collaborations that
              value craft. If you are hiring or want to collaborate, reach out.
            </p>
          </div>
          <div className="contact-actions">
            <a href="mailto:liumasn@gmail.com">Email</a>
            <a
              href="https://www.linkedin.com/in/masonliiu/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/masonliiu"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

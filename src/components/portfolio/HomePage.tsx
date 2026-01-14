"use client";

import { Link } from "next-view-transitions";
import ImmersiveLaunchButton from "@/components/portfolio/ImmersiveLaunchButton";
import { projects } from "@/lib/projects";
import GitHubActivity from "@/components/portfolio/GitHubActivity";
import ContributionGraph from "@/components/portfolio/ContributionGraph";

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
  const featured = projects.slice(0, 4);

  return (
    <main className="page-shell">
      <section className="section-block" data-reveal>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <p className="section-kicker">Mason Liu · Portfolio</p>
            <h1 className="hero-title" data-hero>
              Building expressive software that feels alive{" "}
              <span>and intentional.</span>
            </h1>
            <p className="hero-lead">
              I am a Computer Science student at UTD focused on full-stack
              engineering and interactive systems. My work blends product polish,
              game-inspired motion, and performance-conscious architecture.
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
              <p>
                Building a sharper portfolio experience and experimenting with
                immersive storytelling for recruiters and hiring managers.
              </p>
            </div>
            <div>
              <p className="section-kicker">Focus</p>
              <p>
                Full-stack systems, 3D interaction, and interfaces that reward
                curiosity without sacrificing clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" data-reveal>
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Selected work</p>
              <h2 className="section-title">Projects with depth.</h2>
            </div>
            <Link className="work-meta" href="/projects">
              Full archive →
            </Link>
          </div>
          <div className="work-list">
            {featured.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="work-row"
                data-reveal
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="work-meta">{project.createdAt}</div>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                  </div>
                  <div className="work-meta">{project.repo}</div>
                </div>
                <div className="work-tags">
                  {project.tags.slice(0, 6).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
          <h2 className="section-title">A studio mindset.</h2>
          <p className="section-subtitle">
            I build end-to-end products with an obsession for detail, clarity,
            and the feeling that every interaction has purpose.
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

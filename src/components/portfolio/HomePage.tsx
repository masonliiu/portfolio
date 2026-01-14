"use client";

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
  return (
    <main className="home-shell">
      <section className="hero-stage blob-stage" data-reveal>
        <div className="hero-grid">
          <div>
            <p className="hero-kicker">Mason Liu</p>
            <div className="hero-stack" data-hero>
              <div className="hero-text">
                {heroLines.map((line) => (
                  <span
                    key={line}
                    className="blob-text"
                    data-blob-text={line}
                    data-blob-target
                  >
                    {line}
                  </span>
                ))}
              </div>
              <div className="hero-blob" aria-hidden="true" />
            </div>
            <p className="hero-subline">
              CS @ UTD · Full-stack systems · Dallas, TX
            </p>
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
          </div>
          <div className="hero-meta">
            <div className="meta-block">
              <span>Focus</span>
              <div>Product systems</div>
              <div>Interaction design</div>
              <div>3D experiences</div>
            </div>
            <div className="meta-block">
              <span>Now</span>
              <div>Open to internships</div>
              <div>Open to full-time</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="about" data-reveal>
        <div className="section-grid">
          <div>
            <p className="section-kicker">About</p>
            <h2
              className="section-title outline-fill blob-text"
              data-fill
              data-blob-text="Full-stack engineer. Interaction focus."
              data-blob-target
            >
              Full-stack engineer. Interaction focus.
            </h2>
          </div>
          <div className="section-content">
            <p className="section-subtitle">
              Shipping products, systems, and 3D experiments.
            </p>
            <div className="chip-row">
              {aboutChips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block collage-section" data-reveal>
        <div className="section-grid">
          <div>
            <p className="section-kicker">Photography</p>
            <h2
              className="section-title outline-fill blob-text"
              data-fill
              data-blob-text="Visual studies."
              data-blob-target
            >
              Visual studies.
            </h2>
          </div>
          <div className="section-content">
            <div className="image-collage" aria-hidden="true">
              <div className="image-card image-card--wide" />
              <div className="image-card image-card--portrait" />
              <div className="image-card image-card--small" />
            </div>
          </div>
        </div>
      </section>

      <WorkFocus id="work" className="section-block work-section" />

      <section className="section-block" id="immersive" data-reveal>
        <div className="section-grid">
          <div>
            <p className="section-kicker">Immersive room</p>
            <h2
              className="section-title outline-fill blob-text"
              data-fill
              data-blob-text="Walk the studio."
              data-blob-target
            >
              Walk the studio.
            </h2>
          </div>
          <div className="section-content">
            <p className="section-subtitle">
              Optional 3D room with hotspots for projects, skills, and
              experience.
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
          </div>
        </div>
      </section>

      <section className="section-block" id="signal" data-reveal>
        <div className="section-grid">
          <div>
            <p className="section-kicker">Signal</p>
            <h2
              className="section-title outline-fill blob-text"
              data-fill
              data-blob-text="Shipping."
              data-blob-target
            >
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

      <section className="section-block" id="contact" data-reveal>
        <div className="section-grid">
          <div>
            <p className="section-kicker">Contact</p>
            <h2
              className="section-title outline-fill blob-text"
              data-fill
              data-blob-text="Let&apos;s build."
              data-blob-target
            >
              Let&apos;s build.
            </h2>
          </div>
          <div className="section-content">
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
          </div>
        </div>
      </section>
    </main>
  );
}

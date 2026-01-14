export default function AboutContent() {
  return (
    <section className="section-block" data-reveal>
      <div className="space-y-6">
        <p className="section-kicker">About</p>
        <h1 className="section-title">A builder with a design pulse.</h1>
        <p className="section-subtitle">
          I am Mason Liu, a Computer Science student at UTD who loves making
          software feel cinematic and intentional. My work combines full-stack
          engineering, low-level curiosity, and game-inspired interaction design.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-[1rem] leading-relaxed text-[var(--muted)]">
          <p>
            I am drawn to projects that are both technically ambitious and
            emotionally engaging. I build the systems underneath, then obsess
            over the details that make an interface feel alive.
          </p>
          <p>
            Recently I have been working on full-stack platforms, interaction
            experiments, and 3D worlds that reward exploration. I thrive in
            environments that value clarity, craft, and thoughtful iteration.
          </p>
          <p>
            Outside of software I explore photography, sports, and music. These
            interests shape how I think about rhythm, composition, and pacing in
            the experiences I build.
          </p>
        </div>
        <div className="space-y-6">
          <div className="work-meta">Highlights</div>
          <ul className="space-y-4 text-sm text-[var(--muted)]">
            <li>Based in Dallas, TX · CS @ UTD</li>
            <li>Full-stack development + systems programming</li>
            <li>3D interaction + cinematic UI</li>
          </ul>
          <div className="hero-cta">
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
            <a
              href="https://instagram.com/mason_liuu"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

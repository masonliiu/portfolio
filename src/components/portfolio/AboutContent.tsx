export default function AboutContent() {
  return (
    <section className="section-block section-center" data-reveal>
      <p className="section-kicker">About</p>
      <h1 className="section-title">A builder with a design pulse.</h1>
      <p className="section-subtitle">
        I am Mason Liu, a CS student at UTD focused on full-stack systems,
        cinematic UI, and interactive experiences that feel effortless.
      </p>

      <div className="max-w-2xl space-y-5 text-[1rem] leading-relaxed text-[var(--muted)]">
        <p>
          I build the systems underneath, then obsess over motion, clarity, and
          the details that make interfaces feel alive.
        </p>
        <p>
          Outside of software I explore photography, sports, and music, which
          shape how I think about rhythm, composition, and pacing.
        </p>
      </div>

      <div className="chip-row">
        <span>Dallas, TX</span>
        <span>CS @ UTD</span>
        <span>Full-stack + systems</span>
        <span>3D interaction</span>
      </div>

      <div className="hero-cta">
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
        <a
          href="https://instagram.com/mason_liuu"
          target="_blank"
          rel="noreferrer"
          data-magnet
          data-cursor="Instagram"
        >
          Instagram
        </a>
      </div>
    </section>
  );
}

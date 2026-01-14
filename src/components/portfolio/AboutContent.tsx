export default function AboutContent() {
  return (
    <section className="section-block" data-reveal>
      <div className="section-center space-y-6">
        <p className="section-kicker">About</p>
        <h1 className="section-title outline-fill" data-fill data-blob-target>
          Mason Liu.
        </h1>
        <p className="section-subtitle">
          CS @ UTD. Full-stack systems, interaction design, and 3D experiments.
        </p>
      </div>

      <div className="mt-10 max-w-2xl space-y-5 text-[1rem] leading-relaxed text-[var(--muted)]">
        <p>
          I build end-to-end products and focus on the details that make them
          feel fast, clear, and intentional.
        </p>
        <p>
          Outside of software I explore photography, sports, and music.
        </p>
      </div>

      <div className="chip-row mt-10">
        <span>Dallas, TX</span>
        <span>CS @ UTD</span>
        <span>Full-stack</span>
        <span>3D</span>
      </div>

      <div className="hero-cta mt-10">
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

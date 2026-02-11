export default function CinematicHero() {
  return (
    <section
      id="about"
      data-reveal
      className="cinematic-hero relative z-10 flex min-h-[68vh] items-center"
    >
      <div className="cinematic-copy w-full">
        <p className="cinematic-kicker" data-blob-text="Mason Liu">
          Mason Liu
        </p>
        <h1 className="cinematic-title" data-fill>
          <span data-blob-text="Full-stack">Full-stack</span>
          <span data-blob-text="systems">systems</span>
          <span data-blob-text="3D interaction">3D interaction</span>
        </h1>
        <p className="cinematic-subtitle">
          I&apos;m currently studying Computer Science at UTD and focus on building
          full-stack products with clean systems thinking and intentional user
          interaction.
        </p>
        <div className="cinematic-links" aria-label="Primary links">
          <a href="https://github.com/masonliiu" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/masonliiu/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:liumasn@gmail.com">Email</a>
        </div>
      </div>
    </section>
  );
}

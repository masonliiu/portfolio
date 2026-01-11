import Image from "next/image";

export default function AboutContent() {
  return (
    <>
      <div className="terminal-title">
        <span className="mt-3 text-3xl font-extrabold tracking-tight">About me</span>
      </div>

      <section className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex flex-col items-start gap-3">
          <div className="portrait-slot">
            <div className="portrait-card">
              <Image
                src="/en1.png"
                alt="Mason Liu"
                width={1200}
                height={1200}
                className="portrait-img"
                priority
              />
            </div>
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--color-subtext1)]">
            Dallas, TX · CS @ UTD
          </div>
        </div>
        <div className="space-y-6 text-base text-[var(--color-subtext0)]">
          <p>
            Hey! I&apos;m Mason Liu — a Computer Science student at UTD based in
            Dallas, Texas. I specialize in full-stack development, with thorough
            experience in game development and low-level systems programming.
          </p>
          <p>
            Recently, I&apos;ve been working on a wide variety of projects. Some
            very product-focused, others more technical, but all driven by my
            desire to build things from scratch that I&apos;m genuinely proud to
            put out publicly.
          </p>
          <p>
            Outside of software, I spend time playing virtually all sports,
            exploring photography, and expanding my music palette. If you want
            to collaborate or chat, feel free to reach out.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--color-subtext1)]">
            <a
              href="https://github.com/masonliiu"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <span className="text-[var(--color-surface1)]">|</span>
            <a
              href="https://www.linkedin.com/in/masonliiu/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <span className="text-[var(--color-surface1)]">|</span>
            <a href="mailto:liumasn@gmail.com">Email</a>
            <span className="text-[var(--color-surface1)]">|</span>
            <a
              href="https://instagram.com/mason_liuu"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

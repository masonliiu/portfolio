"use client";

import Image from "next/image";

type HeroProps = {
  onMoreAbout: () => void;
};

export default function Hero({ onMoreAbout }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative z-10 flex flex-col gap-6 py-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-4xl">
          Hey! I&apos;m{" "}
          <span className="text-[var(--color-accent)] decoration-[color-mix(in srgb,var(--color-accent) 40%,transparent)]">
            Mason Liu
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-subtext0)]">
          Mason Liu is a CS student at UTD focused on full-stack development and
          game development.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--color-subtext1)]">
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
          <span className="text-[var(--color-surface1)]">|</span>
          <button
            type="button"
            className="more-link clickable border-0 bg-transparent p-0"
            onClick={onMoreAbout}
          >
            More about me
            <span className="more-link__arrow"> →</span>
          </button>
        </div>
      </div>
      <div className="flex justify-start lg:justify-end">
        <div className="portrait-slot">
          <div
            className="portrait-card"
          >
            <Image
              src="/en1.png"
              alt="Mason Liu portrait"
              width={1200}
              height={1200}
              className="portrait-img"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

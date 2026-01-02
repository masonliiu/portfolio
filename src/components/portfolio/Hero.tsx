"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);

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
          <a href="https://instagram.com/mason_liuu" target="_blank" rel="noreferrer">
              Instagram
          </a>
            <span className="text-[var(--color-surface1)]">|</span>
          <Link
            className="more-link"
            href="/about"
          >
            More about me
            <span className="more-link__arrow"> →</span>
          </Link>
        </div>
      </div>
      <div className="flex justify-start lg:justify-end">
        <div className="relative flex items-start gap-6">
          <div className="lamp">
            <span className="lamp-stand" />
            <span className="lamp-arm" />
            <span className="lamp-beam" />
          </div>
          <div
            className="portrait-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src="/po1.jpg"
              alt="Mason Liu portrait"
              width={320}
              height={320}
              priority
            />
            <Image
              src="/po2.jpg"
              alt="Mason Liu alternate portrait"
              width={320}
              height={320}
              className={`portrait-img portrait-alt ${isHovered ? "is-visible" : ""}`}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

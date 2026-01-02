import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 className="font-extrabold tracking-tight md:text-4xl">
          Hey! I&apos;m{" "}
          <span className="text-[var(--color-accent)] 40%,transparent)]">
            Mason Liu
          </span>
        </h1>
        <p className="mt-4 w-140 text-lg text-[var(--color-subtext0)]">
          I'm currently studying as a CS student @ UTD. I specialize in full-stack development and
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
          <a href=
          "mailto:liumasn@gmail.com"
          target="_blank"
          rel="noreferrer"
          >
            Email
          </a>
          <span className="text-[var(--color-surface1)]">|</span>
          <a
            href="/about"
          >
            More about me →
          </a>
        </div>
      </div>
      <div className="flex justify-center lg:justify-center">
        <div style={{ width: '60%'}}>
          <Image
            src="/po2.jpg"
            alt="Mason Liu portrait"
            width={800}
            height={800}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

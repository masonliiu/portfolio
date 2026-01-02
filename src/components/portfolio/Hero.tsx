import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 flex flex-col gap-6 py-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Hey! I&apos;m{" "}
          <span className="text-[var(--color-accent)] underline decoration-dashed decoration-[color-mix(in srgb,var(--color-accent) 40%,transparent)] underline-offset-4">
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
        </div>
      </div>
      <div className="flex justify-start lg:justify-end">
        <div className="h-40 w-40 overflow-hidden rounded-2xl border border-[color-mix(in srgb,var(--color-surface1) 70%,transparent)] bg-[var(--color-mantle)]">
          <Image
            src="/portrait.jpg"
            alt="Mason Liu portrait"
            width={320}
            height={320}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

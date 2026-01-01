import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="flex flex-col gap-6">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Product Designer + Frontend Engineer
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Crafting thoughtful, fast, and cinematic web experiences.
        </h1>
        <p className="text-lg text-slate-600">
          I build portfolio-grade product sites with strong visual systems and
          careful motion. This space highlights my projects, skills, and the
          immersive room concept.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
            href="#projects"
          >
            View Projects
          </a>
          <a
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400"
            href="mailto:mason@example.com"
          >
            Email Me
          </a>
          <Link
            className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white"
            href="/immersive"
          >
            Try Immersive Mode
          </Link>
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white">
        <div className="text-sm uppercase tracking-[0.4em] text-slate-300">
          Snapshot
        </div>
        <ul className="mt-6 space-y-4 text-sm text-slate-200">
          <li>
            <span className="block text-2xl font-semibold text-white">7+</span>
            Product launches across web and mobile.
          </li>
          <li>
            <span className="block text-2xl font-semibold text-white">4</span>
            Years shipping design systems and UI platforms.
          </li>
          <li>
            <span className="block text-2xl font-semibold text-white">3</span>
            3D interactions in production campaigns.
          </li>
        </ul>
      </div>
    </section>
  );
}

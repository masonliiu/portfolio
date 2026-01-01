const projects = [
  {
    name: "Studio Atlas",
    description: "A modular portfolio platform with motion-driven case studies.",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
  },
  {
    name: "Signal Rooms",
    description: "An interactive 3D campaign microsite for product launches.",
    stack: ["React Three Fiber", "GSAP", "Vercel"],
  },
  {
    name: "Northwind OS",
    description: "Design system and dashboard templates for B2B teams.",
    stack: ["TypeScript", "Storybook", "Figma"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Projects
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Selected work
          </h2>
        </div>
        <a
          className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          href="mailto:mason@example.com"
        >
          Request full case studies
        </a>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.name}
            className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-slate-900">
              {project.name}
            </h3>
            <p className="text-sm text-slate-600">{project.description}</p>
            <div className="mt-auto flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

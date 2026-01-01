const skillGroups = [
  {
    title: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion"],
  },
  {
    title: "3D + Motion",
    items: ["React Three Fiber", "Three.js", "GSAP", "Spline"],
  },
  {
    title: "Product",
    items: ["Design Systems", "Prototyping", "User Research", "UX Writing"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
        Skills
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">
        Capabilities across design and engineering
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

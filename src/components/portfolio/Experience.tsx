const experiences = [
  {
    role: "Senior Product Designer",
    company: "Aurora Labs",
    period: "2022 — Present",
    highlights: [
      "Led product storytelling for flagship launches.",
      "Built a design system adopted across 5 teams.",
    ],
  },
  {
    role: "Frontend Engineer",
    company: "Northwind",
    period: "2020 — 2022",
    highlights: [
      "Shipped interactive marketing experiences.",
      "Optimized performance for core landing pages.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
        Experience
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">
        Product-focused roles
      </h2>
      <div className="mt-8 space-y-6">
        {experiences.map((experience) => (
          <div
            key={experience.company}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {experience.role}
                </h3>
                <p className="text-sm text-slate-600">{experience.company}</p>
              </div>
              <span className="text-sm font-medium text-slate-500">
                {experience.period}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {experience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

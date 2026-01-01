const projects = [
  {
    name: "Mase Labs Collective",
    description:
      "A professional platform for social media growth with a clean storefront, Stripe-powered checkout, order tracking by ID/email, and real-time status updates.",
    links: [
      { label: "maselabs.com", href: "https://maselabs.com" },
    ],
    tags: ["Shop", "Payments", "Order tracking"],
  },
  {
    name: "JVM Custom Memory Arena",
    description:
      "A Java memory arena built to model JVM-style allocation and deepen understanding of low-level runtime behavior.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/jvm-custom-memory-arena",
      },
    ],
    tags: ["Java", "Systems"],
  },
  {
    name: "Soundborn",
    description:
      "A Unity 6.2 iOS turn-based RPG where musical genres become characters; core systems are complete, including gacha collection, multi-enemy combat, status effects, and persistent progression.",
    links: [
      { label: "GitHub", href: "https://github.com/masonliiu/soundborn" },
    ],
    tags: ["Unity 6.2", "C#", "iOS"],
  },
  {
    name: "Bionic Reading Extension",
    description:
      "A Chrome extension that toggles bionic reading on any webpage to improve scanning and focus.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/bionic-reading-extension",
      },
    ],
    tags: ["Chrome", "Extension"],
  },
  {
    name: "South Park View Counter",
    description:
      "A South Park-themed GitHub profile view counter with a drag-and-drop builder, real-time counts, dark mode support, and Redis-backed persistence.",
    links: [
      {
        label: "Live",
        href: "https://southpark-view-counter.vercel.app/",
      },
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/south-park-view-counter",
      },
    ],
    tags: ["Node.js", "Redis", "Vercel"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24">
      <div className="terminal-title">Projects</div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        Selected builds
      </h2>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.name} className="terminal-card p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                {project.tags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--accent)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

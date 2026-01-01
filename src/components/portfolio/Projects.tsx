const projects = [
  {
    name: "Mase Labs Collective",
    description:
      "A professional platform for social media growth with a clean storefront, Stripe-powered checkout, order tracking by ID/email, and real-time status updates.",
    links: [
      { label: "maselabs.com", href: "https://maselabs.com" },
    ],
    tags: ["Shop", "Payments", "Order tracking"],
    featured: true,
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
    featured: true,
  },
  {
    name: "Soundborn",
    description:
      "A Unity 6.2 iOS turn-based RPG where musical genres become characters; core systems are complete, including gacha collection, multi-enemy combat, status effects, and persistent progression.",
    links: [
      { label: "GitHub", href: "https://github.com/masonliiu/soundborn" },
    ],
    tags: ["Unity 6.2", "C#", "iOS"],
    featured: true,
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
    featured: false,
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
    featured: false,
  },
];

const tagColors = [
  "peach",
  "blue",
  "green",
  "mauve",
  "red",
  "sapphire",
  "teal",
  "lavender",
  "yellow",
];

export default function Projects() {
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <section id="projects" className="scroll-mt-24">
      <div className="terminal-title">Projects</div>
      <div className="mt-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Featured projects
        </h2>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {featuredProjects.map((project) => (
          <article key={project.name} className="terminal-card overflow-hidden">
            <div className="bg-[var(--color-surface0)] p-4">
              <div className="flex items-center gap-2 text-xs text-[var(--color-subtext1)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-red)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--color-yellow)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--color-green)]" />
                <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-[var(--color-overlay1)]">
                  Featured
                </span>
              </div>
              <div className="mt-4 rounded-lg bg-[var(--color-base)] px-4 py-5 text-sm text-[var(--color-text)]">
                <div className="text-[var(--color-accent)]">
                  {project.name}
                </div>
                <p className="mt-2 text-sm text-[var(--color-subtext0)]">
                  {project.description}
                </p>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-sm text-[var(--color-subtext0)]">
                {project.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {project.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      borderColor: `var(--color-${tagColors[index % tagColors.length]})`,
                      color: `var(--color-${tagColors[index % tagColors.length]})`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {otherProjects.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {otherProjects.map((project) => (
            <article key={project.name} className="terminal-card p-5">
              <h3 className="text-base font-semibold">{project.name}</h3>
              <p className="mt-2 text-sm text-[var(--color-subtext0)]">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

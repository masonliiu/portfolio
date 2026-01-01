export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  links: ProjectLink[];
  highlights: string[];
  details: string[];
};

export const projects: Project[] = [
  {
    slug: "mase-labs",
    title: "Mase Labs Collective",
    summary:
      "A professional platform for social media growth with a storefront, Stripe checkout, order tracking, and live status updates.",
    tags: ["Product", "Payments", "Order Tracking"],
    links: [{ label: "Live", href: "https://maselabs.com" }],
    highlights: [
      "Checkout flow built around Stripe payments.",
      "Order tracking via ID + email lookup.",
      "Live status updates and execution history.",
    ],
    details: [
      "Mase Labs Collective is designed to make service purchasing and tracking feel polished and reliable.",
      "The platform centers on a clear purchasing flow, transparent status updates, and a clean storefront experience.",
    ],
  },
  {
    slug: "jvm-custom-memory-arena",
    title: "JVM Custom Memory Arena",
    summary:
      "A Java memory arena built to model JVM-style allocation and deepen understanding of low-level runtime behavior.",
    tags: ["Java", "Systems"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/jvm-custom-memory-arena",
      },
    ],
    highlights: [
      "Manual allocation flow modeled after JVM internals.",
      "Focus on predictability and clarity over abstraction.",
      "Educational tooling for runtime behavior exploration.",
    ],
    details: [
      "This project explores memory allocation patterns with explicit control and instrumentation.",
      "It serves as a sandbox for understanding runtime trade-offs and allocation strategy design.",
    ],
  },
  {
    slug: "soundborn",
    title: "Soundborn",
    summary:
      "A Unity 6.2 iOS turn-based RPG where musical genres become characters; core systems are complete with ongoing content development.",
    tags: ["Unity 6.2", "C#", "iOS"],
    links: [
      { label: "GitHub", href: "https://github.com/masonliiu/soundborn" },
    ],
    highlights: [
      "Gacha-based character collection and progression.",
      "Turn-based combat with status effects and multi-enemy support.",
      "Persistent save system for player progression.",
    ],
    details: [
      "Soundborn blends genre-inspired character design with strategic combat and long-term progression.",
      "The project is in active development, with core gameplay systems already implemented.",
    ],
  },
  {
    slug: "bionic-reading-extension",
    title: "Bionic Reading Extension",
    summary:
      "A Chrome extension that toggles bionic reading on any webpage to improve scanning and focus.",
    tags: ["Chrome", "Extension"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/bionic-reading-extension",
      },
    ],
    highlights: [
      "Instant toggle on any webpage.",
      "Lightweight DOM processing for speed.",
      "Simple, distraction-free UI.",
    ],
    details: [
      "This extension gives readers the ability to switch between standard and bionic reading on the fly.",
      "It focuses on clarity and low overhead to keep browsing smooth.",
    ],
  },
  {
    slug: "south-park-view-counter",
    title: "South Park View Counter",
    summary:
      "A South Park-themed GitHub profile view counter with a drag-and-drop builder, real-time counts, and Redis-backed persistence.",
    tags: ["Node.js", "Redis", "Vercel"],
    links: [
      { label: "Live", href: "https://southpark-view-counter.vercel.app/" },
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/south-park-view-counter",
      },
    ],
    highlights: [
      "Drag-and-drop builder for custom counters.",
      "Dynamic SVG generation on each request.",
      "Persistent counts stored in Upstash Redis.",
    ],
    details: [
      "The counter generates a dynamic SVG per request and increments counts in Redis.",
      "It is optimized for lightweight embedding in READMEs and personal sites.",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

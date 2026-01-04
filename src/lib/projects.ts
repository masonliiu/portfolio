export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  repo: string;
  stars: number | null;
  contributors: string[];
  createdAt: string;
  summary: string;
  tags: string[];
  links: ProjectLink[];
  sections: {
    title: string;
    body?: string[];
    bullets?: string[];
  }[];
};

export const projects: Project[] = [
  {
    slug: "mase-labs",
    title: "Mase Labs Collective",
    repo: "masonliiu/maselabs",
    stars: null,
    contributors: ["masonliiu"],
    createdAt: "Nov 11, 2025",
    summary:
      "Full-stack commerce and fulfillment platform with Stripe checkout, automated order queues, and production monitoring for GitHub growth services.",
    tags: [
      "React",
      "Stripe",
      "Express",
      "Node.js",
      "Vercel",
      "Neon",
      "PostgreSQL",
      "SQLite",
      "GitHub API",
      "REST",
      "Webhooks",
    ],
    links: [
      { label: "Live", href: "https://maselabs.com" },
      { label: "GitHub", href: "https://github.com/masonliiu/maselabs" },
    ],
    sections: [
      {
        title: "Overview",
        body: [
          "Mase Labs Collective is a full-funnel commerce and fulfillment platform for GitHub growth services.",
          "It blends a polished storefront, verified Stripe checkout, live order tracking, and automated fulfillment pipelines into one production-ready system.",
        ],
      },
      {
        title: "End-to-End Flow",
        bullets: [
          "Discovery → service selection → Stripe checkout → order creation.",
          "Payment verification triggers queueing and fulfillment.",
          "Live tracking by order ID + email with execution history.",
          "Completion or refund flags with email notifications.",
        ],
      },
      {
        title: "Architecture",
        bullets: [
          "React client with service pages, checkout, tracking, and admin status.",
          "Express API with SQLite for local development.",
          "Serverless API on Vercel with Neon Postgres for production.",
          "Cron/worker processing with retries, locking, and rate limits.",
        ],
      },
      {
        title: "Operational Safeguards",
        bullets: [
          "Account availability checks before action execution.",
          "Order locking and retry limits to prevent double-processing.",
          "Action history logging for each fulfillment step.",
        ],
      },
    ],
  },
  {
    slug: "jvm-custom-memory-arena",
    title: "JVM Custom Memory Arena",
    repo: "masonliiu/jvm-custom-memory-arena",
    stars: null,
    contributors: ["masonliiu"],
    createdAt: "Dec 28, 2025",
    summary:
      "From-scratch manual memory arena in Java with explicit allocation, bounds checking, and raw byte layouts for runtime study.",
    tags: [
      "Java",
      "JVM",
      "Memory Management",
      "Data Structures",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/jvm-custom-memory-arena",
      },
    ],
    sections: [
      {
        title: "Motivation",
        body: [
          "This project removes JVM abstractions by implementing memory management directly on top of a single byte array.",
          "It makes allocation, pointer math, and layout rules explicit instead of hidden behind the runtime.",
        ],
      },
      {
        title: "Memory Arena Model",
        bullets: [
          "Contiguous byte[] arena with a single allocation pointer.",
          "Explicit alloc and allocAligned with alignment waste tracking.",
          "All reads/writes are bounds-checked with fail-fast errors.",
        ],
      },
      {
        title: "Data Structures Built on Raw Bytes",
        bullets: [
          "Linked list nodes: [value:int][next:int].",
          "Fixed array and dynamic vector stores.",
          "UTF-16 string store and chained hash table store.",
        ],
      },
      {
        title: "Safety & Diagnostics",
        bullets: [
          "InvalidAddressException and InvalidPointerException with detailed context.",
          "Strict pointer validation with -1 sentinel for null.",
          "Big-endian primitive encoding for transparent representation.",
        ],
      },
      {
        title: "Roadmap",
        bullets: [
          "Advanced memory regions and free-list allocator.",
          "Extended data-structure operations and visualization tooling.",
          "Interactive demos for education and debugging.",
        ],
      },
    ],
  },
  {
    slug: "soundborn",
    title: "Soundborn",
    repo: "masonliiu/soundborn",
    stars: null,
    contributors: ["masonliiu"],
    createdAt: "Sep 2, 2025",
    summary:
      "Unity iOS turn-based RPG with a full combat loop, gacha collection, and persistent progression systems.",
    tags: [
      "Unity",
      "C#",
      "iOS",
      "URP",
      "Unity Input System",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/masonliiu/soundborn" },
    ],
    sections: [
      {
        title: "World & Premise",
        body: [
          "Soundborn is a turn-based RPG where musical genres manifest as characters fighting The Silence.",
          "The project is in active development with core gameplay systems fully implemented.",
        ],
      },
      {
        title: "Core Gameplay Systems",
        bullets: [
          "Character collection and gacha system.",
          "Party lineup management with 4-member teams.",
          "Tower progression with scaling difficulty and rewards.",
        ],
      },
      {
        title: "Combat & Targeting",
        bullets: [
          "Speed-based turn order with multi-enemy combat.",
          "Auto-targeting with tap-to-switch selection.",
          "Status effects (DoT, Stun, Sleep, Defense Up).",
        ],
      },
      {
        title: "Progression & Persistence",
        bullets: [
          "Leveling and stat scaling tied to tower floors.",
          "Persistent save/load with player data tracking.",
          "Elemental advantage/disadvantage system.",
        ],
      },
      {
        title: "Tech Stack",
        bullets: [
          "Unity 6.2 (URP) with the new Input System.",
          "C# codebase with modular combat and UI systems.",
        ],
      },
    ],
  },
  {
    slug: "bionic-reading-extension",
    title: "Bionic Reading Extension",
    repo: "masonliiu/bionic-reading-extension",
    stars: null,
    contributors: ["masonliiu"],
    createdAt: "Oct 24, 2025",
    summary:
      "Chrome extension that transforms live pages into bionic reading layouts with content scripts and persistent settings.",
    tags: [
      "Chrome Extension",
      "JavaScript",
      "Browser APIs",
      "Content Scripts",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/bionic-reading-extension",
      },
    ],
    sections: [
      {
        title: "Purpose",
        body: [
          "The extension transforms live webpage text into bionic reading format to improve readability and focus.",
        ],
      },
      {
        title: "How It Works",
        bullets: [
          "Scans text nodes on the active page and rebuilds them with emphasis.",
          "Uses browser APIs and cookie-aware preferences for persistence.",
          "Hashes configuration so formatting stays consistent across reloads.",
        ],
      },
      {
        title: "Implementation Notes",
        bullets: [
          "Content scripts handle DOM traversal and transformation.",
          "UI toggles let users switch modes instantly.",
          "Optimized for low overhead so browsing stays smooth.",
        ],
      },
    ],
  },
  {
    slug: "south-park-view-counter",
    title: "South Park View Counter",
    repo: "masonliiu/south-park-view-counter",
    stars: null,
    contributors: ["masonliiu"],
    createdAt: "Dec 1, 2025",
    summary:
      "SVG-based GitHub view counter with a drag-and-drop builder, Redis persistence, and real-time rendering.",
    tags: [
      "Node.js",
      "Express",
      "Redis",
      "Upstash",
      "Vercel",
      "SVG",
    ],
    links: [
      { label: "Live", href: "https://southpark-view-counter.vercel.app/" },
      {
        label: "GitHub",
        href: "https://github.com/masonliiu/south-park-view-counter",
      },
    ],
    sections: [
      {
        title: "Overview",
        body: [
          "A customizable GitHub profile view counter powered by dynamic SVGs and South Park characters.",
          "Includes a drag-and-drop builder that generates embeddable markdown instantly.",
        ],
      },
      {
        title: "How It Works",
        bullets: [
          "Requests to /@username increment a Redis-backed counter.",
          "Server responds with a freshly rendered SVG on every view.",
          "Builder UI uses browser APIs and cookie-aware settings to persist presets.",
        ],
      },
      {
        title: "Customization",
        bullets: [
          "Character order, padding, scaling, and dark mode controls.",
          "Fast, lightweight SVG output optimized with compression.",
        ],
      },
      {
        title: "Stack",
        bullets: [
          "Node.js + Express backend with Upstash Redis storage.",
          "Serverless deployment on Vercel.",
        ],
      },
    ],
  },
];

function normalizeSlug(value: string) {
  return value.toLowerCase().trim().replace(/\/+$/, "");
}

function slugFromTitle(value: string) {
  return normalizeSlug(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getProject(slug: string) {
  const normalized = normalizeSlug(slug);
  return projects.find((project) => {
    const repoSlug = project.repo.split("/")[1];
    return (
      project.slug === normalized ||
      repoSlug === normalized ||
      slugFromTitle(project.title) === normalized
    );
  });
}

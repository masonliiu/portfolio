export type PanelKey =
  | "projects"
  | "skills"
  | "experience"
  | "resume"
  | "contact";

export type Hotspot = {
  id: string;
  label: string;
  panelKey: PanelKey;
  position: [number, number, number];
  radius: number;
};

export const hotspots: Hotspot[] = [
  {
    id: "projects",
    label: "Projects",
    panelKey: "projects",
    position: [1.95, 1.25, -0.4],
    radius: 0.28,
  },
  {
    id: "skills",
    label: "Skills",
    panelKey: "skills",
    position: [-0.6, 1.35, -2.0],
    radius: 0.26,
  },
  {
    id: "experience",
    label: "Experience",
    panelKey: "experience",
    position: [1.45, 0.95, -1.35],
    radius: 0.24,
  },
  {
    id: "resume",
    label: "Resume",
    panelKey: "resume",
    position: [1.65, 0.9, -1.6],
    radius: 0.22,
  },
  {
    id: "contact",
    label: "Contact",
    panelKey: "contact",
    position: [-1.45, 0.85, 1.45],
    radius: 0.24,
  },
];

export const panelContent = {
  projects: {
    title: "Projects",
    items: [
      {
        title: "Studio Atlas",
        description: "Modular portfolio platform with motion-driven case studies.",
      },
      {
        title: "Signal Rooms",
        description: "Interactive 3D launch experience with cinematic lighting.",
      },
      {
        title: "Northwind OS",
        description: "Design system and product dashboard kit for B2B teams.",
      },
    ],
  },
  skills: {
    title: "Skills",
    items: [
      { title: "Frontend", description: "Next.js, React, TypeScript, Tailwind" },
      { title: "Motion", description: "Framer Motion, GSAP, CSS animation" },
      { title: "3D", description: "React Three Fiber, Drei, Three.js" },
    ],
  },
  experience: {
    title: "Experience",
    items: [
      {
        title: "Aurora Labs",
        description: "Senior Product Designer — 2022 to Present",
      },
      {
        title: "Northwind",
        description: "Frontend Engineer — 2020 to 2022",
      },
    ],
  },
  resume: {
    title: "Resume",
    items: [
      {
        title: "Download PDF",
        description: "Grab the latest resume in one click.",
        href: "/resume.pdf",
      },
    ],
  },
  contact: {
    title: "Contact",
    items: [
      {
        title: "Email",
        description: "mason@example.com",
        href: "mailto:mason@example.com",
      },
      {
        title: "LinkedIn",
        description: "linkedin.com/in/masonliu",
        href: "https://linkedin.com",
      },
      {
        title: "GitHub",
        description: "github.com/masonliu",
        href: "https://github.com",
      },
    ],
  },
} as const;

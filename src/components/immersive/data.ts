export type PanelKey = "desk" | "table" | "painting" | "shelf";

export type DetailKey =
  | "resume"
  | "experience"
  | "photography"
  | "project-one"
  | "project-two"
  | "project-three";

export type Hotspot = {
  id: string;
  label: string;
  panelKey: PanelKey;
  position: [number, number, number];
  radius: number;
};

export type DetailHotspot = {
  id: string;
  label: string;
  panelKey: PanelKey;
  detailKey: DetailKey;
  position: [number, number, number];
  radius: number;
};

export const hotspots: Hotspot[] = [
  {
    id: "desk",
    label: "Desk",
    panelKey: "desk",
    position: [1.45, 0.95, -1.35],
    radius: 0.26,
  },
  {
    id: "table",
    label: "Photography",
    panelKey: "table",
    position: [-0.3, 0.6, 0.5],
    radius: 0.22,
  },
  {
    id: "painting",
    label: "Painting",
    panelKey: "painting",
    position: [-0.6, 1.35, -2.0],
    radius: 0.24,
  },
  {
    id: "shelf",
    label: "Shelves",
    panelKey: "shelf",
    position: [1.8, 1.25, -0.2],
    radius: 0.26,
  },
];

export const detailHotspots: DetailHotspot[] = [
  {
    id: "resume-paper",
    label: "Resume",
    panelKey: "desk",
    detailKey: "resume",
    position: [1.5, 1.0, -1.4],
    radius: 0.12,
  },
  {
    id: "experience-paper",
    label: "Experience",
    panelKey: "desk",
    detailKey: "experience",
    position: [1.3, 1.0, -1.35],
    radius: 0.12,
  },
  {
    id: "photo-book",
    label: "Photography",
    panelKey: "table",
    detailKey: "photography",
    position: [-0.2, 0.58, 0.55],
    radius: 0.12,
  },
  {
    id: "project-one",
    label: "Project One",
    panelKey: "shelf",
    detailKey: "project-one",
    position: [1.7, 1.1, -0.5],
    radius: 0.11,
  },
  {
    id: "project-two",
    label: "Project Two",
    panelKey: "shelf",
    detailKey: "project-two",
    position: [1.85, 1.1, -0.5],
    radius: 0.11,
  },
  {
    id: "project-three",
    label: "Project Three",
    panelKey: "shelf",
    detailKey: "project-three",
    position: [2.0, 1.1, -0.5],
    radius: 0.11,
  },
];

export const panelKeybinds: Record<PanelKey, string> = {
  desk: "1",
  table: "2",
  painting: "3",
  shelf: "4",
};

export const panelTitles: Record<PanelKey, string> = {
  desk: "Desk Papers",
  table: "Photography Book",
  painting: "Gallery Wall",
  shelf: "Project Shelves",
};

export type PanelItem = {
  title: string;
  description: string;
  detailKey?: DetailKey;
};

export type PanelContent = Record<
  PanelKey,
  { title: string; items: PanelItem[] }
>;

export const panelContent: PanelContent = {
  desk: {
    title: "Desk Papers",
    items: [
      {
        title: "Resume",
        description: "Tap to open a close-up of the resume.",
        detailKey: "resume",
      },
      {
        title: "Work Experience",
        description: "Tap to open a close-up of experience highlights.",
        detailKey: "experience",
      },
    ],
  },
  table: {
    title: "Photography Book",
    items: [
      {
        title: "Photo Collection",
        description: "Tap to open the photography book preview.",
        detailKey: "photography",
      },
    ],
  },
  painting: {
    title: "Gallery Wall",
    items: [
      {
        title: "About Me",
        description: "Click the painting again to reveal the panel behind it.",
      },
    ],
  },
  shelf: {
    title: "Projects",
    items: [
      {
        title: "Project One",
        description: "Tap the left book for project details.",
        detailKey: "project-one",
      },
      {
        title: "Project Two",
        description: "Tap the center book for project details.",
        detailKey: "project-two",
      },
      {
        title: "Project Three",
        description: "Tap the right book for project details.",
        detailKey: "project-three",
      },
    ],
  },
} as const;

export const detailContent: Record<
  DetailKey,
  { title: string; description: string }
> = {
  resume: {
    title: "Resume",
    description: "Placeholder text for the resume close-up.",
  },
  experience: {
    title: "Work Experience",
    description: "Placeholder text for experience highlights.",
  },
  photography: {
    title: "Photography",
    description: "Placeholder text for the photography book preview.",
  },
  "project-one": {
    title: "Project One",
    description: "Placeholder description for the first project.",
  },
  "project-two": {
    title: "Project Two",
    description: "Placeholder description for the second project.",
  },
  "project-three": {
    title: "Project Three",
    description: "Placeholder description for the third project.",
  },
};

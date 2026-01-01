export const paletteOptions = [
  { id: "latte", label: "Latte" },
  { id: "frappe", label: "Frappe" },
  { id: "macchiato", label: "Macchiato" },
  { id: "mocha", label: "Mocha" },
] as const;

export const accentOptions = [
  { id: "rosewater", label: "Rosewater" },
  { id: "flamingo", label: "Flamingo" },
  { id: "pink", label: "Pink" },
  { id: "mauve", label: "Mauve" },
  { id: "red", label: "Red" },
  { id: "maroon", label: "Maroon" },
  { id: "peach", label: "Peach" },
  { id: "yellow", label: "Yellow" },
  { id: "green", label: "Green" },
  { id: "teal", label: "Teal" },
  { id: "sky", label: "Sky" },
  { id: "sapphire", label: "Sapphire" },
  { id: "blue", label: "Blue" },
  { id: "lavender", label: "Lavender" },
] as const;

export const paletteClasses = paletteOptions.map((option) => option.id);
export const accentNames = accentOptions.map((option) => option.id);

export type PaletteId = (typeof paletteOptions)[number]["id"];
export type AccentId = (typeof accentOptions)[number]["id"];

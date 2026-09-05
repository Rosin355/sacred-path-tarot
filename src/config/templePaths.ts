export const templePaths = [
  { id: "arcani", label: "Arcani", route: "/arcani", color: "270 55% 45%", glyph: "✦" },
  { id: "respiro", label: "Respiro", route: "/respiro", color: "175 40% 45%", glyph: "◯" },
  { id: "ispirazione", label: "Arte", route: "/ispirazione", color: "38 55% 52%", glyph: "◇" },
] as const;

export type TemplePathId = (typeof templePaths)[number]["id"];

import type { Metadata } from "next";
import ImmersiveExperience from "@/components/immersive/ImmersiveExperience";

export const metadata: Metadata = {
  title: "Immersive Mode | Mason Liu",
  description: "A cinematic 3D room experience with interactive hotspots.",
};

export default function ImmersivePage() {
  return <ImmersiveExperience />;
}

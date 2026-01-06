"use client";

import { useState } from "react";
import { useCursor } from "@react-three/drei";
import type { PanelKey } from "./data";
import { hotspots } from "./data";

type HotspotsProps = {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
  spots?: Hotspot[];
};

export default function Hotspots({
  activePanel,
  onSelect,
  spots,
}: HotspotsProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(Boolean(hovered));
  const activeSpots = spots ?? hotspots;

  return (
    <group>
      {activeSpots.map((spot) => {
        const isActive = activePanel === spot.panelKey;
        const isHovered = hovered === spot.id;
        return (
          <mesh
            key={spot.id}
            position={spot.position}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHovered(spot.id);
            }}
            onPointerOut={() => setHovered(null)}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(spot.panelKey);
            }}
            scale={isHovered || isActive ? 1.15 : 1}
          >
            <sphereGeometry args={[spot.radius, 24, 24]} />
            <meshStandardMaterial
              color={isActive ? "#f1f5f9" : "#a3b0bf"}
              transparent
              opacity={isHovered || isActive ? 0.14 : 0.05}
              emissive={isActive ? "#e2e8f0" : "#6b7280"}
              emissiveIntensity={isHovered || isActive ? 0.35 : 0.12}
            />
          </mesh>
        );
      })}
    </group>
  );
}

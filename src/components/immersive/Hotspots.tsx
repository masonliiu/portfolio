"use client";

import { useState } from "react";
import { useCursor } from "@react-three/drei";
import type { PanelKey } from "./data";
import { hotspots } from "./data";

type HotspotsProps = {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
};

export default function Hotspots({ activePanel, onSelect }: HotspotsProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(Boolean(hovered));

  return (
    <group>
      {hotspots.map((spot) => {
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
              color={isActive ? "#f8fafc" : "#94a3b8"}
              transparent
              opacity={isHovered || isActive ? 0.22 : 0.08}
              emissive={isActive ? "#f8fafc" : "#64748b"}
              emissiveIntensity={isHovered || isActive ? 0.8 : 0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

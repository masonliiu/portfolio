"use client";

import type { Hotspot, PanelKey } from "./data";
import { hotspots } from "./data";

type HotspotsProps = {
  activePanel: PanelKey | null;
  spots?: Hotspot[];
};

export default function Hotspots({
  activePanel,
  spots,
}: HotspotsProps) {
  const activeSpots = spots ?? hotspots;

  return (
    <group>
      {activeSpots.map((spot) => {
        const isActive = activePanel === spot.panelKey;
        return (
          <mesh
            key={spot.id}
            position={spot.position}
            scale={isActive ? 1.12 : 1}
          >
            <sphereGeometry args={[spot.radius, 24, 24]} />
            <meshStandardMaterial
              color={isActive ? "#f1f5f9" : "#a3b0bf"}
              transparent
              opacity={isActive ? 0.14 : 0.06}
              emissive={isActive ? "#e2e8f0" : "#6b7280"}
              emissiveIntensity={isActive ? 0.35 : 0.12}
            />
          </mesh>
        );
      })}
    </group>
  );
}

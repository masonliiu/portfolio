"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { DetailHotspot, Hotspot, PanelKey } from "./data";
import { hotspots } from "./data";

type HotspotsProps = {
  activePanel: PanelKey | null;
  spots?: Hotspot[];
};

export type MarkerProps = {
  id: string;
  position: [number, number, number];
  radius: number;
  active: boolean;
  color: string;
  emissive: string;
};

export function MarquiseMarker({
  id,
  position,
  radius,
  active,
  color,
  emissive,
}: MarkerProps) {
  const group = useRef<THREE.Group | null>(null);
  const baseY = position[1] + radius * 1.4 + 0.08;
  const phase = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < id.length; i += 1) {
      sum += id.charCodeAt(i);
    }
    return (sum % 360) * (Math.PI / 180);
  }, [id]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (active ? 1.35 : 0.9);
    group.current.position.y =
      baseY + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.025;
  });

  const scale = active ? 1.08 : 1;
  return (
    <group
      ref={group}
      position={[position[0], baseY, position[2]]}
      scale={scale}
    >
      <mesh scale={[radius * 0.9, radius * 1.8, radius * 0.9]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={active ? 0.7 : 0.45}
          transparent
          opacity={active ? 0.9 : 0.65}
        />
      </mesh>
    </group>
  );
}

export default function Hotspots({ activePanel, spots }: HotspotsProps) {
  const activeSpots = spots ?? hotspots;

  return (
    <group>
      {activeSpots.map((spot) => {
        const isActive = activePanel === spot.panelKey;
        return (
          <MarquiseMarker
            key={spot.id}
            id={spot.id}
            position={spot.position}
            radius={spot.radius}
            active={isActive}
            color={isActive ? "#f8fafc" : "#cbd5f5"}
            emissive={isActive ? "#e2e8f0" : "#a5b4fc"}
          />
        );
      })}
    </group>
  );
}

export function DetailHotspots({
  activePanel,
  spots,
}: {
  activePanel: PanelKey | null;
  spots: DetailHotspot[];
}) {
  if (!activePanel) return null;
  return (
    <group>
      {spots
        .filter((spot) => spot.panelKey === activePanel)
        .map((spot) => (
          <MarquiseMarker
            key={spot.id}
            id={spot.id}
            position={spot.position}
            radius={spot.radius * 0.9}
            active
            color="#e0f2fe"
            emissive="#7dd3fc"
          />
        ))}
    </group>
  );
}

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import Hotspots from "./Hotspots";
import type { PanelKey } from "./data";

type SceneProps = {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
};

function Laptop() {
  const screenRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!screenRef.current) return;
    const t = state.clock.getElapsedTime();
    screenRef.current.rotation.x = -0.45 + Math.sin(t) * 0.08;
  });

  return (
    <group position={[0.5, 0.42, 0.1]} rotation={[0, -0.6, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.04, 0.4]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <group ref={screenRef} position={[0, 0.02, -0.18]}>
        <mesh castShadow position={[0, 0.22, -0.02]}>
          <boxGeometry args={[0.58, 0.34, 0.03]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
      <mesh position={[0, 0.05, 0.1]}>
        <boxGeometry args={[0.55, 0.02, 0.16]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}

function Room() {
  return (
    <group>
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.2, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh receiveShadow position={[0, 1.4, -2.9]}>
        <boxGeometry args={[6, 2.8, 0.2]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh receiveShadow position={[-2.9, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6, 2.8, 0.2]} />
        <meshStandardMaterial color="#0b1120" />
      </mesh>
      <group position={[-0.4, 0.25, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[2.6, 0.5, 1.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh castShadow position={[0, 0.45, -0.45]}>
          <boxGeometry args={[2.6, 0.9, 0.25]} />
          <meshStandardMaterial color="#172554" />
        </mesh>
        <mesh castShadow position={[-1.25, 0.35, 0]}>
          <boxGeometry args={[0.2, 0.8, 1.1]} />
          <meshStandardMaterial color="#172554" />
        </mesh>
      </group>
    </group>
  );
}

export default function Scene({ activePanel, onSelect }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [2.8, 1.6, 3.2], fov: 45 }}
      className="h-full w-full"
    >
      <color attach="background" args={["#05070f"]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[4, 6, 2]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-3, 4, 2]}
        angle={0.35}
        penumbra={0.4}
        intensity={0.8}
        castShadow
      />
      <Room />
      <Laptop />
      <Hotspots activePanel={activePanel} onSelect={onSelect} />
      <Environment preset="city" />
    </Canvas>
  );
}

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Hotspots from "./Hotspots";
import type { PanelKey } from "./data";

type SceneProps = {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
  reducedMotion?: boolean;
};

type Anchor = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  lookRange: { yaw: number; pitch: number };
};

const anchors: Record<string, Anchor> = {
  couch: {
    position: new THREE.Vector3(-2.0, 1.05, 2.0),
    target: new THREE.Vector3(-0.4, 0.9, 0.2),
    lookRange: { yaw: 0.42, pitch: 0.26 },
  },
  desk: {
    position: new THREE.Vector3(2.05, 1.35, -1.35),
    target: new THREE.Vector3(1.9, 1.0, -2.1),
    lookRange: { yaw: 0.3, pitch: 0.22 },
  },
  wallPhoto: {
    position: new THREE.Vector3(-0.8, 1.45, 1.4),
    target: new THREE.Vector3(-0.8, 1.35, -2.6),
    lookRange: { yaw: 0.24, pitch: 0.18 },
  },
  projects: {
    position: new THREE.Vector3(2.2, 1.45, -0.5),
    target: new THREE.Vector3(2.4, 1.25, -1.7),
    lookRange: { yaw: 0.2, pitch: 0.16 },
  },
};

const panelToAnchor: Record<PanelKey, keyof typeof anchors> = {
  projects: "projects",
  skills: "wallPhoto",
  experience: "desk",
  resume: "desk",
  contact: "couch",
};

function CameraRig({
  activePanel,
  reducedMotion = false,
}: {
  activePanel: PanelKey | null;
  reducedMotion?: boolean;
}) {
  const { camera, pointer } = useThree();
  const anchorName = activePanel ? panelToAnchor[activePanel] : "couch";
  const anchor = anchors[anchorName];
  const baseQuat = useRef(new THREE.Quaternion());
  const targetPosition = useRef(new THREE.Vector3());
  const tempTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    targetPosition.current.copy(anchor.position);
  }, [anchor]);

  useFrame((state, delta) => {
    const damping = reducedMotion ? 1 : 6;
    const moveDelta = reducedMotion ? 1 : Math.min(delta * damping, 1);

    targetPosition.current.copy(anchor.position);
    camera.position.lerp(targetPosition.current, moveDelta);

    const distanceToAnchor = camera.position.distanceTo(anchor.position);
    const allowLook = distanceToAnchor < 0.08;

    tempTarget.current.copy(anchor.target);
    baseQuat.current.setFromRotationMatrix(
      new THREE.Matrix4().lookAt(camera.position, tempTarget.current, camera.up),
    );
    const baseEuler = new THREE.Euler().setFromQuaternion(
      baseQuat.current,
      "YXZ",
    );

    const lookScale = allowLook ? 1 : 0;
    const yaw = pointer.x * anchor.lookRange.yaw * lookScale;
    const pitch = -pointer.y * anchor.lookRange.pitch * lookScale;
    baseEuler.y += yaw;
    baseEuler.x += pitch;
    baseEuler.x = THREE.MathUtils.clamp(
      baseEuler.x,
      -Math.PI / 3,
      Math.PI / 3,
    );
    camera.quaternion.setFromEuler(baseEuler);
    camera.updateProjectionMatrix();
  });

  return null;
}

function Laptop() {
  const screenRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!screenRef.current) return;
    const t = state.clock.getElapsedTime();
    screenRef.current.rotation.x = -0.45 + Math.sin(t) * 0.08;
  });

  return (
    <group position={[-1.65, 0.55, 1.7]} rotation={[0, 0.35, 0]}>
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

function Desk() {
  return (
    <group position={[2.2, 0.6, -2.1]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.1, 0.9]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh castShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[-0.55, 0.45, 0.35]}>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[0.55, 0.45, -0.35]}>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[-0.55, 0.45, -0.35]}>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[0.2, 0.12, 0.2]} rotation={[-0.25, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.35]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh castShadow position={[-0.3, 0.12, -0.2]} rotation={[-0.1, -0.2, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.28]} />
        <meshStandardMaterial color="#0b1120" />
      </mesh>
    </group>
  );
}

function WallPhoto() {
  return (
    <group position={[-0.8, 1.5, -2.75]}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.6, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.75, 0.45]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}

function ProjectsBoard() {
  return (
    <group position={[2.75, 1.4, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#0b1120" />
      </mesh>
      <mesh position={[-0.3, 0.1, 0.04]}>
        <boxGeometry args={[0.3, 0.2, 0.02]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.2, -0.1, 0.04]}>
        <boxGeometry args={[0.35, 0.22, 0.02]} />
        <meshStandardMaterial color="#172554" />
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
      <mesh receiveShadow position={[0, 1.4, 2.9]}>
        <boxGeometry args={[6, 2.8, 0.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh receiveShadow position={[-2.9, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6, 2.8, 0.2]} />
        <meshStandardMaterial color="#0b1120" />
      </mesh>
      <mesh receiveShadow position={[2.9, 1.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[6, 2.8, 0.2]} />
        <meshStandardMaterial color="#0b1120" />
      </mesh>
      <group position={[-2.2, 0.25, 2.1]}>
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

export default function Scene({
  activePanel,
  onSelect,
  reducedMotion,
}: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [-2.0, 1.05, 2.0], fov: 42 }}
      className="h-full w-full"
    >
      <color attach="background" args={["#05070f"]} />
      <CameraRig activePanel={activePanel} reducedMotion={reducedMotion} />
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
      <Desk />
      <WallPhoto />
      <ProjectsBoard />
      <Hotspots activePanel={activePanel} onSelect={onSelect} />
      <Environment preset="city" />
    </Canvas>
  );
}

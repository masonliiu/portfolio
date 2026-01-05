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
    position: new THREE.Vector3(-2.0, 1.15, 1.7),
    target: new THREE.Vector3(-0.4, 0.9, 0.2),
    lookRange: { yaw: 0.55, pitch: 0.32 },
  },
  desk: {
    position: new THREE.Vector3(2.05, 1.35, -1.35),
    target: new THREE.Vector3(1.9, 1.0, -2.1),
    lookRange: { yaw: 0.35, pitch: 0.24 },
  },
  wallPhoto: {
    position: new THREE.Vector3(-0.8, 1.45, 1.4),
    target: new THREE.Vector3(-0.8, 1.35, -2.6),
    lookRange: { yaw: 0.3, pitch: 0.2 },
  },
  projects: {
    position: new THREE.Vector3(1.9, 1.4, -0.8),
    target: new THREE.Vector3(2.3, 1.3, -0.8),
    lookRange: { yaw: 0.3, pitch: 0.2 },
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
  const { camera, gl } = useThree();
  const anchorName = activePanel ? panelToAnchor[activePanel] : "couch";
  const anchor = anchors[anchorName];
  const baseQuat = useRef(new THREE.Quaternion());
  const targetPosition = useRef(new THREE.Vector3());
  const tempTarget = useRef(new THREE.Vector3());
  const lookOffset = useRef({ yaw: 0, pitch: 0 });
  const lookCurrent = useRef({ yaw: 0, pitch: 0 });
  const isLocked = useRef(false);

  useEffect(() => {
    targetPosition.current.copy(anchor.position);
  }, [anchor]);

  useEffect(() => {
    lookOffset.current = { yaw: 0, pitch: 0 };
    lookCurrent.current = { yaw: 0, pitch: 0 };
  }, [anchorName]);

  useEffect(() => {
    const handlePointerLock = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
      if (!isLocked.current) {
        lookOffset.current = { yaw: 0, pitch: 0 };
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isLocked.current) return;
      const sensitivity = reducedMotion ? 0.0012 : 0.0016;
      lookOffset.current.yaw += event.movementX * sensitivity;
      lookOffset.current.pitch += event.movementY * sensitivity;
    };

    const handlePointerDown = () => {
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLock);
    document.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLock);
      document.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [gl, reducedMotion]);

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

    const lookScale = allowLook && isLocked.current ? 1 : 0;
    const targetYaw = THREE.MathUtils.clamp(
      lookOffset.current.yaw,
      -anchor.lookRange.yaw,
      anchor.lookRange.yaw,
    );
    const targetPitch = THREE.MathUtils.clamp(
      lookOffset.current.pitch,
      -anchor.lookRange.pitch,
      anchor.lookRange.pitch,
    );
    const lookDamping = reducedMotion ? 1 : 10;
    lookCurrent.current.yaw = THREE.MathUtils.damp(
      lookCurrent.current.yaw,
      targetYaw * lookScale,
      lookDamping,
      delta,
    );
    lookCurrent.current.pitch = THREE.MathUtils.damp(
      lookCurrent.current.pitch,
      targetPitch * lookScale,
      lookDamping,
      delta,
    );
    baseEuler.y += lookCurrent.current.yaw;
    baseEuler.x += lookCurrent.current.pitch;
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
    <group position={[-1.6, 0.55, 1.35]} rotation={[0, 0.35, 0]}>
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
    <group position={[2.2, 0.75, -2.1]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.1, 0.9]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh castShadow position={[0.5, -0.4, 0.35]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[-0.5, -0.4, 0.35]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[0.5, -0.4, -0.35]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[-0.5, -0.4, -0.35]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[0.2, 0.08, 0.2]} rotation={[-0.25, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.35]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh castShadow position={[-0.3, 0.08, -0.2]} rotation={[-0.1, -0.2, 0]}>
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

function WindowLight() {
  const slats = Array.from({ length: 6 }, (_, index) => index);

  return (
    <group position={[2.75, 1.5, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[1.1, 0.75, 0.06]} />
        <meshStandardMaterial color="#0b1120" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.95, 0.6]} />
        <meshStandardMaterial emissive="#8db4ff" color="#1e293b" />
      </mesh>
      {slats.map((index) => (
        <mesh key={index} position={[0, 0.22 - index * 0.09, 0.05]}>
          <boxGeometry args={[0.9, 0.03, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
      <mesh position={[0, 0.42, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1.1, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <rectAreaLight
        position={[0, 0, 0.2]}
        rotation={[0, 0, 0]}
        width={0.9}
        height={0.55}
        intensity={4.5}
        color="#a7c5ff"
      />
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
      <group position={[-2.5, 0.25, 2.45]}>
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
      camera={{ position: [-2.0, 1.15, 1.7], fov: 42 }}
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
      <WindowLight />
      <Hotspots activePanel={activePanel} onSelect={onSelect} />
      <Environment preset="city" />
    </Canvas>
  );
}

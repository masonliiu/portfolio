"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Hotspots from "./Hotspots";
import { hotspots, type PanelKey } from "./data";

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
    position: new THREE.Vector3(-1.65, 1.18, 1.6),
    target: new THREE.Vector3(-0.4, 0.95, 0.1),
    lookRange: { yaw: 0.7, pitch: 0.3 },
  },
  desk: {
    position: new THREE.Vector3(1.5, 1.25, -1.2),
    target: new THREE.Vector3(1.3, 1.0, -1.8),
    lookRange: { yaw: 0.4, pitch: 0.24 },
  },
  wallPhoto: {
    position: new THREE.Vector3(-0.6, 1.4, 1.1),
    target: new THREE.Vector3(-0.6, 1.3, -2.0),
    lookRange: { yaw: 0.35, pitch: 0.22 },
  },
  projects: {
    position: new THREE.Vector3(1.6, 1.3, -0.6),
    target: new THREE.Vector3(1.9, 1.2, -0.6),
    lookRange: { yaw: 0.4, pitch: 0.24 },
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
  onSelect,
  reducedMotion = false,
}: {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
  reducedMotion?: boolean;
}) {
  const { camera, gl } = useThree();
  const anchorName = activePanel ? panelToAnchor[activePanel] : "couch";
  const anchor = anchors[anchorName];
  const baseQuat = useRef(new THREE.Quaternion());
  const targetPosition = useRef(new THREE.Vector3());
  const tempTarget = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const lookTarget = useRef({ yaw: 0, pitch: 0 });
  const lookOffset = useRef({ yaw: 0, pitch: 0 });
  const lookCurrent = useRef({ yaw: 0, pitch: 0 });
  const lookLimits = useRef(anchor.lookRange);
  const isLocked = useRef(false);

  useEffect(() => {
    targetPosition.current.copy(anchor.position);
  }, [anchor]);

  useEffect(() => {
    lookTarget.current = { yaw: 0, pitch: 0 };
    lookOffset.current = { yaw: 0, pitch: 0 };
    lookCurrent.current = { yaw: 0, pitch: 0 };
    lookLimits.current = anchor.lookRange;
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
      const sensitivity = reducedMotion ? 0.0007 : 0.0008;
      lookTarget.current.yaw -= event.movementX * sensitivity;
      lookTarget.current.pitch -= event.movementY * sensitivity;
      lookTarget.current.yaw = THREE.MathUtils.clamp(
        lookTarget.current.yaw,
        -lookLimits.current.yaw,
        lookLimits.current.yaw,
      );
      lookTarget.current.pitch = THREE.MathUtils.clamp(
        lookTarget.current.pitch,
        -lookLimits.current.pitch,
        lookLimits.current.pitch,
      );
    };

    const handlePointerDown = () => {
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    };

    const handleClick = () => {
      if (!isLocked.current) return;
      raycaster.current.setFromCamera({ x: 0, y: 0 }, camera);
      let closest: { panelKey: PanelKey; distance: number } | null = null;
      hotspots.forEach((spot) => {
        const spotPosition = new THREE.Vector3(...spot.position);
        const toSpot = spotPosition.clone().sub(raycaster.current.ray.origin);
        if (raycaster.current.ray.direction.dot(toSpot) <= 0) {
          return;
        }
        const distance = raycaster.current.ray.distanceToPoint(spotPosition);
        if (distance <= spot.radius) {
          const originDistance =
            raycaster.current.ray.origin.distanceTo(spotPosition);
          if (!closest || originDistance < closest.distance) {
            closest = { panelKey: spot.panelKey, distance: originDistance };
          }
        }
      });
      if (closest) {
        onSelect(closest.panelKey);
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLock);
    document.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("pointerdown", handlePointerDown);
    gl.domElement.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLock);
      document.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("pointerdown", handlePointerDown);
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [camera, gl, onSelect, reducedMotion]);

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
    const offsetDamping = reducedMotion ? 1 : 6;
    lookOffset.current.yaw = THREE.MathUtils.damp(
      lookOffset.current.yaw,
      lookTarget.current.yaw,
      offsetDamping,
      delta,
    );
    lookOffset.current.pitch = THREE.MathUtils.damp(
      lookOffset.current.pitch,
      lookTarget.current.pitch,
      offsetDamping,
      delta,
    );
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
    const lookDamping = reducedMotion ? 1 : 6;
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
    <group position={[1.55, 0.7, -1.55]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.1, 0.9]} />
        <meshStandardMaterial color="#6f5230" />
      </mesh>
      <mesh castShadow position={[0.5, -0.4, 0.35]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#3f2e1b" />
      </mesh>
      <mesh castShadow position={[-0.5, -0.4, 0.35]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#3f2e1b" />
      </mesh>
      <mesh castShadow position={[0.5, -0.4, -0.35]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#3f2e1b" />
      </mesh>
      <mesh castShadow position={[-0.5, -0.4, -0.35]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#3f2e1b" />
      </mesh>
      <mesh castShadow position={[0.2, 0.08, 0.2]} rotation={[-0.25, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.35]} />
        <meshStandardMaterial color="#2f3b52" />
      </mesh>
      <mesh castShadow position={[-0.3, 0.08, -0.2]} rotation={[-0.1, -0.2, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.28]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

function WallPhoto() {
  return (
    <group position={[-0.6, 1.4, -2.05]}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.6, 0.05]} />
        <meshStandardMaterial color="#2f3b52" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.75, 0.45]} />
        <meshStandardMaterial color="#a7b6cc" />
      </mesh>
    </group>
  );
}

function WindowLight() {
  const slats = Array.from({ length: 6 }, (_, index) => index);

  return (
    <group position={[2.12, 1.35, -0.4]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[1.0, 0.7, 0.06]} />
        <meshStandardMaterial color="#2a3a4f" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.86, 0.55]} />
        <meshStandardMaterial emissive="#bcd6ff" color="#c5d4ea" />
      </mesh>
      {slats.map((index) => (
        <mesh key={index} position={[0, 0.22 - index * 0.09, 0.05]}>
          <boxGeometry args={[0.84, 0.03, 0.02]} />
          <meshStandardMaterial color="#d8e2f0" />
        </mesh>
      ))}
      <mesh position={[0, 0.42, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 16]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <rectAreaLight
        position={[0, 0, 0.2]}
        rotation={[0, 0, 0]}
        width={0.8}
        height={0.5}
        intensity={5.5}
        color="#cfe3ff"
      />
    </group>
  );
}

function Bed() {
  return (
    <group position={[1.5, 0.32, 1.84]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.22, 0.8]} />
        <meshStandardMaterial color="#356fa3" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.3, 0.12, 0.7]} />
        <meshStandardMaterial color="#4b8ec0" />
      </mesh>
      <mesh position={[0, 0.3, -0.22]}>
        <boxGeometry args={[1.2, 0.12, 0.28]} />
        <meshStandardMaterial color="#7fb0d9" />
      </mesh>
      <mesh position={[0.45, 0.33, -0.2]}>
        <boxGeometry args={[0.35, 0.1, 0.26]} />
        <meshStandardMaterial color="#a8c8e6" />
      </mesh>
      <mesh position={[-0.45, 0.33, -0.2]}>
        <boxGeometry args={[0.35, 0.1, 0.26]} />
        <meshStandardMaterial color="#a8c8e6" />
      </mesh>
      <mesh position={[0, 0.45, 0.36]}>
        <boxGeometry args={[1.4, 0.5, 0.08]} />
        <meshStandardMaterial color="#2a3d55" />
      </mesh>
    </group>
  );
}

function RoomDetails() {
  return (
    <group>
      <mesh receiveShadow position={[-0.1, 0.01, 0.3]}>
        <boxGeometry args={[2.2, 0.02, 1.4]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[0.1, 0.03, 0.1]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color="#9aa4b2" />
      </mesh>
      <mesh position={[1.4, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh position={[1.4, 0.88, 0.5]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[1.4, 1.05, 0.5]}>
        <coneGeometry args={[0.2, 0.3, 24]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef9c3" />
      </mesh>
      <pointLight position={[1.4, 1.15, 0.5]} intensity={0.6} color="#fef3c7" />
      <mesh position={[2.0, 0.2, -0.1]}>
        <cylinderGeometry args={[0.12, 0.14, 0.25, 18]} />
        <meshStandardMaterial color="#3f5d4c" />
      </mesh>
      <mesh position={[2.0, 0.4, -0.1]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color="#79b28c" />
      </mesh>
      <group position={[-2.05, 1.15, -1.1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.12, 0.25]} />
          <meshStandardMaterial color="#5b6b7f" />
        </mesh>
        <mesh position={[-0.22, 0.14, 0]}>
          <boxGeometry args={[0.18, 0.22, 0.2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.05, 0.14, 0]}>
          <boxGeometry args={[0.18, 0.26, 0.2]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.32, 0.14, 0]}>
          <boxGeometry args={[0.18, 0.18, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>
    </group>
  );
}

function Room() {
  return (
    <group>
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[4.6, 0.18, 4.6]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh receiveShadow position={[0, 1.3, -2.2]}>
        <boxGeometry args={[4.6, 2.6, 0.2]} />
        <meshStandardMaterial color="#c0c6d4" />
      </mesh>
      <mesh receiveShadow position={[0, 1.3, 2.2]}>
        <boxGeometry args={[4.6, 2.6, 0.2]} />
        <meshStandardMaterial color="#b4bccd" />
      </mesh>
      <mesh receiveShadow position={[-2.2, 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4.6, 2.6, 0.2]} />
        <meshStandardMaterial color="#c5ccd9" />
      </mesh>
      <mesh receiveShadow position={[2.2, 1.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[4.6, 2.6, 0.2]} />
        <meshStandardMaterial color="#c5ccd9" />
      </mesh>
      <group position={[-1.6, 0.22, 1.8]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.1, 0.4, 0.85]} />
          <meshStandardMaterial color="#3a75b0" />
        </mesh>
        <mesh castShadow position={[0, 0.32, -0.35]}>
          <boxGeometry args={[2.1, 0.45, 0.18]} />
          <meshStandardMaterial color="#2b5d8f" />
        </mesh>
        <mesh castShadow position={[-0.95, 0.2, 0]}>
          <boxGeometry args={[0.14, 0.38, 0.85]} />
          <meshStandardMaterial color="#2b5d8f" />
        </mesh>
      </group>
      <group position={[-2.2, 0.9, 1.1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[0.9, 1.6, 0.06]} />
          <meshStandardMaterial color="#e5e7eb" />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.95, 1.65, 0.02]} />
          <meshStandardMaterial color="#9aa4b2" />
        </mesh>
        <mesh position={[0.35, 0, 0.06]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#d1bfa7" />
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
      camera={{ position: [-1.65, 1.18, 1.6], fov: 42 }}
      className="h-full w-full"
    >
      <color attach="background" args={["#121826"]} />
      <CameraRig
        activePanel={activePanel}
        onSelect={onSelect}
        reducedMotion={reducedMotion}
      />
      <ambientLight intensity={0.8} color="#cbd5e1" />
      <directionalLight
        position={[4, 6, 2]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-3, 4, 2]}
        angle={0.35}
        penumbra={0.4}
        intensity={0.55}
        castShadow
      />
      <Room />
      <Laptop />
      <Desk />
      <WallPhoto />
      <WindowLight />
      <Bed />
      <RoomDetails />
      <Hotspots activePanel={activePanel} onSelect={onSelect} />
      <Environment preset="city" />
    </Canvas>
  );
}

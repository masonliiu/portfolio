"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
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
    lookRange: { yaw: 0.9, pitch: 0.45 },
  },
  desk: {
    position: new THREE.Vector3(1.5, 1.25, -1.2),
    target: new THREE.Vector3(1.3, 1.0, -1.8),
    lookRange: { yaw: 0.6, pitch: 0.35 },
  },
  wallPhoto: {
    position: new THREE.Vector3(-0.6, 1.4, 1.1),
    target: new THREE.Vector3(-0.6, 1.3, -2.0),
    lookRange: { yaw: 0.55, pitch: 0.32 },
  },
  projects: {
    position: new THREE.Vector3(1.6, 1.3, -0.6),
    target: new THREE.Vector3(1.9, 1.2, -0.6),
    lookRange: { yaw: 0.6, pitch: 0.35 },
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

function RoomModel() {
  const { scene } = useGLTF("/models/FinalSceneLightingFix.glb");
  return <primitive object={scene} />;
}

useGLTF.preload("/models/FinalSceneLightingFix.glb");

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
      <color attach="background" args={["#cfc6bb"]} />
      <fog attach="fog" args={["#d7cec2", 4.5, 10]} />
      <CameraRig
        activePanel={activePanel}
        onSelect={onSelect}
        reducedMotion={reducedMotion}
      />
      <ambientLight intensity={0.7} color="#f1e3d2" />
      <directionalLight position={[4, 6, 2]} intensity={0.9} castShadow />
      <Suspense fallback={null}>
        <RoomModel />
      </Suspense>
      <Hotspots activePanel={activePanel} onSelect={onSelect} />
      <Environment preset="city" />
    </Canvas>
  );
}

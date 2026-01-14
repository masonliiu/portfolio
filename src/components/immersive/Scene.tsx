"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import * as THREE from "three";
import { MarquiseMarker } from "./Hotspots";
import {
  aboutMeParagraphs,
  detailHotspots,
  hotspots,
  type DetailHotspot,
  type DetailKey,
  type Hotspot,
  type PanelKey,
} from "./data";
import { projects } from "@/lib/projects";

type SceneProps = {
  activePanel: PanelKey | null;
  activeDetail?: DetailKey | null;
  onSelect: (panel: PanelKey) => void;
  onSelectDetail?: (detail: DetailKey) => void;
  onReturnToCouch?: () => void;
  forceLook?: boolean;
  paintingRevealed?: boolean;
  reducedMotion?: boolean;
  transitionImage?: string | null;
  transitionActive?: boolean;
  exitTransitionActive?: boolean;
  onTransitionEnd?: () => void;
  onTransitionStart?: () => void;
  onTransitionAnimating?: (isAnimating: boolean) => void;
  onExitTransitionEnd?: () => void;
  onPanelHitMapReady?: () => void;
  onDebugHitName?: (value: string | null) => void;
  glowActive?: Record<string, boolean>;
  onSceneReady?: () => void;
};

type Anchor = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  lookRange: { yaw: number; pitch: number };
};

type AnchorMap = Record<string, Anchor>;
type IndicatorSpot = {
  id: string;
  panelKey: PanelKey;
  position: [number, number, number];
  radius: number;
};
type ObjectLabel = {
  id: string;
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  fontSize: number;
  maxWidth: number;
  anchorX?: "center" | "left" | "right";
  anchorY?: "top" | "middle" | "bottom";
  followNormal?: boolean;
};

const defaultAnchors: AnchorMap = {
  couch: {
    position: new THREE.Vector3(-1.6, 1.05, 1.35),
    target: new THREE.Vector3(-0.85, 0.6, 0.55),
    lookRange: { yaw: 1.45, pitch: 0.85 },
  },
  deskPapers: {
    position: new THREE.Vector3(1.45, 1.35, -1.15),
    target: new THREE.Vector3(1.45, 0.95, -1.6),
    lookRange: { yaw: 0.35, pitch: 0.35 },
  },
  table: {
    position: new THREE.Vector3(-0.1, 1.05, 0.6),
    target: new THREE.Vector3(-0.2, 0.65, 0.3),
    lookRange: { yaw: 0.5, pitch: 0.4 },
  },
  painting: {
    position: new THREE.Vector3(-0.6, 1.45, -1.25),
    target: new THREE.Vector3(-0.6, 1.35, -2.2),
    lookRange: { yaw: 0.45, pitch: 0.3 },
  },
  shelf: {
    position: new THREE.Vector3(1.8, 1.4, -0.2),
    target: new THREE.Vector3(1.75, 1.2, -0.8),
    lookRange: { yaw: 0.5, pitch: 0.35 },
  },
};

const panelToAnchor: Record<PanelKey, keyof typeof defaultAnchors> = {
  desk: "deskPapers",
  table: "table",
  painting: "painting",
  shelf: "shelf",
};

const panelObjectNameOverrides: Record<PanelKey, string[]> = {
  desk: ["Table", "Monitor", "Monitor_Stand", "Display"],
  table: ["Plane", "Vert002_1", "Vert002_2", "Book0002_1", "Book0002_2"],
  painting: ["abstract-expressionism-abstract-painting-acrylic-paint-1585325"],
  shelf: [
    "Shelves",
    "Book0",
    "Book0.001",
    "Book0.002",
    "Book0.003",
    "Book0.004",
    "Book0.005",
    "Book0.006",
    "Book0.007",
    "Book0.008",
    "Book0.009",
    "Book0.010",
    "Book0.011",
    "Book0.012",
    "Book0.013",
    "Book0.014",
    "Book0.015",
    "Book0.016",
    "Book0.017",
  ],
};

const detailObjectNameOverrides = {
  resume: ["Resume_Paper"],
  experience: ["Experience_Paper"],
  photography: ["Notebook"],
  "project-one": ["Book0"],
  "project-two": ["Book0.001"],
  "project-three": ["Book0.002"],
} as const;

const panelSpotOffsets: Record<
  PanelKey,
  { forward: number; up: number; side: number }
> = {
  desk: { forward: 0.2, up: 0.35, side: 0.1 },
  table: { forward: 0.15, up: 0.35, side: 0.0 },
  painting: { forward: 0.6, up: 0.0, side: 0.0 },
  shelf: { forward: 0.25, up: 0.3, side: 0.0 },
};

type PanelHitMap = WeakMap<THREE.Object3D, PanelKey>;
type GlowTarget = {
  id: string;
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  scale: [number, number, number];
  groupKey: string;
};

function findObjectByNameList(scene: THREE.Object3D, names: readonly string[]) {
  const matches = findObjectsByNameList(scene, names);
  return matches[0] ?? null;
}

function findObjectsByNameList(
  scene: THREE.Object3D,
  names: readonly string[],
) {
  const lowered = names.map((name) => name.toLowerCase());
  const matches: THREE.Object3D[] = [];
  scene.traverse((obj) => {
    const name = (obj.name || "").toLowerCase();
    if (!name) return;
    if (lowered.some((needle) => name === needle)) {
      matches.push(obj);
    }
  });
  return matches;
}

function placeSpotOnObject(
  obj: THREE.Object3D,
  roomCenter: THREE.Vector3 | null,
  offsets: { forward: number; up: number; side: number },
) {
  const box = new THREE.Box3().setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const forwardDir = roomCenter
    ? roomCenter.clone().sub(center).normalize()
    : new THREE.Vector3(0, 0, 1)
        .applyQuaternion(obj.getWorldQuaternion(new THREE.Quaternion()))
        .normalize();
  const upDir = new THREE.Vector3(0, 1, 0);
  const rightDir = new THREE.Vector3()
    .crossVectors(forwardDir, upDir)
    .normalize();

  return center
    .clone()
    .add(forwardDir.clone().multiplyScalar(size.z * offsets.forward))
    .add(rightDir.clone().multiplyScalar(size.x * offsets.side))
    .add(upDir.clone().multiplyScalar(size.y * offsets.up));
}

function findPanelFromObject(
  object: THREE.Object3D | null,
  hitMap: PanelHitMap | null,
): PanelKey | null {
  if (!hitMap) return null;
  let current: THREE.Object3D | null = object;
  while (current) {
    const panel = hitMap.get(current);
    if (panel) return panel;
    current = current.parent ?? null;
  }
  // Fallback: try matching object names against panel overrides.
  current = object;
  while (current) {
    const name = (current.name || "").toLowerCase();
    if (name) {
      const panelMatch = (Object.keys(panelObjectNameOverrides) as PanelKey[]).find(
        (panel) =>
          panelObjectNameOverrides[panel].some(
            (needle) => name === needle.toLowerCase(),
          ),
      );
      if (panelMatch) return panelMatch;
    }
    current = current.parent ?? null;
  }
  return null;
}

function CameraRig({
  activePanel,
  onSelect,
  onReturnToCouch,
  anchors,
  reducedMotion = false,
  inputLocked = false,
  forceLook = false,
  onSettled,
  settleReset = 0,
  transitionPitch = 0,
  spots = hotspots,
  detailSpots = detailHotspots,
  indicatorSpots = [],
  detailHitMap,
  onSelectDetail,
  panelHitMap,
  onDebugHitName,
}: {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
  onReturnToCouch?: () => void;
  anchors: AnchorMap;
  reducedMotion?: boolean;
  inputLocked?: boolean;
  forceLook?: boolean;
  onSettled?: () => void;
  settleReset?: number;
  transitionPitch?: number;
  spots?: Hotspot[];
  detailSpots?: DetailHotspot[];
  indicatorSpots?: IndicatorSpot[];
  detailHitMap?: WeakMap<THREE.Object3D, DetailKey>;
  onSelectDetail?: (detail: DetailKey) => void;
  panelHitMap?: PanelHitMap;
  onDebugHitName?: (value: string | null) => void;
}) {
  const { camera, gl, scene } = useThree();
  const anchorName = activePanel ? panelToAnchor[activePanel] : "couch";
  const anchor = anchors[anchorName];
  const baseQuat = useRef(new THREE.Quaternion());
  const targetPosition = useRef(new THREE.Vector3());
  const tempTarget = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const mouseNdc = useRef(new THREE.Vector2(0, 0));
  const lookTarget = useRef({ yaw: 0, pitch: 0 });
  const lookOffset = useRef({ yaw: 0, pitch: 0 });
  const lookCurrent = useRef({ yaw: 0, pitch: 0 });
  const lookLimits = useRef(anchor.lookRange);
  const isLocked = useRef(false);
  const settledRef = useRef(false);

  useEffect(() => {
    settledRef.current = false;
  }, [settleReset]);

  useEffect(() => {
    targetPosition.current.copy(anchor.position);
  }, [anchor]);

  useEffect(() => {
    lookTarget.current = { yaw: 0, pitch: 0 };
    lookOffset.current = { yaw: 0, pitch: 0 };
    lookCurrent.current = { yaw: 0, pitch: 0 };
    lookLimits.current = anchor.lookRange;
  }, [anchor.lookRange, anchorName]);

  useEffect(() => {
    const handlePointerLock = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
      window.dispatchEvent(
        new CustomEvent("immersive:pointer-lock", {
          detail: { locked: isLocked.current },
        }),
      );
      if (!isLocked.current) {
        lookOffset.current = { yaw: 0, pitch: 0 };
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      if (inputLocked) {
        mouseNdc.current.set(x, y);
        return;
      }
      if (!isLocked.current && forceLook) {
        mouseNdc.current.set(x, y);
        lookTarget.current.yaw = -mouseNdc.current.x * lookLimits.current.yaw;
        lookTarget.current.pitch =
          -mouseNdc.current.y * lookLimits.current.pitch;
        return;
      }
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
      if (inputLocked) return;
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    };

    const handleClick = () => {
      const rayPoint = inputLocked ? mouseNdc.current : new THREE.Vector2(0, 0);
      raycaster.current.setFromCamera(rayPoint, camera);
      const intersections = raycaster.current.intersectObjects(
        scene.children,
        true,
      );
      if (activePanel) {
        if (detailHitMap) {
          for (const hit of intersections) {
            const detailKey = detailHitMap.get(hit.object);
            if (!detailKey) continue;
            const panelMatch = detailSpots.find(
              (spot) => spot.detailKey === detailKey,
            )?.panelKey;
            if (panelMatch && panelMatch === activePanel) {
              document.exitPointerLock?.();
              onSelectDetail?.(detailKey);
              return;
            }
          }
        }
        if (panelHitMap) {
          for (const hit of intersections) {
            const panel = findPanelFromObject(hit.object, panelHitMap ?? null);
            if (panel && panel === activePanel) {
              document.exitPointerLock?.();
              onSelect(panel);
              return;
            }
          }
        }
        onReturnToCouch?.();
        return;
      }
      if (panelHitMap) {
        for (const hit of intersections) {
          const panel = findPanelFromObject(hit.object, panelHitMap ?? null);
          if (panel) {
            document.exitPointerLock?.();
            onSelect(panel);
            return;
          }
        }
      }

      let closestDetail: { key: DetailKey; distance: number } | null = null;
      if (activePanel) {
        detailSpots.forEach((spot) => {
          if (spot.panelKey !== activePanel) return;
          const spotPosition = new THREE.Vector3(...spot.position);
          const toSpot = spotPosition.clone().sub(raycaster.current.ray.origin);
          if (raycaster.current.ray.direction.dot(toSpot) <= 0) {
            return;
          }
          const distance = raycaster.current.ray.distanceToPoint(spotPosition);
          if (distance <= spot.radius) {
            const originDistance =
              raycaster.current.ray.origin.distanceTo(spotPosition);
            if (!closestDetail || originDistance < closestDetail.distance) {
              closestDetail = { key: spot.detailKey, distance: originDistance };
            }
          }
        });
      }
      if (closestDetail) {
        document.exitPointerLock?.();
        onSelectDetail?.(
          (closestDetail as { key: DetailKey }).key,
        );
        return;
      }

      let closestIndicator: { panelKey: PanelKey; distance: number } | null =
        null;
      indicatorSpots.forEach((spot) => {
        const spotPosition = new THREE.Vector3(...spot.position);
        const toSpot = spotPosition.clone().sub(raycaster.current.ray.origin);
        if (raycaster.current.ray.direction.dot(toSpot) <= 0) {
          return;
        }
        const distance = raycaster.current.ray.distanceToPoint(spotPosition);
        if (distance <= spot.radius) {
          const originDistance =
            raycaster.current.ray.origin.distanceTo(spotPosition);
          if (!closestIndicator || originDistance < closestIndicator.distance) {
            closestIndicator = {
              panelKey: spot.panelKey,
              distance: originDistance,
            };
          }
        }
      });
      if (closestIndicator) {
        document.exitPointerLock?.();
        onSelect(
          (closestIndicator as { panelKey: PanelKey }).panelKey,
        );
        return;
      }

      if (!panelHitMap) {
        let closest: { panelKey: PanelKey; distance: number } | null = null;
        spots.forEach((spot) => {
          const spotPosition = new THREE.Vector3(...spot.position);
          const toSpot = spotPosition
            .clone()
            .sub(raycaster.current.ray.origin);
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
          document.exitPointerLock?.();
          onSelect(
            (closest as { panelKey: PanelKey }).panelKey,
          );
        }
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
  }, [
    activePanel,
    camera,
    detailHitMap,
    detailSpots,
    forceLook,
    gl,
    indicatorSpots,
    inputLocked,
    onReturnToCouch,
    onSelect,
    onSelectDetail,
    panelHitMap,
    reducedMotion,
    scene.children,
    spots,
  ]);

  useEffect(() => {
    const requestLock = () => {
      if (gl.domElement.requestPointerLock) {
        gl.domElement.requestPointerLock();
      }
    };
    const releaseLock = () => {
      document.exitPointerLock?.();
    };
    window.addEventListener("immersive:request-pointer-lock", requestLock);
    window.addEventListener("immersive:release-pointer-lock", releaseLock);
    return () => {
      window.removeEventListener("immersive:request-pointer-lock", requestLock);
      window.removeEventListener("immersive:release-pointer-lock", releaseLock);
    };
  }, [gl]);

  useEffect(() => {
    if (inputLocked) {
      document.exitPointerLock?.();
    }
  }, [inputLocked]);

  const lastDebugName = useRef<string | null>(null);

  useFrame((state, delta) => {
    const damping = reducedMotion ? 1 : 6;
    const moveDelta = reducedMotion ? 1 : Math.min(delta * damping, 1);

    targetPosition.current.copy(anchor.position);
    camera.position.lerp(targetPosition.current, moveDelta);

    if (onDebugHitName) {
      raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
      const intersections = raycaster.current.intersectObjects(
        scene.children,
        true,
      );
      const hit = intersections[0];
      const panel = hit
        ? findPanelFromObject(hit.object, panelHitMap ?? null)
        : null;
      const nextName = hit
        ? `${hit.object.name || "(unnamed)"}${panel ? ` · ${panel}` : ""}`
        : null;
      if (nextName !== lastDebugName.current) {
        lastDebugName.current = nextName;
        onDebugHitName(nextName);
      }
    }

    const distanceToAnchor = camera.position.distanceTo(anchor.position);
    const allowLook = distanceToAnchor < 0.08;
    if (!settledRef.current && distanceToAnchor < 0.04) {
      settledRef.current = true;
      onSettled?.();
    }

    tempTarget.current.copy(anchor.target);
    baseQuat.current.setFromRotationMatrix(
      new THREE.Matrix4().lookAt(camera.position, tempTarget.current, camera.up),
    );
    const baseEuler = new THREE.Euler().setFromQuaternion(
      baseQuat.current,
      "YXZ",
    );

    const lookScale = allowLook && (isLocked.current || forceLook) ? 1 : 0;
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
    baseEuler.x += lookCurrent.current.pitch + transitionPitch;
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

type RoomModelProps = {
  onAnchors: (anchors: AnchorMap) => void;
  onHotspots: (spots: Hotspot[]) => void;
  onDetailHotspots: (spots: DetailHotspot[]) => void;
  onGlowTargets: (targets: GlowTarget[]) => void;
  onLabels: (labels: ObjectLabel[]) => void;
  onPaintingRef: (object: THREE.Object3D | null) => void;
  onPanelHitMap: (map: PanelHitMap) => void;
  onDetailHitMap: (map: WeakMap<THREE.Object3D, DetailKey>) => void;
  onPanelHitMapReady: () => void;
  onReady?: () => void;
};

type LaptopProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  screenRef: RefObject<THREE.Mesh | null>;
  screenTexture?: THREE.Texture | null;
  screenUnlit?: boolean;
};

type LaptopScreenTransitionProps = {
  screenRef: RefObject<THREE.Mesh | null>;
  texture: THREE.Texture;
  onDone?: () => void;
  onActive?: (isActive: boolean) => void;
  onProgress?: (progress: number) => void;
};

type LaptopScreenExitTransitionProps = {
  screenRef: RefObject<THREE.Mesh | null>;
  texture: THREE.Texture;
  onDone?: () => void;
  onActive?: (isActive: boolean) => void;
};

function PaintingReveal({
  paintingRef,
  baseQuatRef,
  revealed,
  rotationAxis,
}: {
  paintingRef: RefObject<THREE.Object3D | null>;
  baseQuatRef: RefObject<THREE.Quaternion>;
  revealed: boolean;
  rotationAxis: RefObject<THREE.Vector3>;
}) {
  useFrame((_, delta) => {
    const painting = paintingRef.current;
    if (!painting) return;
    const baseQuat = baseQuatRef.current;
    const targetQuat = new THREE.Quaternion().copy(baseQuat);
    if (revealed) {
      const axisLocal = rotationAxis.current;
      const revealQuat = new THREE.Quaternion().setFromAxisAngle(
        axisLocal,
        -1.05,
      );
      targetQuat.copy(baseQuat).multiply(revealQuat);
    }
    painting.quaternion.slerp(targetQuat, Math.min(delta * 3, 1));
  });

  return null;
}

function LaptopScreenTransition({
  screenRef,
  texture,
  onDone,
  onActive,
  onProgress,
}: LaptopScreenTransitionProps) {
  const overlayRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const elapsed = useRef(0);
  const done = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const startQuat = useRef(new THREE.Quaternion());
  const endQuat = useRef(new THREE.Quaternion());
  const startScale = useRef(new THREE.Vector3());
  const endScale = useRef(new THREE.Vector3());
  const tempDirection = useRef(new THREE.Vector3());
  const tempScale = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!overlayRef.current || !screenRef.current || done.current) return;

    onActive?.(true);
    elapsed.current += delta;
    const hold = 1;
    const duration = 2.0;
    const t = Math.min(Math.max((elapsed.current - hold) / duration, 0), 1);
    const ease = t * t * (3 - 2 * t);
    onProgress?.(ease);

    const vFov = THREE.MathUtils.degToRad(
      (camera as THREE.PerspectiveCamera).fov,
    );
    const distance = 0.28;
    const height = 2 * Math.tan(vFov / 2) * distance;
    const width = height * (size.width / size.height);

    camera.getWorldDirection(tempDirection.current);
    startPos.current
      .copy(camera.position)
      .add(tempDirection.current.multiplyScalar(distance));
    startQuat.current.copy(camera.quaternion);
    startScale.current.set(width, height, 1);

    screenRef.current.getWorldPosition(endPos.current);
    screenRef.current.getWorldQuaternion(endQuat.current);
    screenRef.current.getWorldScale(tempScale.current);

    const geometry = screenRef.current.geometry as THREE.PlaneGeometry;
    const screenWidth = geometry.parameters.width * tempScale.current.x;
    const screenHeight = geometry.parameters.height * tempScale.current.y;
    endScale.current.set(screenWidth, screenHeight, 1);

    overlayRef.current.position.lerpVectors(startPos.current, endPos.current, ease);
    overlayRef.current.quaternion.slerpQuaternions(
      startQuat.current,
      endQuat.current,
      ease,
    );
    overlayRef.current.scale.lerpVectors(startScale.current, endScale.current, ease);

    const material = overlayRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 1;

    if (t >= 1 && !done.current) {
      done.current = true;
      onActive?.(false);
      onDone?.();
    }
  });

  return (
    <mesh ref={overlayRef} renderOrder={10}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        transparent
        opacity={1}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function LaptopScreenExitTransition({
  screenRef,
  texture,
  onDone,
  onActive,
}: LaptopScreenExitTransitionProps) {
  const overlayRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const elapsed = useRef(0);
  const done = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const startQuat = useRef(new THREE.Quaternion());
  const endQuat = useRef(new THREE.Quaternion());
  const startScale = useRef(new THREE.Vector3());
  const endScale = useRef(new THREE.Vector3());
  const tempDirection = useRef(new THREE.Vector3());
  const tempScale = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!overlayRef.current || !screenRef.current || done.current) return;

    onActive?.(true);
    elapsed.current += delta;
    const duration = 1.6;
    const t = Math.min(Math.max(elapsed.current / duration, 0), 1);
    const ease = t * t * (3 - 2 * t);

    screenRef.current.getWorldPosition(startPos.current);
    screenRef.current.getWorldQuaternion(startQuat.current);
    screenRef.current.getWorldScale(tempScale.current);

    const geometry = screenRef.current.geometry as THREE.PlaneGeometry;
    const screenWidth = geometry.parameters.width * tempScale.current.x;
    const screenHeight = geometry.parameters.height * tempScale.current.y;
    startScale.current.set(screenWidth, screenHeight, 1);

    const vFov = THREE.MathUtils.degToRad(
      (camera as THREE.PerspectiveCamera).fov,
    );
    const distance = 0.28;
    const height = 2 * Math.tan(vFov / 2) * distance;
    const width = height * (size.width / size.height);
    camera.getWorldDirection(tempDirection.current);
    endPos.current
      .copy(camera.position)
      .add(tempDirection.current.multiplyScalar(distance));
    endQuat.current.copy(camera.quaternion);
    endScale.current.set(width, height, 1);

    overlayRef.current.position.lerpVectors(startPos.current, endPos.current, ease);
    overlayRef.current.quaternion.slerpQuaternions(
      startQuat.current,
      endQuat.current,
      ease,
    );
    overlayRef.current.scale.lerpVectors(startScale.current, endScale.current, ease);

    if (t >= 1 && !done.current) {
      done.current = true;
      onActive?.(false);
      onDone?.();
    }
  });

  return (
    <mesh ref={overlayRef} renderOrder={10}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        transparent
        opacity={1}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}


function GlowOverlay({
  geometry,
  position,
  quaternion,
  scale,
  active = false,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  scale: [number, number, number];
  active?: boolean;
}) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const color = useMemo(() => new THREE.Color("#f59e0b"), []);

  useFrame(() => {
    if (!materialRef.current) return;
    if (!active) {
      materialRef.current.uniforms.uStrength.value = 0;
      return;
    }
    const t = performance.now() * 0.001;
    const pulse = Math.max(0, Math.sin(t * Math.PI));
    materialRef.current.uniforms.uStrength.value = 0.15 + pulse * 0.85;
  });

  const uniforms = useMemo(
    () => ({
      uColor: { value: color },
      uStrength: { value: 0 },
    }),
    [color],
  );

  return (
    <mesh
      geometry={geometry}
      position={position}
      quaternion={quaternion}
      scale={scale}
    >
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewDir = normalize(-mvPosition.xyz);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uStrength;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 1.6);
            float strength = uStrength * (0.6 + fresnel * 0.6);
            gl_FragColor = vec4(uColor, strength);
          }
        `}
      />
    </mesh>
  );
}

function Laptop({
  position,
  rotation,
  scale = 1,
  screenRef,
  screenTexture,
  screenUnlit = false,
}: LaptopProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[0.46, 0.03, 0.32]} />
        <meshStandardMaterial color="#c9cdd3" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.03, 0.02]}>
        <boxGeometry args={[0.42, 0.008, 0.26]} />
        <meshStandardMaterial color="#9aa2ad" metalness={0.35} roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.045, 0.11]}>
        <boxGeometry args={[0.12, 0.003, 0.08]} />
        <meshStandardMaterial color="#8f96a1" metalness={0.2} roughness={0.55} />
      </mesh>
      <group position={[0, 0.04, -0.16]} rotation={[-0.6, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.17, -0.007]}>
          <boxGeometry args={[0.48, 0.34, 0.014]} />
          <meshStandardMaterial color="#bfc5cd" metalness={0.7} roughness={0.28} />
        </mesh>
        <mesh ref={screenRef} position={[0, 0.17, 0.008]}>
          <planeGeometry args={[0.42, 0.26]} />
          {screenUnlit ? (
            <meshBasicMaterial
              color="#ffffff"
              map={screenTexture ?? undefined}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial
              color="#202634"
              emissive="#f4f8ff"
              emissiveIntensity={0.6}
              map={screenTexture ?? undefined}
              emissiveMap={screenTexture ?? undefined}
            />
          )}
        </mesh>
      </group>
    </group>
  );
}

function findObjectByKeyword(scene: THREE.Object3D, keywords: string[]) {
  const lowered = keywords.map((keyword) => keyword.toLowerCase());
  let match: THREE.Object3D | null = null;
  scene.traverse((obj) => {
    if (match) return;
    const name = obj.name.toLowerCase();
    if (lowered.some((keyword) => name.includes(keyword))) {
      match = obj;
    }
  });
  return match;
}

function buildAnchorFromObject(
  obj: THREE.Object3D,
  roomCenter: THREE.Vector3 | null,
  offsets: {
    forward: number;
    up: number;
    targetUp: number;
    targetForward?: number;
    side?: number;
    targetSide?: number;
  },
) {
  const box = new THREE.Box3().setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const forwardDir = roomCenter
    ? roomCenter.clone().sub(center).normalize()
    : new THREE.Vector3(0, 0, 1)
        .applyQuaternion(obj.getWorldQuaternion(new THREE.Quaternion()))
        .normalize();
  const upDir = new THREE.Vector3(0, 1, 0);
  const rightDir = new THREE.Vector3()
    .crossVectors(forwardDir, upDir)
    .normalize();

  const position = center
    .clone()
    .add(forwardDir.clone().multiplyScalar(size.z * offsets.forward))
    .add(rightDir.clone().multiplyScalar(size.x * (offsets.side ?? 0)))
    .add(upDir.clone().multiplyScalar(size.y * offsets.up));
  const target = center
    .clone()
    .add(forwardDir.clone().multiplyScalar(size.z * (offsets.targetForward ?? 0)))
    .add(rightDir.clone().multiplyScalar(size.x * (offsets.targetSide ?? 0)))
    .add(upDir.clone().multiplyScalar(size.y * offsets.targetUp));

  return { position, target };
}

function RoomModel({
  onAnchors,
  onHotspots,
  onDetailHotspots,
  onGlowTargets,
  onLabels,
  onPaintingRef,
  onPanelHitMap,
  onDetailHitMap,
  onPanelHitMapReady,
  onReady,
}: RoomModelProps) {
  const { scene } = useGLTF("/models/finalroom.glb");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const roomBounds = new THREE.Box3().setFromObject(scene);
    const roomCenter = roomBounds.isEmpty()
      ? null
      : roomBounds.getCenter(new THREE.Vector3());

    const couchObj =
      findObjectByKeyword(scene, ["sofa", "couch"]) || scene.getObjectByName("Sofa");
    const deskObjects = findObjectsByNameList(
      scene,
      panelObjectNameOverrides.desk,
    );
    const tableObjects = findObjectsByNameList(
      scene,
      panelObjectNameOverrides.table,
    );
    const photoObjects = findObjectsByNameList(
      scene,
      panelObjectNameOverrides.painting,
    );
    const shelfObjects = findObjectsByNameList(
      scene,
      panelObjectNameOverrides.shelf,
    );
    const deskObj = deskObjects[0] ?? null;
    const tableObj = tableObjects[0] ?? null;
    const photoObj = photoObjects[0] ?? null;
    const shelfObj = shelfObjects[0] ?? null;

    const panelHitMap: PanelHitMap = new WeakMap();
    const registerPanelMeshes = (root: THREE.Object3D | null, panel: PanelKey) => {
      if (!root) return;
      root.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          panelHitMap.set(child, panel);
        }
      });
    };
    const registerPanelMeshesForList = (
      roots: THREE.Object3D[],
      panel: PanelKey,
    ) => {
      roots.forEach((root) => registerPanelMeshes(root, panel));
    };
    registerPanelMeshesForList(deskObjects, "desk");
    registerPanelMeshesForList(tableObjects, "table");
    registerPanelMeshesForList(photoObjects, "painting");
    registerPanelMeshesForList(shelfObjects, "shelf");

    const nextAnchors: AnchorMap = { ...defaultAnchors };
    if (couchObj) {
      const { position, target } = buildAnchorFromObject(couchObj, roomCenter, {
        forward: -0.12,
        up: 0.75,
        targetUp: 0.25,
        targetForward: 0.4,
        side: -0.75,
        targetSide: -1.3,
      });
      nextAnchors.couch = {
        ...nextAnchors.couch,
        position,
        target,
      };
    }

    if (deskObj) {
      const { position, target } = buildAnchorFromObject(deskObj, roomCenter, {
        forward: 0.7,
        up: 0.87,
        targetUp: 0.2,
        targetSide: -0.4,
        side: -0.34,
      });
      nextAnchors.deskPapers = {
        ...nextAnchors.deskPapers,
        position,
        target,
      };
    }

    if (photoObj) {
      const { position, target } = buildAnchorFromObject(photoObj, roomCenter, {
        forward: 1.83,
        up: 0.25,
        targetUp: 1.25,
        side: 26,
        targetSide: 0,
      });
      nextAnchors.painting = {
        ...nextAnchors.painting,
        position,
        target,
      };
    }

    if (shelfObj) {
      const { position, target } = buildAnchorFromObject(shelfObj, roomCenter, {
        forward: 0.6,
        up: 0.4,
        targetUp: 1.4,
        side: -1,
        targetSide: 0.6,
      });
      nextAnchors.shelf = {
        ...nextAnchors.shelf,
        position,
        target,
      };
    }

    if (tableObj) {
      const { position, target } = buildAnchorFromObject(tableObj, roomCenter, {
        forward: 0,
        up: 10,
        targetUp: -15,
        side: 0.75,
        targetSide: -4,
      });
      nextAnchors.table = {
        ...nextAnchors.table,
        position,
        target,
      };
    }

    const spots: Hotspot[] = hotspots.map((spot) => {
      let source: THREE.Object3D | null = null;
      if (spot.panelKey === "desk") {
        source = deskObj;
      } else if (spot.panelKey === "painting") {
        source = photoObj;
      } else if (spot.panelKey === "shelf") {
        source = shelfObj;
      } else if (spot.panelKey === "table") {
        source = tableObj;
      }

      if (!source) {
        return spot;
      }

      const offsets = panelSpotOffsets[spot.panelKey];
      const center = placeSpotOnObject(source, roomCenter, offsets);
      return {
        ...spot,
        position: [center.x, center.y, center.z],
      };
    });

    const nextDetailSpots: DetailHotspot[] = detailHotspots.map((spot) => {
      if (spot.detailKey === "resume") {
        const resumeObj = findObjectByNameList(
          scene,
          detailObjectNameOverrides.resume,
        );
        if (resumeObj) {
          const center = new THREE.Box3()
            .setFromObject(resumeObj)
            .getCenter(new THREE.Vector3());
          return { ...spot, position: [center.x, center.y, center.z] };
        }
      }

      if (spot.detailKey === "experience") {
        const experienceObj = findObjectByNameList(
          scene,
          detailObjectNameOverrides.experience,
        );
        if (experienceObj) {
          const center = new THREE.Box3()
            .setFromObject(experienceObj)
            .getCenter(new THREE.Vector3());
          return { ...spot, position: [center.x, center.y, center.z] };
        }
      }

      if (spot.detailKey === "photography") {
        const notebookObj = findObjectByNameList(
          scene,
          detailObjectNameOverrides.photography,
        );
        if (notebookObj) {
          const center = new THREE.Box3()
            .setFromObject(notebookObj)
            .getCenter(new THREE.Vector3());
          return { ...spot, position: [center.x, center.y, center.z] };
        }
      }

      if (spot.panelKey === "desk" && deskObj) {
        const box = new THREE.Box3().setFromObject(deskObj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const up = new THREE.Vector3(0, 1, 0);
        const forward = roomCenter
          ? roomCenter.clone().sub(center).normalize()
          : new THREE.Vector3(0, 0, 1);
        const right = new THREE.Vector3().crossVectors(forward, up).normalize();
        const offset =
          spot.detailKey === "resume"
            ? right.clone().multiplyScalar(size.x * 0.15)
            : right.clone().multiplyScalar(-size.x * 0.05);
        const position = center
          .clone()
          .add(up.clone().multiplyScalar(size.y * 0.35))
          .add(forward.clone().multiplyScalar(size.z * 0.05))
          .add(offset);
        return { ...spot, position: [position.x, position.y, position.z] };
      }

      if (spot.panelKey === "table" && tableObj) {
        const box = new THREE.Box3().setFromObject(tableObj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const position = center
          .clone()
          .add(new THREE.Vector3(0, size.y * 0.35, 0));
        return { ...spot, position: [position.x, position.y, position.z] };
      }

      if (spot.panelKey === "shelf" && shelfObj) {
        const box = new THREE.Box3().setFromObject(shelfObj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const y = box.min.y + size.y * 0.35;
        const left = center.x - size.x * 0.2;
        const mid = center.x;
        const right = center.x + size.x * 0.2;
        let x = center.x;
        if (spot.detailKey === "project-one") {
          x = left;
        } else if (spot.detailKey === "project-two") {
          x = mid;
        } else if (spot.detailKey === "project-three") {
          x = right;
        }
        const position = new THREE.Vector3(x, y, center.z - size.z * 0.15);
        return { ...spot, position: [position.x, position.y, position.z] };
      }

      return spot;
    });

    const detailObjects: Partial<Record<DetailKey, THREE.Object3D>> = {
      resume: findObjectByNameList(scene, detailObjectNameOverrides.resume) ?? undefined,
      experience:
        findObjectByNameList(scene, detailObjectNameOverrides.experience) ??
        undefined,
      photography:
        findObjectByNameList(scene, detailObjectNameOverrides.photography) ??
        undefined,
      "project-one":
        findObjectByNameList(scene, detailObjectNameOverrides["project-one"]) ??
        undefined,
      "project-two":
        findObjectByNameList(scene, detailObjectNameOverrides["project-two"]) ??
        undefined,
      "project-three":
        findObjectByNameList(scene, detailObjectNameOverrides["project-three"]) ??
        undefined,
    };

    const detailHitMap = new WeakMap<THREE.Object3D, DetailKey>();
    (Object.entries(detailObjects) as Array<[DetailKey, THREE.Object3D | undefined]>).forEach(
      ([key, obj]) => {
        if (!obj) return;
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            detailHitMap.set(child, key);
          }
        });
      },
    );

    const shelfBookNames = panelObjectNameOverrides.shelf.filter(
      (name) => name !== "Shelves",
    );
    const glowNames = [
      ...detailObjectNameOverrides.resume,
      ...detailObjectNameOverrides.experience,
      ...detailObjectNameOverrides.photography,
      ...panelObjectNameOverrides.painting,
      ...shelfBookNames,
    ];
    const glowObjects = findObjectsByNameList(scene, glowNames);
    const glowTargets: GlowTarget[] = [];
    const glowGroups = [
      { key: "desk-papers", names: [
        ...detailObjectNameOverrides.resume,
        ...detailObjectNameOverrides.experience,
      ]},
      { key: "photo-book", names: [...detailObjectNameOverrides.photography] },
      { key: "painting", names: [...panelObjectNameOverrides.painting] },
      { key: "shelf-books", names: [...shelfBookNames] },
    ];
    const matchGroup = (name: string) => {
      const lowered = name.toLowerCase();
      return (
        glowGroups.find((group) =>
          group.names.some((entry) => entry.toLowerCase() === lowered),
        )?.key ?? null
      );
    };
    glowObjects.forEach((obj) => {
      const rootGroup = matchGroup(obj.name || "");
      obj.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;
        const groupKey = matchGroup(mesh.name || "") ?? rootGroup;
        if (!groupKey) return;
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        mesh.getWorldPosition(position);
        mesh.getWorldQuaternion(quaternion);
        mesh.getWorldScale(scale);
        glowTargets.push({
          id: mesh.uuid,
          geometry: mesh.geometry,
          position: [position.x, position.y, position.z],
          quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
          scale: [scale.x, scale.y, scale.z],
          groupKey,
        });
      });
    });

    const labels: ObjectLabel[] = [];
    const placeFlatLabel = (
      obj: THREE.Object3D,
      text: string,
      color: string,
      fontSize: number,
      spinToObject = false,
    ) => {
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const quat = obj.getWorldQuaternion(new THREE.Quaternion());
      const position: [number, number, number] = [
        center.x,
        box.max.y + 0.002,
        center.z,
      ];
      const xAxis = new THREE.Vector3(1, 0, 0).applyQuaternion(quat);
      const zAxis = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);
      const xHoriz = new THREE.Vector3(xAxis.x, 0, xAxis.z);
      const zHoriz = new THREE.Vector3(zAxis.x, 0, zAxis.z);
      const useAxis = xHoriz.lengthSq() >= zHoriz.lengthSq() ? xHoriz : zHoriz;
      const spin = useAxis.lengthSq() > 0 ? Math.atan2(useAxis.z, useAxis.x) : 0;
      const rotation: [number, number, number] = spinToObject
        ? [-Math.PI / 2, spin, 0]
        : [-Math.PI / 2, 0, 0];
      labels.push({
        id: `${obj.uuid}-label`,
        text,
        position,
        rotation,
        color,
        fontSize,
        maxWidth: size.x * 0.9,
        anchorX: "center",
        anchorY: "middle",
      });
    };
    const placeSpineLabel = (
      obj: THREE.Object3D,
      text: string,
      color: string,
      fontSize: number,
    ) => {
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const quat = obj.getWorldQuaternion(new THREE.Quaternion());
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quat).normalize();
      const position = center
        .clone()
        .add(normal.multiplyScalar(size.z * 0.52));
      const rotation = new THREE.Euler().setFromQuaternion(quat);
      rotation.z += Math.PI / 2;
      labels.push({
        id: `${obj.uuid}-spine`,
        text,
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        color,
        fontSize,
        maxWidth: size.y * 0.9,
        anchorX: "center",
        anchorY: "middle",
      });
    };

    const resumeObj = findObjectByNameList(
      scene,
      detailObjectNameOverrides.resume,
    );
    if (resumeObj) {
      placeFlatLabel(resumeObj, "Resume", "#111111", 0.045, true);
    }
    const experienceObj = findObjectByNameList(
      scene,
      detailObjectNameOverrides.experience,
    );
    if (experienceObj) {
      placeFlatLabel(experienceObj, "Work Experience", "#111111", 0.04, true);
    }
    const photoObjLabel = findObjectByNameList(
      scene,
      detailObjectNameOverrides.photography,
    );
    if (photoObjLabel) {
      placeFlatLabel(photoObjLabel, "Mason's\nPhotography", "#f8fafc", 0.05, true);
    }
    const bookObjects = findObjectsByNameList(scene, shelfBookNames);
    const bookLabels = projects.slice(0, 3).map((project, index) => ({
      text: project.title,
      index,
    }));
    bookLabels.forEach(({ text, index }) => {
      const obj = bookObjects[index];
      if (!obj) return;
      placeSpineLabel(obj, text, "#111111", 0.04);
    });

    onAnchors(nextAnchors);
    onHotspots(spots);
    onDetailHotspots(nextDetailSpots);
    onGlowTargets(glowTargets);
    onLabels(labels);
    onPaintingRef(photoObj ?? null);
    onPanelHitMap(panelHitMap);
    onDetailHitMap(detailHitMap);
    onPanelHitMapReady();
    onReady?.();
  }, [
    onAnchors,
    onDetailHotspots,
    onGlowTargets,
    onLabels,
    onHotspots,
    onPanelHitMap,
    onDetailHitMap,
    onPanelHitMapReady,
    onPaintingRef,
    onReady,
    scene,
  ]);

  return <primitive object={scene} />;
}

useGLTF.preload("/models/finalroom.glb");

export default function Scene({
  activePanel,
  activeDetail,
  onSelect,
  onReturnToCouch,
  onSelectDetail,
  forceLook = false,
  paintingRevealed = false,
  reducedMotion,
  transitionImage,
  transitionActive = false,
  exitTransitionActive = false,
  onTransitionEnd,
  onTransitionStart,
  onTransitionAnimating,
  onExitTransitionEnd,
  onPanelHitMapReady,
  onDebugHitName,
  glowActive,
  onSceneReady,
}: SceneProps) {
  const [sceneAnchors, setSceneAnchors] = useState<AnchorMap>(defaultAnchors);
  const [sceneHotspots, setSceneHotspots] = useState<Hotspot[]>(hotspots);
  const [sceneDetailHotspots, setSceneDetailHotspots] =
    useState<DetailHotspot[]>(detailHotspots);
  const screenTexture = useMemo(() => {
    if (!transitionImage) return null;
    const texture = new THREE.TextureLoader().load(transitionImage);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [transitionImage]);
  const [transitionAnimating, setTransitionAnimating] = useState(false);
  const [exitTransitionAnimating, setExitTransitionAnimating] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [cameraSettled, setCameraSettled] = useState(false);
  const settleReset = 0;
  const [transitionProgress, setTransitionProgress] = useState(0);
  const screenRef = useRef<THREE.Mesh | null>(null);
  const paintingRef = useRef<THREE.Object3D | null>(null);
  const paintingPivotRef = useRef<THREE.Object3D | null>(null);
  const paintingBaseQuat = useRef(new THREE.Quaternion());
  const paintingRotateAxis = useRef(new THREE.Vector3(0, 0, 1));
  const [paintingPanel, setPaintingPanel] = useState<{
    position: [number, number, number];
    rotation: [number, number, number];
    size: [number, number];
  } | null>(null);
  const [panelHitMap, setPanelHitMap] = useState<PanelHitMap | null>(null);
  const [glowTargets, setGlowTargets] = useState<GlowTarget[]>([]);
  const [objectLabels, setObjectLabels] = useState<ObjectLabel[]>([]);
  const [detailHitMap, setDetailHitMap] = useState<
    WeakMap<THREE.Object3D, DetailKey> | null
  >(null);
  const transitionStartRef = useRef(false);
  const labelFont = "/fonts/JetBrainsMono-Regular.ttf";
  const indicatorSpots = useMemo(() => {
    const findDetail = (key: DetailKey) =>
      sceneDetailHotspots.find((spot) => spot.detailKey === key);
    const findPanel = (panel: PanelKey) =>
      sceneHotspots.find((spot) => spot.panelKey === panel);
    const average = (positions: [number, number, number][]) => {
      const total = positions.reduce(
        (acc, pos) => {
          acc[0] += pos[0];
          acc[1] += pos[1];
          acc[2] += pos[2];
          return acc;
        },
        [0, 0, 0] as [number, number, number],
      );
      return [
        total[0] / positions.length,
        total[1] / positions.length,
        total[2] / positions.length,
      ] as [number, number, number];
    };

    const resume = findDetail("resume");
    const experience = findDetail("experience");
    const photography = findDetail("photography");
    const painting = findPanel("painting");
    const shelfSpots = sceneDetailHotspots.filter(
      (spot) => spot.panelKey === "shelf",
    );

    const indicators: IndicatorSpot[] = [];
    if (resume && experience) {
      indicators.push({
        id: "desk-papers",
        panelKey: "desk",
        position: average([resume.position, experience.position]),
        radius: Math.max(resume.radius, experience.radius) * 0.6,
      });
    } else if (resume) {
      indicators.push({
        id: "desk-papers",
        panelKey: "desk",
        position: resume.position,
        radius: resume.radius * 0.5,
      });
    }

    if (photography) {
      indicators.push({
        id: "photo-book",
        panelKey: "table",
        position: photography.position,
        radius: photography.radius * 0.5,
      });
    }

    const add = (pos: [number, number, number], dx: number, dy: number, dz: number) =>
      [pos[0] + dx, pos[1] + dy, pos[2] + dz] as [number, number, number];
  
    if (painting) {
      indicators.push({
        id: "gallery-wall",
        panelKey: "painting",
        position: add(painting.position, -0.6, 1.1, 0.4),
        radius: painting.radius * 0.4,
      });
    }

    if (shelfSpots.length) {
      const shelfPos = average(shelfSpots.map((spot) => spot.position));
      indicators.push({
        id: "shelf-books",
        panelKey: "shelf",
        position: add(shelfPos, 0, 0.25, 0.9),
        radius:
          shelfSpots.reduce((max, spot) => Math.max(max, spot.radius), 0) * 0.6,
      });
    }

    return indicators;
  }, [sceneDetailHotspots, sceneHotspots]);
  const handleAnchors = useCallback((nextAnchors: AnchorMap) => {
    setSceneAnchors(nextAnchors);
  }, []);
  const handleHotspots = useCallback((nextHotspots: Hotspot[]) => {
    setSceneHotspots(nextHotspots);
  }, []);
  const handleDetailHotspots = useCallback((nextHotspots: DetailHotspot[]) => {
    setSceneDetailHotspots(nextHotspots);
  }, []);
  const handleGlowTargets = useCallback((targets: GlowTarget[]) => {
    setGlowTargets(targets);
  }, []);
  const handleLabels = useCallback((labels: ObjectLabel[]) => {
    setObjectLabels(labels);
  }, []);
  const handleDetailHitMap = useCallback(
    (map: WeakMap<THREE.Object3D, DetailKey>) => {
      setDetailHitMap(map);
    },
    [],
  );


  useEffect(() => {
    if (!exitTransitionActive || !onExitTransitionEnd) return;
    if (screenTexture) return;
    const timer = window.setTimeout(() => {
      onExitTransitionEnd();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [exitTransitionActive, onExitTransitionEnd, screenTexture]);

  useEffect(() => {
    if (!transitionActive || !screenTexture || !sceneReady || !cameraSettled) {
      return;
    }
    if (transitionStartRef.current) return;
    transitionStartRef.current = true;
    onTransitionStart?.();
  }, [cameraSettled, onTransitionStart, screenTexture, sceneReady, transitionActive]);

  useEffect(() => {
    onTransitionAnimating?.(transitionAnimating);
  }, [onTransitionAnimating, transitionAnimating]);

  const handlePaintingRef = useCallback((painting: THREE.Object3D | null) => {
    if (!painting) {
      paintingRef.current = null;
      paintingPivotRef.current = null;
      return;
    }
    const parent = painting.parent;
    if (!parent) return;

    const box = new THREE.Box3().setFromObject(painting);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    let pivot = paintingPivotRef.current;
    if (!pivot) {
      const topCenterWorld = new THREE.Vector3(center.x, box.max.y, center.z);
      const topCenterLocal = parent.worldToLocal(topCenterWorld.clone());
      pivot = new THREE.Group();
      pivot.userData.isPaintingPivot = true;
      pivot.position.copy(topCenterLocal);
      pivot.quaternion.copy(painting.quaternion);
      pivot.scale.copy(painting.scale);
      parent.add(pivot);
      pivot.updateMatrixWorld(true);
      pivot.attach(painting);
      paintingPivotRef.current = pivot;
    } else if (painting.parent?.userData?.isPaintingPivot) {
      pivot = painting.parent;
      paintingPivotRef.current = pivot;
    }

    paintingRef.current = pivot ?? painting;
    paintingBaseQuat.current.copy(paintingRef.current.quaternion);
    paintingRotateAxis.current.copy(
      new THREE.Vector3(1, 0, 0).applyQuaternion(paintingBaseQuat.current),
    );

    const quat = painting.getWorldQuaternion(new THREE.Quaternion());
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quat).normalize();
    const position = center.clone().add(normal.multiplyScalar(-0.05));
    const rotation = new THREE.Euler().setFromQuaternion(quat);
    setPaintingPanel({
      position: [position.x, position.y, position.z],
      rotation: [rotation.x, rotation.y, rotation.z],
      size: [size.x * 0.85, size.y * 0.7],
    });
  }, []);

  const cameraPosition = useMemo(() => {
    const pos = sceneAnchors.couch.position;
    return [pos.x, pos.y, pos.z] as [number, number, number];
  }, [sceneAnchors]);

  const laptopTransform = useMemo(() => {
    const couchPos = sceneAnchors.couch.position;
    const offset = new THREE.Vector3(-0.34, -0.67, -0.05);
    const position = couchPos.clone().add(offset);
    return {
      position: [position.x, position.y, position.z] as [number, number, number],
      rotation: [0, 1.56, 0] as [number, number, number],
      scale: 1,
    };
  }, [sceneAnchors]);

  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: 44 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <color attach="background" args={["#b29a7c"]} />
      <fog attach="fog" args={["#ad967d", 6, 13]} />
      <PaintingReveal
        paintingRef={paintingRef}
        baseQuatRef={paintingBaseQuat}
        rotationAxis={paintingRotateAxis}
        revealed={paintingRevealed}
      />
      <CameraRig
        activePanel={activePanel}
        onSelect={onSelect}
        onReturnToCouch={onReturnToCouch}
        onSelectDetail={onSelectDetail}
        reducedMotion={reducedMotion}
        inputLocked={Boolean(activePanel) || Boolean(activeDetail)}
        forceLook={Boolean(forceLook)}
        anchors={sceneAnchors}
        transitionPitch={transitionActive ? -0.65 * transitionProgress : 0}
        settleReset={settleReset}
        spots={sceneHotspots}
        detailSpots={sceneDetailHotspots}
        indicatorSpots={indicatorSpots}
        panelHitMap={panelHitMap ?? undefined}
        detailHitMap={detailHitMap ?? undefined}
        onDebugHitName={onDebugHitName}
        onSettled={() => {
          setCameraSettled(true);
        }}
      />
      <ambientLight intensity={0.05} color="#e2b987" />
      <hemisphereLight
        intensity={0.03}
        color="#e3ba85"
        groundColor="#8f765c"
      />
      <directionalLight
        position={[4, 6, 2]}
        intensity={0.1}
        color="#e0b172"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[-3, 3, -2]} intensity={0.02} color="#c8a175" />
      {glowTargets.map((target) => (
        <GlowOverlay
          key={target.id}
          geometry={target.geometry}
          position={target.position}
          quaternion={target.quaternion}
          scale={target.scale}
          active={glowActive?.[target.groupKey] ?? false}
        />
      ))}
      <Suspense fallback={null}>
        <RoomModel
          onAnchors={handleAnchors}
          onHotspots={handleHotspots}
          onDetailHotspots={handleDetailHotspots}
          onGlowTargets={handleGlowTargets}
          onLabels={handleLabels}
          onPaintingRef={handlePaintingRef}
          onPanelHitMap={(map) => {
            setPanelHitMap(map);
          }}
          onDetailHitMap={handleDetailHitMap}
          onPanelHitMapReady={() => {
            onPanelHitMapReady?.();
          }}
          onReady={() => {
            setSceneReady(true);
            onSceneReady?.();
          }}
        />
      </Suspense>
      <Laptop
        {...laptopTransform}
        screenRef={screenRef}
        screenTexture={screenTexture}
        screenUnlit={
          transitionActive ||
          transitionAnimating ||
          exitTransitionActive ||
          exitTransitionAnimating
        }
      />
      {objectLabels.map((label) => (
        <Text
          key={label.id}
          position={label.position}
          rotation={label.rotation}
          color={label.color}
          fontSize={label.fontSize}
          maxWidth={label.maxWidth}
          font={labelFont}
          anchorX={label.anchorX ?? "center"}
          anchorY={label.anchorY ?? "middle"}
        >
          {label.text}
        </Text>
      ))}
      {paintingRevealed && paintingPanel && (
        <group position={paintingPanel.position} rotation={paintingPanel.rotation}>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={paintingPanel.size} />
            <meshStandardMaterial color="#111827" emissive="#1f2937" />
          </mesh>
          <Text
            fontSize={0.08}
            color="#e2e8f0"
            maxWidth={paintingPanel.size[0] * 0.8}
            font={labelFont}
            anchorX="center"
            anchorY="middle"
            position={[0, 0.05, 0]}
          >
            About Me
          </Text>
          <Text
            fontSize={0.035}
            color="#cbd5f5"
            maxWidth={paintingPanel.size[0] * 0.8}
            font={labelFont}
            anchorX="center"
            anchorY="top"
            position={[0, -0.02, 0]}
          >
            {aboutMeParagraphs.join("\n\n")}
          </Text>
        </group>
      )}
      {transitionActive && screenTexture && (
        <LaptopScreenTransition
          screenRef={screenRef}
          texture={screenTexture}
          onActive={setTransitionAnimating}
          onProgress={setTransitionProgress}
          onDone={onTransitionEnd}
        />
      )}
      {exitTransitionActive && screenTexture && (
        <LaptopScreenExitTransition
          screenRef={screenRef}
          texture={screenTexture}
          onActive={setExitTransitionAnimating}
          onDone={onExitTransitionEnd}
        />
      )}
      <group>
        {indicatorSpots.map((spot) => (
          <MarquiseMarker
            key={spot.id}
            id={spot.id}
            position={spot.position}
            radius={spot.radius * 0.8}
            active
            color="#eef2ff"
            emissive="#a5b4fc"
          />
        ))}
      </group>
    </Canvas>
  );
}

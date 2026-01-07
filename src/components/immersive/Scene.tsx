"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Text, useGLTF } from "@react-three/drei";
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
import Hotspots from "./Hotspots";
import {
  detailHotspots,
  hotspots,
  type DetailHotspot,
  type DetailKey,
  type Hotspot,
  type PanelKey,
} from "./data";

type SceneProps = {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
  onSelectDetail?: (detail: DetailKey) => void;
  paintingRevealed?: boolean;
  reducedMotion?: boolean;
  transitionImage?: string | null;
  transitionActive?: boolean;
  onTransitionEnd?: () => void;
  onTransitionStart?: () => void;
  onTransitionAnimating?: (isAnimating: boolean) => void;
};

type Anchor = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  lookRange: { yaw: number; pitch: number };
};

type AnchorMap = Record<string, Anchor>;

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

function CameraRig({
  activePanel,
  onSelect,
  anchors,
  reducedMotion = false,
  onSettled,
  settleReset = 0,
  transitionPitch = 0,
  spots = hotspots,
  detailSpots = detailHotspots,
  onSelectDetail,
}: {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
  anchors: AnchorMap;
  reducedMotion?: boolean;
  onSettled?: () => void;
  settleReset?: number;
  transitionPitch?: number;
  spots?: Hotspot[];
  detailSpots?: DetailHotspot[];
  onSelectDetail?: (detail: DetailKey) => void;
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
        onSelectDetail?.(closestDetail.key);
        return;
      }

      let closest: { panelKey: PanelKey; distance: number } | null = null;
      spots.forEach((spot) => {
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
        document.exitPointerLock?.();
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
  onPaintingRef: (object: THREE.Object3D | null) => void;
  onReady?: () => void;
};

type LaptopProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  screenRef: RefObject<THREE.Mesh>;
  screenTexture?: THREE.Texture | null;
  screenUnlit?: boolean;
};

type LaptopScreenTransitionProps = {
  screenRef: RefObject<THREE.Mesh>;
  texture: THREE.Texture;
  onDone?: () => void;
  onActive?: (isActive: boolean) => void;
  onProgress?: (progress: number) => void;
};

function PaintingReveal({
  paintingRef,
  baseQuatRef,
  revealed,
}: {
  paintingRef: RefObject<THREE.Object3D>;
  baseQuatRef: RefObject<THREE.Quaternion>;
  revealed: boolean;
}) {
  useFrame((_, delta) => {
    const painting = paintingRef.current;
    if (!painting) return;
    const baseQuat = baseQuatRef.current;
    const targetQuat = new THREE.Quaternion().copy(baseQuat);
    if (revealed) {
      const revealQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(-0.05, -1.2, 0),
      );
      targetQuat.multiply(revealQuat);
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
  const tempOpacity = useRef(1);

  useFrame((state, delta) => {
    if (!overlayRef.current || !screenRef.current || done.current) return;

    onActive?.(true);
    elapsed.current += delta;
    const hold = 1;
    const duration = 2.0;
    const t = Math.min(Math.max((elapsed.current - hold) / duration, 0), 1);
    const ease = t * t * (3 - 2 * t);
    onProgress?.(ease);

    const vFov = THREE.MathUtils.degToRad(camera.fov);
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

    tempOpacity.current = 1;
    const material = overlayRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = tempOpacity.current;

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
  onPaintingRef,
  onReady,
}: RoomModelProps) {
  const { scene } = useGLTF("/models/office.glb");
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
    const deskObj =
      findObjectByKeyword(scene, ["desk"]) ||
      findObjectByKeyword(scene, ["table"]) ||
      scene.getObjectByName("Table");
    const photoObj =
      findObjectByKeyword(scene, ["painting", "frame", "picture"]) ||
      scene.getObjectByName("Frame");
    const shelfObj = findObjectByKeyword(scene, ["shelf", "book"]);
    const tableObj =
      findObjectByKeyword(scene, ["coffee", "round", "small", "table"]) ||
      scene.getObjectByName("CoffeeTable");

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
        forward: 0.557,
        up: 0.7,
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
        forward: 62,
        up: 0.36,
        targetUp: 25,
        side: 0.1,
        targetSide: 18,
      });
      nextAnchors.painting = {
        ...nextAnchors.painting,
        position,
        target,
      };
    }

    if (shelfObj) {
      const { position, target } = buildAnchorFromObject(shelfObj, roomCenter, {
        forward: 1.5,
        up: 1.4,
        targetUp: 2.5,
        side: -2,
        targetSide: 0,
      });
      nextAnchors.shelf = {
        ...nextAnchors.shelf,
        position,
        target,
      };
    }

    if (tableObj) {
      const { position, target } = buildAnchorFromObject(tableObj, roomCenter, {
        forward: 3.5,
        up: -0.6,
        targetUp: -15,
        side: -0.05,
        targetSide: 2.4,
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

      const center = new THREE.Box3()
        .setFromObject(source)
        .getCenter(new THREE.Vector3());
      return {
        ...spot,
        position: [center.x, center.y, center.z],
      };
    });

    const nextDetailSpots: DetailHotspot[] = detailHotspots.map((spot) => {
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

    onAnchors(nextAnchors);
    onHotspots(spots);
    onDetailHotspots(nextDetailSpots);
    onPaintingRef(photoObj ?? null);
    onReady?.();
  }, [onAnchors, onDetailHotspots, onHotspots, onPaintingRef, scene]);

  return <primitive object={scene} />;
}

useGLTF.preload("/models/office.glb");

export default function Scene({
  activePanel,
  onSelect,
  onSelectDetail,
  paintingRevealed = false,
  reducedMotion,
  transitionImage,
  transitionActive = false,
  onTransitionEnd,
  onTransitionStart,
  onTransitionAnimating,
}: SceneProps) {
  const [sceneAnchors, setSceneAnchors] = useState<AnchorMap>(defaultAnchors);
  const [sceneHotspots, setSceneHotspots] = useState<Hotspot[]>(hotspots);
  const [sceneDetailHotspots, setSceneDetailHotspots] =
    useState<DetailHotspot[]>(detailHotspots);
  const [screenTexture, setScreenTexture] = useState<THREE.Texture | null>(null);
  const [transitionAnimating, setTransitionAnimating] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [cameraSettled, setCameraSettled] = useState(false);
  const [settleReset, setSettleReset] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const screenRef = useRef<THREE.Mesh>(null);
  const paintingRef = useRef<THREE.Object3D | null>(null);
  const paintingBaseQuat = useRef(new THREE.Quaternion());
  const [paintingPanel, setPaintingPanel] = useState<{
    position: [number, number, number];
    rotation: [number, number, number];
    size: [number, number];
  } | null>(null);
  const transitionStartRef = useRef(false);
  const handleAnchors = useCallback((nextAnchors: AnchorMap) => {
    setSceneAnchors(nextAnchors);
  }, []);
  const handleHotspots = useCallback((nextHotspots: Hotspot[]) => {
    setSceneHotspots(nextHotspots);
  }, []);
  const handleDetailHotspots = useCallback((nextHotspots: DetailHotspot[]) => {
    setSceneDetailHotspots(nextHotspots);
  }, []);

  useEffect(() => {
    if (!transitionImage) {
      setScreenTexture(null);
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.load(transitionImage, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      setScreenTexture(texture);
    });
  }, [transitionImage]);

  useEffect(() => {
    if (!transitionActive || !screenTexture || !sceneReady || !cameraSettled) {
      return;
    }
    if (transitionStartRef.current) return;
    transitionStartRef.current = true;
    onTransitionStart?.();
  }, [cameraSettled, onTransitionStart, screenTexture, sceneReady, transitionActive]);

  useEffect(() => {
    if (transitionActive) {
      setCameraSettled(false);
      setSettleReset((value) => value + 1);
      transitionStartRef.current = false;
      setTransitionProgress(0);
    }
  }, [transitionActive]);

  useEffect(() => {
    onTransitionAnimating?.(transitionAnimating);
  }, [onTransitionAnimating, transitionAnimating]);

  const handlePaintingRef = useCallback((painting: THREE.Object3D | null) => {
    paintingRef.current = painting;
    if (!painting) return;
    paintingBaseQuat.current.copy(painting.quaternion);
    const box = new THREE.Box3().setFromObject(painting);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
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
      rotation: [0, 1.56, 0],
      scale: 1,
    };
  }, [sceneAnchors]);

  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: 44 }}
      className="h-full w-full"
    >
      <color attach="background" args={["#b29a7c"]} />
      <fog attach="fog" args={["#ad967d", 6, 13]} />
      <PaintingReveal
        paintingRef={paintingRef}
        baseQuatRef={paintingBaseQuat}
        revealed={paintingRevealed}
      />
      <CameraRig
        activePanel={activePanel}
        onSelect={onSelect}
        onSelectDetail={onSelectDetail}
        reducedMotion={reducedMotion}
        anchors={sceneAnchors}
        transitionPitch={-0.65 * transitionProgress}
        settleReset={settleReset}
        spots={sceneHotspots}
        detailSpots={sceneDetailHotspots}
        onSettled={() => {
          setCameraSettled(true);
        }}
      />
      <ambientLight intensity={0.05} color="#e2b987" />
      <hemisphereLight
        intensity={0.03}
        skyColor="#e3ba85"
        groundColor="#8f765c"
      />
      <directionalLight
        position={[4, 6, 2]}
        intensity={0.1}
        color="#e0b172"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[-3, 3, -2]} intensity={0.02} color="#c8a175" />
      <Suspense fallback={null}>
        <RoomModel
          onAnchors={handleAnchors}
          onHotspots={handleHotspots}
          onDetailHotspots={handleDetailHotspots}
          onPaintingRef={handlePaintingRef}
          onReady={() => setSceneReady(true)}
        />
      </Suspense>
      <Laptop
        {...laptopTransform}
        screenRef={screenRef}
        screenTexture={screenTexture}
        screenUnlit={transitionActive || transitionAnimating}
      />
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
            anchorX="center"
            anchorY="top"
            position={[0, -0.02, 0]}
          >
            Placeholder bio copy goes here. Replace with a short, confident
            summary.
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
      <Hotspots activePanel={activePanel} spots={sceneHotspots} />
      {activePanel && (
        <group>
          {sceneDetailHotspots
            .filter((spot) => spot.panelKey === activePanel)
            .map((spot) => (
              <mesh key={spot.id} position={spot.position}>
                <sphereGeometry args={[spot.radius, 18, 18]} />
                <meshStandardMaterial
                  color="#f8fafc"
                  transparent
                  opacity={0.16}
                  emissive="#e2e8f0"
                  emissiveIntensity={0.45}
                />
              </mesh>
            ))}
        </group>
      )}
      <Environment preset="sunset" intensity={0.03} />
    </Canvas>
  );
}

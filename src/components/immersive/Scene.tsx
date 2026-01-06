"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
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
import { hotspots, type Hotspot, type PanelKey } from "./data";

type SceneProps = {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
  reducedMotion?: boolean;
  transitionImage?: string | null;
  transitionActive?: boolean;
  onTransitionEnd?: () => void;
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
  anchors,
  reducedMotion = false,
}: {
  activePanel: PanelKey | null;
  onSelect: (panel: PanelKey) => void;
  anchors: AnchorMap;
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

type RoomModelProps = {
  onAnchors: (anchors: AnchorMap) => void;
  onHotspots: (spots: Hotspot[]) => void;
};

type LaptopProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  screenRef: RefObject<THREE.Mesh>;
  screenTexture?: THREE.Texture | null;
};

type LaptopScreenTransitionProps = {
  screenRef: RefObject<THREE.Mesh>;
  texture: THREE.Texture;
  onDone?: () => void;
};

function LaptopScreenTransition({
  screenRef,
  texture,
  onDone,
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

    elapsed.current += delta;
    const hold = 0.25;
    const duration = 1.35;
    const t = Math.min(Math.max((elapsed.current - hold) / duration, 0), 1);
    const ease = t * t * (3 - 2 * t);

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

    tempOpacity.current = t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;
    const material = overlayRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = tempOpacity.current;

    if (t >= 1 && !done.current) {
      done.current = true;
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
          <meshStandardMaterial
            color="#0a0d12"
            emissive="#1c1f24"
            emissiveIntensity={0.35}
            map={screenTexture ?? undefined}
            emissiveMap={screenTexture ?? undefined}
          />
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

function RoomModel({ onAnchors, onHotspots }: RoomModelProps) {
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
      findObjectByKeyword(scene, ["desk", "table"]) || scene.getObjectByName("Table");
    const photoObj =
      findObjectByKeyword(scene, ["painting", "frame", "picture"]) ||
      scene.getObjectByName("Frame");
    const shelfObj = findObjectByKeyword(scene, ["shelf", "book"]);

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
        forward: 0.8,
        up: 0.45,
        targetUp: 0.25,
      });
      nextAnchors.desk = {
        ...nextAnchors.desk,
        position,
        target,
      };
    }

    if (photoObj) {
      const { position, target } = buildAnchorFromObject(photoObj, roomCenter, {
        forward: 0.5,
        up: 0.2,
        targetUp: 0.0,
      });
      nextAnchors.wallPhoto = {
        ...nextAnchors.wallPhoto,
        position,
        target,
      };
    }

    if (shelfObj) {
      const { position, target } = buildAnchorFromObject(shelfObj, roomCenter, {
        forward: 0.8,
        up: 0.2,
        targetUp: 0.0,
      });
      nextAnchors.projects = {
        ...nextAnchors.projects,
        position,
        target,
      };
    }

    const spots: Hotspot[] = hotspots.map((spot) => {
      let source: THREE.Object3D | null = null;
      if (spot.panelKey === "resume" || spot.panelKey === "experience") {
        source = deskObj;
      } else if (spot.panelKey === "skills") {
        source = photoObj;
      } else if (spot.panelKey === "projects") {
        source = shelfObj;
      } else if (spot.panelKey === "contact") {
        source = couchObj;
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

    onAnchors(nextAnchors);
    onHotspots(spots);
  }, [onAnchors, onHotspots, scene]);

  return <primitive object={scene} />;
}

useGLTF.preload("/models/office.glb");

export default function Scene({
  activePanel,
  onSelect,
  reducedMotion,
  transitionImage,
  transitionActive = false,
  onTransitionEnd,
}: SceneProps) {
  const [sceneAnchors, setSceneAnchors] = useState<AnchorMap>(defaultAnchors);
  const [sceneHotspots, setSceneHotspots] = useState<Hotspot[]>(hotspots);
  const [screenTexture, setScreenTexture] = useState<THREE.Texture | null>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const handleAnchors = useCallback((nextAnchors: AnchorMap) => {
    setSceneAnchors(nextAnchors);
  }, []);
  const handleHotspots = useCallback((nextHotspots: Hotspot[]) => {
    setSceneHotspots(nextHotspots);
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

  const cameraPosition = useMemo(() => {
    const pos = sceneAnchors.couch.position;
    return [pos.x, pos.y, pos.z] as [number, number, number];
  }, [sceneAnchors]);

  const laptopTransform = useMemo(() => {
    const couchPos = sceneAnchors.couch.position;
    const offset = new THREE.Vector3(-0.12, -0.33, -0.1);
    const position = couchPos.clone().add(offset);
    return {
      position: [position.x, position.y, position.z] as [number, number, number],
      rotation: [-0.25, 0.45, 0],
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
      <CameraRig
        activePanel={activePanel}
        onSelect={onSelect}
        reducedMotion={reducedMotion}
        anchors={sceneAnchors}
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
        <RoomModel onAnchors={handleAnchors} onHotspots={handleHotspots} />
      </Suspense>
      <Laptop
        {...laptopTransform}
        screenRef={screenRef}
        screenTexture={screenTexture}
      />
      {transitionActive && screenTexture && (
        <LaptopScreenTransition
          screenRef={screenRef}
          texture={screenTexture}
          onDone={onTransitionEnd}
        />
      )}
      <Hotspots
        activePanel={activePanel}
        onSelect={onSelect}
        spots={sceneHotspots}
      />
      <Environment preset="sunset" intensity={0.03} />
    </Canvas>
  );
}

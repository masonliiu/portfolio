"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

function Totem({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = progress.current;
    group.current.rotation.y = t * Math.PI * 2 + state.pointer.x * 0.4;
    group.current.rotation.x = t * Math.PI * 0.6 + state.pointer.y * 0.2;
    group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusKnotGeometry args={[0.9, 0.28, 220, 24]} />
        <meshStandardMaterial
          color="#ff4d2d"
          roughness={0.2}
          metalness={0.6}
          emissive="#ff7b5c"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh rotation={[0.6, 0.4, 0]}>
        <icosahedronGeometry args={[0.45, 1]} />
        <meshStandardMaterial
          color="#2f6bff"
          roughness={0.3}
          metalness={0.3}
          emissive="#3d7bff"
          emissiveIntensity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function ScrollTotem() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    if (!wrapperRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      progress.current = 0;
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section className="section-block" data-reveal>
      <div className="totem-grid" ref={wrapperRef}>
        <div>
          <p className="section-kicker">3D interaction</p>
          <h2 className="section-title">A tactile object, scrubbed by scroll.</h2>
          <p className="section-subtitle">
            As you move, the form rotates and responds to your cursor. This is a
            small hint of the spatial experiences I build.
          </p>
        </div>
        <div className="totem-stage" aria-hidden="true">
          <Canvas camera={{ position: [0, 0, 3.4], fov: 46 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 2, 3]} intensity={1} />
            <Totem progress={progress} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}

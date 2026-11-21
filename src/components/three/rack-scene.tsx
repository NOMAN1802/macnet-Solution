"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";

/**
 * Placeholder hero scene: three stacked 1U devices in an open rack frame, ports with
 * blinking link LEDs. Replace with a product model (GLB) once real assets exist.
 */
const UNIT_H = 0.44;
const WIDTH = 4.4;
const DEPTH = 2.4;

function Leds({ count, y, seed }: { count: number; y: number; seed: number }) {
  const refs = useRef<(Mesh | null)[]>([]);
  const phases = useMemo(() => Array.from({ length: count }, (_, i) => ((i * 7919 + seed * 104729) % 1000) / 1000), [count, seed]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      const on = Math.sin(t * (2.5 + phases[i] * 6) + phases[i] * 40) > -0.2;
      (m.material as MeshStandardMaterial).emissiveIntensity = on ? 2.2 : 0.15;
    });
  });
  return (
    <>
      {phases.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} position={[-1.65 + i * 0.19, y + 0.13, DEPTH / 2 + 0.011]}>
          <planeGeometry args={[0.05, 0.03]} />
          <meshStandardMaterial color={i % 5 === 0 ? "#F5A524" : "#3DDC84"} emissive={i % 5 === 0 ? "#F5A524" : "#3DDC84"} emissiveIntensity={1} />
        </mesh>
      ))}
    </>
  );
}

function Device({ y, ports, seed, accent }: { y: number; ports: number; seed: number; accent?: boolean }) {
  return (
    <group position={[0, y, 0]}>
      <RoundedBox args={[WIDTH, UNIT_H - 0.04, DEPTH]} radius={0.02} smoothness={2}>
        <meshStandardMaterial color="#171922" metalness={0.6} roughness={0.45} />
      </RoundedBox>
      {/* port block */}
      {Array.from({ length: ports }).map((_, i) => (
        <mesh key={i} position={[-1.65 + i * 0.19, -0.04, DEPTH / 2 + 0.006]}>
          <planeGeometry args={[0.15, 0.13]} />
          <meshStandardMaterial color="#0E0F14" roughness={0.9} />
        </mesh>
      ))}
      <Leds count={ports} y={-0.04} seed={seed} />
      {/* uplink cages */}
      {[0, 1].map((i) => (
        <mesh key={i} position={[1.55 + i * 0.32, -0.02, DEPTH / 2 + 0.006]}>
          <planeGeometry args={[0.26, 0.16]} />
          <meshStandardMaterial color={accent ? "#19B6D8" : "#2A2C36"} emissive={accent ? "#19B6D8" : "#000000"} emissiveIntensity={accent ? 0.6 : 0} />
        </mesh>
      ))}
      {/* rack ears */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (WIDTH / 2 + 0.12), 0, DEPTH / 2 - 0.02]}>
          <boxGeometry args={[0.24, UNIT_H - 0.04, 0.04]} />
          <meshStandardMaterial color="#2A2C36" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Rack({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const baseY = animate ? Math.sin(t * 0.25) * 0.18 : 0;
    group.current.rotation.y += ((-0.55 + baseY + pointer.x * 0.15) - group.current.rotation.y) * 0.05;
    group.current.rotation.x += ((0.18 - pointer.y * 0.06) - group.current.rotation.x) * 0.05;
  });
  return (
    <group ref={group} rotation={[0.18, -0.55, 0]}>
      <Device y={UNIT_H} ports={18} seed={1} accent />
      <Device y={0} ports={18} seed={2} />
      <Device y={-UNIT_H} ports={18} seed={3} />
      {/* rails */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (WIDTH / 2 + 0.3), 0, DEPTH / 2 - 0.05]}>
          <boxGeometry args={[0.08, 2.6, 0.08]} />
          <meshStandardMaterial color="#8A8D99" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export default function RackScene({ animate = true }: { animate?: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 7.2], fov: 38 }}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={1.4} />
      <directionalLight position={[-5, -2, 3]} intensity={0.4} color="#19B6D8" />
      <Rack animate={animate} />
    </Canvas>
  );
}

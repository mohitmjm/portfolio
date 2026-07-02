import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion, useIsMobile } from "@/lib/motion";
import { useTheme } from "@/lib/theme";

/* ---------- helpers ---------- */

function useScrollY() {
  const ref = useRef(0);
  useFrame(() => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    ref.current = h > 0 ? window.scrollY / h : 0;
  });
  return ref;
}

/* ---------- Neural Core ---------- */

function NeuralCore({ colorA, colorB }: { colorA: string; colorB: string }) {
  const inner = useRef<THREE.Mesh>(null!);
  const outer = useRef<THREE.Mesh>(null!);
  const nodes = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const r = 1.6 + Math.random() * 0.6;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    if (inner.current) {
      inner.current.rotation.y += dt * 0.25;
      inner.current.rotation.x += dt * 0.1;
    }
    if (outer.current) {
      outer.current.rotation.y -= dt * 0.12;
      outer.current.rotation.z += dt * 0.05;
    }
    if (nodes.current) nodes.current.rotation.y += dt * 0.08;
  });

  return (
    <group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color={colorA}
          emissive={colorA}
          emissiveIntensity={0.8}
          metalness={0.7}
          roughness={0.15}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color={colorB} wireframe transparent opacity={0.22} />
      </mesh>
      <points ref={nodes}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color={colorA} transparent opacity={0.55} sizeAttenuation />
      </points>
    </group>
  );
}

/* ---------- Skill orbit rings ---------- */

function SkillOrbit({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.15;
  });
  const rings = [1.6, 2.2, 2.9];
  return (
    <group ref={group} position={[0, 0, 0]}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
          <torusGeometry args={[r, 0.012, 16, 128]} />
          <meshBasicMaterial color={color} transparent opacity={0.28} />
        </mesh>
      ))}
      {rings.flatMap((r, i) =>
        Array.from({ length: 6 + i * 2 }).map((_, k, arr) => {
          const a = (k / arr.length) * Math.PI * 2;
          return (
            <mesh key={`${i}-${k}`} position={[Math.cos(a) * r, Math.sin(i * 0.4) * 0.4, Math.sin(a) * r]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
            </mesh>
          );
        }),
      )}
    </group>
  );
}

/* ---------- Cyber Shield / Node Mesh ---------- */

function CyberShield({ colorA, colorB }: { colorA: string; colorB: string }) {
  const shield = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (shield.current) shield.current.rotation.y += dt * 0.2;
  });
  return (
    <group>
      <mesh ref={shield}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color={colorA} wireframe transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 24, 24]} />
        <meshStandardMaterial color={colorB} emissive={colorB} emissiveIntensity={0.5} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* ---------- Timeline tunnel ---------- */

function Tunnel({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (group.current) {
      group.current.children.forEach((c) => {
        c.position.z += dt * 1.5;
        if (c.position.z > 4) c.position.z = -16;
      });
    }
  });
  const rings = Array.from({ length: 14 }, (_, i) => i);
  return (
    <group ref={group}>
      {rings.map((i) => (
        <mesh key={i} position={[0, 0, -i * 1.5]} rotation={[0, 0, i * 0.3]}>
          <torusGeometry args={[2.6, 0.02, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.3 - i * 0.015} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Camera rig ---------- */

function CameraRig() {
  const { camera } = useThree();
  const scroll = useScrollY();
  // Waypoints along scroll: hero → about → skills → projects → focus → journey → contact
  const waypoints = useMemo<[number, number, number][]>(
    () => [
      [0, 0, 6],
      [1.2, 0.3, 6.5],
      [0, 0, 8],
      [-1.5, -0.2, 7],
      [1.5, 0.4, 7.5],
      [0, -0.3, 9],
      [0, 0, 7],
    ],
    [],
  );
  const target = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  useFrame(() => {
    const p = scroll.current * (waypoints.length - 1);
    const i = Math.floor(p);
    const t = p - i;
    const a = waypoints[Math.min(i, waypoints.length - 1)];
    const b = waypoints[Math.min(i + 1, waypoints.length - 1)];
    target.set(
      THREE.MathUtils.lerp(a[0], b[0], t),
      THREE.MathUtils.lerp(a[1], b[1], t),
      THREE.MathUtils.lerp(a[2], b[2], t),
    );
    camera.position.lerp(target, 0.05);
    camera.lookAt(lookAt);
  });
  return null;
}

/* ---------- Scene selector by scroll section ---------- */

function ActiveScene({ colorA, colorB }: { colorA: string; colorB: string }) {
  const group = useRef<THREE.Group>(null!);
  const scroll = useScrollY();

  useFrame(() => {
    if (!group.current) return;
    // slight rotation so groups don't feel static
    group.current.rotation.y = scroll.current * Math.PI * 0.5;
  });

  return (
    <group ref={group}>
      {/* Hero core sits far right & back so text stays readable. */}
      <group position={[5.5, -0.4, -3]} scale={0.65}>
        <NeuralCore colorA={colorA} colorB={colorB} />
      </group>
      {/* Skills orbit offset */}
      <group position={[4.5, -0.5, -3]} scale={0.8}>
        <SkillOrbit color={colorA} />
      </group>
      {/* Cyber shield further out */}
      <group position={[-4.5, 0.5, -5]} scale={0.7}>
        <CyberShield colorA={colorA} colorB={colorB} />
      </group>
      {/* Tunnel far back */}
      <group position={[0, -1, -10]}>
        <Tunnel color={colorA} />
      </group>
    </group>
  );
}

/* ---------- Public Canvas ---------- */

export function BackgroundScene() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const { theme } = useTheme();

  if (reduced || mobile) {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 cyber-grid opacity-40" />
        <div
          className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "var(--gradient-core)" }}
        />
      </div>
    );
  }

  const colorA = theme === "dark" ? "#22d3ee" : "#0284c7";
  const colorB = theme === "dark" ? "#a855f7" : "#7c3aed";

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 cyber-grid opacity-35" />
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[6, 6, 6]} intensity={0.9} color={colorA} />
          <pointLight position={[-6, -4, -4]} intensity={1.1} color={colorB} />
          <ActiveScene colorA={colorA} colorB={colorB} />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}

import React, { useMemo } from 'react';
import * as THREE from 'three';

export function ProceduralCar({ carId = 'apex_gt', color = '#ff2a55', isNight = false, isNitro = false }) {
  // Paint Material
  const paintMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.85,
        roughness: 0.22,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
      }),
    [color]
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0a101d'),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.7,
        opacity: 0.85,
        transparent: true,
      }),
    []
  );

  const carbonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#16181d'),
        roughness: 0.45,
        metalness: 0.65,
      }),
    []
  );

  const trimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0b0e14'),
        roughness: 0.5,
        metalness: 0.2,
      }),
    []
  );

  const headlightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e0f7fa'),
        emissive: new THREE.Color('#00e5ff'),
        emissiveIntensity: isNight ? 2.5 : 1.0,
        roughness: 0.1,
      }),
    [isNight]
  );

  const taillightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ff1744'),
        emissive: new THREE.Color('#ff0033'),
        emissiveIntensity: 2.0,
        roughness: 0.2,
      }),
    []
  );

  const exhaustFlameMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#00f0ff'),
        transparent: true,
        opacity: isNitro ? 0.9 : 0.0,
      }),
    [isNitro]
  );

  return (
    <group position={[0, 0.45, 0]}>
      {/* ================= LOWER MAIN CHASSIS ================= */}
      <mesh position={[0, 0, 0]} material={paintMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.86, 0.45, 4.2]} />
      </mesh>

      {/* Side Skirts */}
      <mesh position={[0, -0.16, 0]} material={carbonMaterial} castShadow>
        <boxGeometry args={[1.92, 0.12, 3.8]} />
      </mesh>

      {/* Front Nose & Hood Slope */}
      <mesh position={[0, 0.08, 1.3]} rotation={[0.18, 0, 0]} material={paintMaterial} castShadow>
        <boxGeometry args={[1.78, 0.32, 1.4]} />
      </mesh>

      {/* Front Bumper & Air Dam */}
      <mesh position={[0, -0.06, 2.08]} material={carbonMaterial} castShadow>
        <boxGeometry args={[1.82, 0.26, 0.3]} />
      </mesh>

      {/* Front Splitter Lip */}
      <mesh position={[0, -0.18, 2.16]} material={carbonMaterial} castShadow>
        <boxGeometry args={[1.9, 0.05, 0.4]} />
      </mesh>

      {/* Front Grille Mesh */}
      <mesh position={[0, -0.06, 2.22]} material={trimMaterial}>
        <boxGeometry args={[1.1, 0.18, 0.04]} />
      </mesh>

      {/* Front Headlights */}
      <mesh position={[0.66, 0.08, 2.1]} material={headlightMaterial}>
        <boxGeometry args={[0.38, 0.1, 0.1]} />
      </mesh>
      <mesh position={[-0.66, 0.08, 2.1]} material={headlightMaterial}>
        <boxGeometry args={[0.38, 0.1, 0.1]} />
      </mesh>

      {/* Daytime Running Light Accent Strips */}
      <mesh position={[0.66, 0.02, 2.14]} material={headlightMaterial}>
        <boxGeometry args={[0.34, 0.02, 0.04]} />
      </mesh>
      <mesh position={[-0.66, 0.02, 2.14]} material={headlightMaterial}>
        <boxGeometry args={[0.34, 0.02, 0.04]} />
      </mesh>

      {/* Headlight Projectors at Night */}
      {isNight && (
        <>
          <spotLight
            position={[0.65, 0.05, 2.15]}
            target-position={[0.65, -0.5, 25]}
            angle={0.65}
            penumbra={0.4}
            intensity={22}
            distance={50}
            color="#dff6ff"
            castShadow
          />
          <spotLight
            position={[-0.65, 0.05, 2.15]}
            target-position={[-0.65, -0.5, 25]}
            angle={0.65}
            penumbra={0.4}
            intensity={22}
            distance={50}
            color="#dff6ff"
            castShadow
          />
        </>
      )}

      {/* ================= CABIN & GREENHOUSE ================= */}
      {/* Cabin Roof Body */}
      <mesh position={[0, 0.46, -0.25]} material={paintMaterial} castShadow>
        <boxGeometry args={[1.36, 0.44, 1.7]} />
      </mesh>

      {/* Front Windshield */}
      <mesh position={[0, 0.4, 0.72]} rotation={[-0.55, 0, 0]} material={glassMaterial}>
        <boxGeometry args={[1.34, 0.45, 0.06]} />
      </mesh>

      {/* Rear Windshield */}
      <mesh position={[0, 0.4, -1.22]} rotation={[0.48, 0, 0]} material={glassMaterial}>
        <boxGeometry args={[1.32, 0.48, 0.06]} />
      </mesh>

      {/* Side Windows */}
      <mesh position={[0.67, 0.42, -0.25]} material={glassMaterial}>
        <boxGeometry args={[0.04, 0.36, 1.4]} />
      </mesh>
      <mesh position={[-0.67, 0.42, -0.25]} material={glassMaterial}>
        <boxGeometry args={[0.04, 0.36, 1.4]} />
      </mesh>

      {/* Side Mirrors */}
      <group position={[0.78, 0.32, 0.55]}>
        <mesh material={paintMaterial}>
          <boxGeometry args={[0.18, 0.08, 0.12]} />
        </mesh>
        <mesh position={[0.08, 0, 0]} material={glassMaterial}>
          <boxGeometry args={[0.02, 0.06, 0.1]} />
        </mesh>
      </group>
      <group position={[-0.78, 0.32, 0.55]}>
        <mesh material={paintMaterial}>
          <boxGeometry args={[0.18, 0.08, 0.12]} />
        </mesh>
        <mesh position={[-0.08, 0, 0]} material={glassMaterial}>
          <boxGeometry args={[0.02, 0.06, 0.1]} />
        </mesh>
      </group>

      {/* ================= REAR SECTION & EXHAUST ================= */}
      {/* Rear Deck / Trunk */}
      <mesh position={[0, 0.12, -1.65]} material={paintMaterial} castShadow>
        <boxGeometry args={[1.76, 0.28, 0.9]} />
      </mesh>

      {/* Rear Taillight Continuous Lightbar */}
      <mesh position={[0, 0.12, -2.12]} material={taillightMaterial}>
        <boxGeometry args={[1.68, 0.08, 0.06]} />
      </mesh>

      {/* Rear Carbon Diffuser */}
      <mesh position={[0, -0.16, -2.05]} material={carbonMaterial} castShadow>
        <boxGeometry args={[1.82, 0.22, 0.25]} />
      </mesh>

      {/* Quad Exhaust Pipes */}
      {[-0.45, -0.28, 0.28, 0.45].map((x, i) => (
        <group key={i} position={[x, -0.14, -2.18]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.12, 12]} />
            <meshStandardMaterial color="#d0d7de" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Nitro Backfire Flame Cone */}
          {isNitro && (
            <mesh position={[0, 0, -0.35]} rotation={[-Math.PI / 2, 0, 0]} material={exhaustFlameMaterial}>
              <coneGeometry args={[0.09, 0.6, 8]} />
            </mesh>
          )}
        </group>
      ))}

      {/* ================= MODEL-SPECIFIC AERO PARTS ================= */}
      {/* Model 0: Apex GT - Sleek Supercar Rear Wing */}
      {carId === 'apex_gt' && (
        <group position={[0, 0.36, -1.8]}>
          {/* Wing Struts */}
          <mesh position={[0.45, 0.1, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.04, 0.28, 0.12]} />
          </mesh>
          <mesh position={[-0.45, 0.1, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.04, 0.28, 0.12]} />
          </mesh>
          {/* Carbon Wing Blade */}
          <mesh position={[0, 0.24, 0]} rotation={[-0.08, 0, 0]} material={carbonMaterial} castShadow>
            <boxGeometry args={[1.82, 0.04, 0.32]} />
          </mesh>
          {/* Wing Endplates */}
          <mesh position={[0.91, 0.24, 0]} material={paintMaterial}>
            <boxGeometry args={[0.02, 0.14, 0.34]} />
          </mesh>
          <mesh position={[-0.91, 0.24, 0]} material={paintMaterial}>
            <boxGeometry args={[0.02, 0.14, 0.34]} />
          </mesh>
        </group>
      )}

      {/* Model 1: Viper Muscle - Aggressive Hood Scoop & Ducktail */}
      {carId === 'viper_muscle' && (
        <>
          {/* Massive Hood Scoop */}
          <mesh position={[0, 0.3, 1.1]} material={carbonMaterial} castShadow>
            <boxGeometry args={[0.55, 0.14, 0.7]} />
          </mesh>
          <mesh position={[0, 0.3, 1.46]} material={trimMaterial}>
            <boxGeometry args={[0.48, 0.09, 0.03]} />
          </mesh>
          {/* Ducktail Rear Spoiler */}
          <mesh position={[0, 0.32, -2.05]} rotation={[0.42, 0, 0]} material={carbonMaterial} castShadow>
            <boxGeometry args={[1.72, 0.06, 0.24]} />
          </mesh>
        </>
      )}

      {/* Model 2: Phantom Hyper - Le Mans Shark Fin & Extreme High-Downforce GT Wing */}
      {carId === 'phantom_hyper' && (
        <>
          {/* Aerodynamic Roof Shark Fin */}
          <mesh position={[0, 0.58, -0.6]} material={carbonMaterial}>
            <boxGeometry args={[0.03, 0.3, 1.1]} />
          </mesh>
          {/* Front Bumper Aero Canards */}
          <mesh position={[0.88, 0.02, 2.0]} rotation={[0, 0.2, 0.2]} material={carbonMaterial}>
            <boxGeometry args={[0.22, 0.03, 0.24]} />
          </mesh>
          <mesh position={[-0.88, 0.02, 2.0]} rotation={[0, -0.2, -0.2]} material={carbonMaterial}>
            <boxGeometry args={[0.22, 0.03, 0.24]} />
          </mesh>
          {/* Extreme High-Mounted Carbon Wing */}
          <group position={[0, 0.52, -1.85]}>
            <mesh position={[0.55, 0.18, 0]} rotation={[0.1, 0, 0]} material={carbonMaterial}>
              <boxGeometry args={[0.04, 0.45, 0.12]} />
            </mesh>
            <mesh position={[-0.55, 0.18, 0]} rotation={[0.1, 0, 0]} material={carbonMaterial}>
              <boxGeometry args={[0.04, 0.45, 0.12]} />
            </mesh>
            <mesh position={[0, 0.4, 0]} rotation={[-0.14, 0, 0]} material={carbonMaterial} castShadow>
              <boxGeometry args={[1.96, 0.04, 0.42]} />
            </mesh>
            <mesh position={[0.98, 0.4, 0]} material={paintMaterial}>
              <boxGeometry args={[0.02, 0.22, 0.46]} />
            </mesh>
            <mesh position={[-0.98, 0.4, 0]} material={paintMaterial}>
              <boxGeometry args={[0.02, 0.22, 0.46]} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}

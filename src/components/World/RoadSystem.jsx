import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { createAsphaltTexture, createRacingCurbTexture } from '../../utils/proceduralTextures';

export function RoadSystem() {
  const asphaltTex = useMemo(() => {
    const tex = createAsphaltTexture();
    tex.repeat.set(1, 25);
    return tex;
  }, []);

  const highwayTex = useMemo(() => {
    const tex = createAsphaltTexture();
    tex.repeat.set(2, 40);
    return tex;
  }, []);

  const curbTex = useMemo(() => {
    const tex = createRacingCurbTexture();
    tex.repeat.set(1, 30);
    return tex;
  }, []);

  return (
    <group>
      {/* ================= SOLID RAPID GROUND COLLIDER ================= */}
      <RigidBody type="fixed" friction={0.8} restitution={0.1}>
        {/* Main Base Terrain (Grass & Field) */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[700, 700]} />
          <meshStandardMaterial color="#2d3b28" roughness={0.9} metalness={0.05} />
        </mesh>

        {/* ================= CITY GRID ROADS ================= */}
        {/* Main North-South Central Blvd (X = 0, Z from -220 to 220) */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 440]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} />
        </mesh>

        {/* Main East-West Central Ave (Z = 0, X from -220 to 220) */}
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
          <planeGeometry args={[14, 440]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} />
        </mesh>

        {/* North Grid Cross Street (Z = 80) */}
        <mesh position={[0, 0.02, 80]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
          <planeGeometry args={[12, 320]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} />
        </mesh>

        {/* South Grid Cross Street (Z = -80) */}
        <mesh position={[0, 0.02, -80]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
          <planeGeometry args={[12, 320]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} />
        </mesh>

        {/* West Grid Street (X = -80) */}
        <mesh position={[-80, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 320]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} />
        </mesh>

        {/* East Grid Street (X = 80) */}
        <mesh position={[80, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 320]} />
          <meshStandardMaterial map={asphaltTex} roughness={0.7} />
        </mesh>

        {/* ================= HIGHWAY / EXPRESSWAY ================= */}
        {/* 4-lane wide straight corridor for high speed & traffic drive */}
        <mesh position={[160, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[26, 600]} />
          <meshStandardMaterial map={highwayTex} roughness={0.65} />
        </mesh>

        {/* Highway Central Median Concrete Barrier */}
        <mesh position={[160, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.9, 600]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} />
        </mesh>

        {/* Highway Left Guard Rail */}
        <mesh position={[147, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.8, 600]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Highway Right Guard Rail */}
        <mesh position={[173, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.8, 600]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* ================= STUNT PARK & DRIFT ARENA (WEST) ================= */}
        {/* Giant Circular Drift Pad */}
        <mesh position={[-170, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[55, 36]} />
          <meshStandardMaterial color="#1f232b" roughness={0.75} />
        </mesh>

        {/* Red & White Curbs around Drift Arena */}
        <mesh position={[-170, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[54, 56, 36]} />
          <meshStandardMaterial map={curbTex} roughness={0.5} />
        </mesh>

        {/* Stunt Ramp 1 (Large Air Ramp) */}
        <mesh position={[-170, 1.8, -25]} rotation={[0.22, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 0.6, 18]} />
          <meshStandardMaterial color="#ff9800" roughness={0.4} metalness={0.3} />
        </mesh>

        {/* Stunt Ramp 2 (Speed Jump Ramp on Field) */}
        <mesh position={[-170, 1.5, 25]} rotation={[-0.22, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 0.6, 16]} />
          <meshStandardMaterial color="#00e5ff" roughness={0.4} metalness={0.3} />
        </mesh>

        {/* Stunt Ramp 3 (Side Quarter Pipe) */}
        <mesh position={[-210, 2.2, 0]} rotation={[0, 0, -0.28]} castShadow receiveShadow>
          <boxGeometry args={[16, 0.6, 20]} />
          <meshStandardMaterial color="#e91e63" roughness={0.4} metalness={0.3} />
        </mesh>
      </RigidBody>
    </group>
  );
}

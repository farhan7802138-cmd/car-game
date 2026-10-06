import React, { useRef } from 'react';
import * as THREE from 'three';

export function Wheel({ radius = 0.38, width = 0.28, isFront = false, isLeft = true }) {
  return (
    <group>
      {/* Outer Rubber Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, 24]} />
        <meshStandardMaterial
          color="#181a1f"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Tire Rim Bead */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.72, radius * 0.72, width * 1.02, 20]} />
        <meshStandardMaterial
          color="#0f1115"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Alloy Wheel Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[isLeft ? width * 0.05 : -width * 0.05, 0, 0]}>
        <cylinderGeometry args={[radius * 0.65, radius * 0.65, width * 0.6, 16]} />
        <meshStandardMaterial
          color="#d0d7de"
          roughness={0.25}
          metalness={0.88}
        />
      </mesh>

      {/* Rim Spokes Pattern (5-spoke star) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <mesh
            key={i}
            position={[isLeft ? width * 0.2 : -width * 0.2, Math.cos(angle) * radius * 0.35, Math.sin(angle) * radius * 0.35]}
            rotation={[angle, 0, Math.PI / 2]}
          >
            <boxGeometry args={[radius * 0.55, 0.04, 0.04]} />
            <meshStandardMaterial
              color="#e6edf3"
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
        );
      })}

      {/* Center Wheel Hub Nut */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[isLeft ? width * 0.28 : -width * 0.28, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 8]} />
        <meshStandardMaterial
          color="#ff2a55"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Ventilated Brake Disc Rotor (Behind Rim) */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[isLeft ? -width * 0.15 : width * 0.15, 0, 0]}>
        <cylinderGeometry args={[radius * 0.52, radius * 0.52, 0.02, 16]} />
        <meshStandardMaterial
          color="#8c959f"
          roughness={0.3}
          metalness={0.95}
        />
      </mesh>

      {/* High-Performance Red Racing Brake Caliper */}
      <mesh position={[isLeft ? -width * 0.15 : width * 0.15, radius * 0.35, 0.05]}>
        <boxGeometry args={[0.08, 0.14, 0.12]} />
        <meshStandardMaterial
          color="#ff1744"
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

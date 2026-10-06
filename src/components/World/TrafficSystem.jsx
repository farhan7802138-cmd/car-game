import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

const TRAFFIC_CARS_COUNT = 14;

export function TrafficSystem() {
  const gameMode = useGameStore((s) => s.gameMode);
  const gameState = useGameStore((s) => s.gameState);
  const telemetry = useGameStore((s) => s.telemetry);
  const triggerNearMiss = useGameStore((s) => s.triggerNearMiss);
  const triggerTrafficCrash = useGameStore((s) => s.triggerTrafficCrash);

  // Initialize pool of AI traffic cars
  const trafficData = useMemo(() => {
    const lanes = [
      { x: 151.5, dir: -1 }, // Southbound fast lane
      { x: 155.5, dir: -1 }, // Southbound slow lane
      { x: 164.5, dir: 1 },  // Northbound slow lane
      { x: 168.5, dir: 1 },  // Northbound fast lane
    ];

    const carColors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#6b7280', '#ffffff'];

    return Array.from({ length: TRAFFIC_CARS_COUNT }, (_, i) => {
      const lane = lanes[i % lanes.length];
      const z = -220 + (i * 35) + (Math.random() * 15);
      const speed = (lane.dir === 1 ? 16 : -16) + (Math.random() - 0.5) * 6; // ~50-80 km/h

      return {
        id: i,
        pos: new THREE.Vector3(lane.x, 0.45, z),
        laneX: lane.x,
        speed, // m/s
        dir: lane.dir,
        color: carColors[i % carColors.length],
        scoredNearMiss: false,
        length: 4.2,
        width: 1.8,
        height: 1.3,
      };
    });
  }, []);

  const carGroupRefs = useRef([]);

  useFrame((_, delta) => {
    if (gameState !== 'playing') return;

    const dt = Math.min(delta, 0.05);
    const playerPos = new THREE.Vector3(...telemetry.position);
    const playerSpeed = telemetry.speed || 0;

    trafficData.forEach((car, idx) => {
      // Advance AI vehicle
      car.pos.z += car.speed * dt;

      // Wrap around highway loop
      if (car.dir === 1 && car.pos.z > 260) {
        car.pos.z = -260;
        car.scoredNearMiss = false;
      } else if (car.dir === -1 && car.pos.z < -260) {
        car.pos.z = 260;
        car.scoredNearMiss = false;
      }

      // Update 3D visual position
      const grp = carGroupRefs.current[idx];
      if (grp) {
        grp.position.copy(car.pos);
        grp.rotation.y = car.dir === 1 ? 0 : Math.PI;
      }

      // Collision & Near-Miss check
      const dist = playerPos.distanceTo(car.pos);

      // Direct Crash
      if (dist < 2.4) {
        if (gameMode === 'traffic') {
          triggerTrafficCrash();
        }
      }
      // Near-Miss (within 2.5m - 4.8m while passing at > 45 km/h)
      else if (dist < 4.8 && dist >= 2.5 && !car.scoredNearMiss && playerSpeed > 45) {
        car.scoredNearMiss = true;
        triggerNearMiss(dist);
      } else if (dist > 18) {
        // Reset near-miss flag once far away
        car.scoredNearMiss = false;
      }
    });
  });

  return (
    <group>
      {trafficData.map((car, idx) => (
        <group
          key={car.id}
          ref={(el) => (carGroupRefs.current[idx] = el)}
          position={[car.pos.x, car.pos.y, car.pos.z]}
        >
          {/* Main Car Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[car.width, 0.6, car.length]} />
            <meshStandardMaterial color={car.color} roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Cabin Roof & Windows */}
          <mesh position={[0, 0.48, -0.2]} castShadow>
            <boxGeometry args={[car.width * 0.88, 0.45, car.length * 0.55]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.5} />
          </mesh>

          {/* Front Headlights */}
          <mesh position={[0.6, 0.05, car.length / 2]}>
            <boxGeometry args={[0.3, 0.12, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.8} />
          </mesh>
          <mesh position={[-0.6, 0.05, car.length / 2]}>
            <boxGeometry args={[0.3, 0.12, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.8} />
          </mesh>

          {/* Rear Taillights */}
          <mesh position={[0.6, 0.05, -car.length / 2]}>
            <boxGeometry args={[0.3, 0.12, 0.05]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[-0.6, 0.05, -car.length / 2]}>
            <boxGeometry args={[0.3, 0.12, 0.05]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1.5} />
          </mesh>

          {/* 4 Wheels */}
          {[-car.width / 2, car.width / 2].map((x, xi) =>
            [-car.length * 0.32, car.length * 0.32].map((z, zi) => (
              <mesh key={`${xi}-${zi}`} position={[x, -0.15, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.34, 0.34, 0.22, 12]} />
                <meshStandardMaterial color="#1f2937" roughness={0.8} />
              </mesh>
            ))
          )}
        </group>
      ))}
    </group>
  );
}

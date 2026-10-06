import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export const CHECKPOINTS_LIST = [
  { id: 0, pos: [0, 2.2, 40], rotY: 0, label: 'START / CP 1' },
  { id: 1, pos: [0, 2.2, 120], rotY: 0, label: 'CP 2' },
  { id: 2, pos: [40, 2.2, 80], rotY: Math.PI / 2, label: 'CP 3' },
  { id: 3, pos: [160, 2.2, 60], rotY: Math.PI, label: 'HIGHWAY ENTRY' },
  { id: 4, pos: [160, 2.2, -40], rotY: Math.PI, label: 'SPEED TRAP' },
  { id: 5, pos: [160, 2.2, -140], rotY: Math.PI, label: 'CP 6' },
  { id: 6, pos: [60, 2.2, -80], rotY: -Math.PI / 2, label: 'CP 7' },
  { id: 7, pos: [0, 2.2, -80], rotY: -Math.PI / 2, label: 'CITY CROSS' },
  { id: 8, pos: [-80, 2.2, -40], rotY: 0, label: 'CP 9' },
  { id: 9, pos: [-170, 2.2, 0], rotY: Math.PI / 2, label: 'DRIFT ARENA' },
  { id: 10, pos: [-80, 2.2, 60], rotY: 0, label: 'CP 11' },
  { id: 11, pos: [0, 2.2, 0], rotY: 0, label: 'FINISH LINE' },
];

export function Checkpoints() {
  const gameMode = useGameStore((s) => s.gameMode);
  const timeTrial = useGameStore((s) => s.timeTrial);
  const telemetry = useGameStore((s) => s.telemetry);
  const reachCheckpoint = useGameStore((s) => s.reachCheckpoint);
  const updateTimeTrialTimer = useGameStore((s) => s.updateTimeTrialTimer);

  const ringPulseRef = useRef(0);

  useFrame((_, delta) => {
    if (gameMode !== 'timeTrial' || !timeTrial.isRunning) return;

    ringPulseRef.current += delta * 3;
    updateTimeTrialTimer(delta);

    // Test car proximity to current checkpoint
    const currentCp = CHECKPOINTS_LIST[timeTrial.currentCheckpoint];
    if (currentCp) {
      const carPos = new THREE.Vector3(...telemetry.position);
      const cpPos = new THREE.Vector3(...currentCp.pos);
      const dist = carPos.distanceTo(cpPos);

      // Trigger radius: 9 meters
      if (dist < 9.0) {
        reachCheckpoint(timeTrial.currentCheckpoint);
      }
    }
  });

  if (gameMode !== 'timeTrial') return null;

  return (
    <group>
      {CHECKPOINTS_LIST.map((cp, idx) => {
        const isCurrent = idx === timeTrial.currentCheckpoint;
        const isPassed = idx < timeTrial.currentCheckpoint;
        const isFinish = idx === CHECKPOINTS_LIST.length - 1;

        // Visual coloring
        let ringColor = '#1e3a8a';
        let emissiveColor = '#3b82f6';
        let emissiveIntensity = 0.5;

        if (isCurrent) {
          ringColor = isFinish ? '#eab308' : '#06b6d4';
          emissiveColor = isFinish ? '#facc15' : '#22d3ee';
          emissiveIntensity = 3.0;
        } else if (isPassed) {
          ringColor = '#10b981';
          emissiveColor = '#34d399';
          emissiveIntensity = 1.0;
        }

        return (
          <group key={cp.id} position={cp.pos} rotation={[0, cp.rotY, 0]}>
            {/* Holographic Checkpoint Torus Gate */}
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[5.5, 0.22, 12, 32]} />
              <meshStandardMaterial
                color={ringColor}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                roughness={0.2}
                transparent
                opacity={isCurrent ? 0.95 : isPassed ? 0.4 : 0.65}
              />
            </mesh>

            {/* Inner Pulsating Target Marker for current checkpoint */}
            {isCurrent && (
              <mesh scale={[1 + Math.sin(ringPulseRef.current) * 0.08, 1 + Math.sin(ringPulseRef.current) * 0.08, 1]}>
                <ringGeometry args={[4.2, 4.4, 32]} />
                <meshBasicMaterial
                  color={emissiveColor}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}

            {/* Gate Stanchions / Base Beams */}
            <mesh position={[-5.5, -1.2, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 2.5, 8]} />
              <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[5.5, -1.2, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 2.5, 8]} />
              <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

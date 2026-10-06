import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_PARTICLES = 40;

export function TireSmoke({ active = false, wheelPositions = [] }) {
  const meshRef = useRef();

  // Particle pool state
  const particles = useMemo(() => {
    return Array.from({ length: MAX_PARTICLES }, () => ({
      pos: new THREE.Vector3(0, -999, 0),
      vel: new THREE.Vector3(0, 0, 0),
      scale: 0.1,
      opacity: 0,
      life: 0,
      maxLife: 0.8,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const spawnCooldown = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    spawnCooldown.current += delta;

    // Emit new smoke if drifting / burning out
    if (active && spawnCooldown.current > 0.035 && wheelPositions.length >= 2) {
      spawnCooldown.current = 0;
      wheelPositions.forEach((wheelPos) => {
        // Find dead particle
        const p = particles.find((item) => item.life <= 0);
        if (p && wheelPos) {
          p.pos.copy(wheelPos);
          p.pos.y = Math.max(0.08, p.pos.y - 0.25);
          p.vel.set(
            (Math.random() - 0.5) * 1.5,
            0.6 + Math.random() * 0.8,
            (Math.random() - 0.5) * 1.5
          );
          p.scale = 0.2 + Math.random() * 0.15;
          p.opacity = 0.45;
          p.life = 0.75 + Math.random() * 0.25;
          p.maxLife = p.life;
        }
      });
    }

    // Update particles
    particles.forEach((p, i) => {
      if (p.life > 0) {
        p.life -= delta;
        p.pos.addScaledVector(p.vel, delta);
        p.scale += delta * 1.4; // Expand puff
        const progress = 1 - p.life / p.maxLife;
        p.opacity = Math.max(0, 0.45 * (1 - progress));

        dummy.position.copy(p.pos);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.position.set(0, -999, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, MAX_PARTICLES]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.3, 6, 6]} />
      <meshBasicMaterial
        color="#d1d5db"
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_SKID_SEGMENTS = 60;

export function SkidMarks({ active = false, wheelPositions = [] }) {
  const meshRef = useRef();

  const skids = useMemo(() => {
    return Array.from({ length: MAX_SKID_SEGMENTS }, () => ({
      pos: new THREE.Vector3(0, -999, 0),
      rotY: 0,
      life: 0,
      opacity: 0,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const spawnTimer = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    spawnTimer.current += delta;

    if (active && spawnTimer.current > 0.05 && wheelPositions.length >= 2) {
      spawnTimer.current = 0;
      wheelPositions.forEach((pos) => {
        const seg = skids.find((s) => s.life <= 0);
        if (seg && pos) {
          seg.pos.set(pos.x, 0.035, pos.z);
          seg.rotY = Math.atan2(pos.x, pos.z);
          seg.life = 4.0; // Stay for 4 seconds
          seg.opacity = 0.55;
        }
      });
    }

    // Decay and update matrix
    skids.forEach((seg, i) => {
      if (seg.life > 0) {
        seg.life -= delta;
        dummy.position.copy(seg.pos);
        dummy.rotation.set(-Math.PI / 2, 0, seg.rotY);
        dummy.scale.set(0.3, 0.7, 1);
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
      args={[null, null, MAX_SKID_SEGMENTS]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#15171c"
        transparent
        opacity={0.5}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </instancedMesh>
  );
}

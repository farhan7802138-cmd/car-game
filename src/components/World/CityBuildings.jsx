import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { createBuildingTexture } from '../../utils/proceduralTextures';
import { useGameStore } from '../../store/useGameStore';

export function CityBuildings() {
  const isNight = useGameStore((s) => s.isNight);
  const buildingTex = useMemo(() => createBuildingTexture(isNight), [isNight]);

  // Deterministically generate building block layouts
  const { buildings, colliderBlocks } = useMemo(() => {
    const list = [];
    const colliders = [];

    // City grid zones (avoiding road corridors X, Z around 0, +-80, and highway at X=160)
    const blocks = [
      // Sector Quadrant 1 (North-East, between central road and highway)
      { minX: 18, maxX: 68, minZ: 18, maxZ: 68 },
      { minX: 92, maxX: 142, minZ: 18, maxZ: 68 },
      { minX: 18, maxX: 68, minZ: 92, maxZ: 180 },
      { minX: 92, maxX: 142, minZ: 92, maxZ: 180 },

      // Sector Quadrant 2 (South-East, between central road and highway)
      { minX: 18, maxX: 68, minZ: -180, maxZ: -92 },
      { minX: 92, maxX: 142, minZ: -180, maxZ: -92 },
      { minX: 18, maxX: 68, minZ: -68, maxZ: -18 },
      { minX: 92, maxX: 142, minZ: -68, maxZ: -18 },

      // Sector Quadrant 3 (North-West)
      { minX: -68, maxX: -18, minZ: 18, maxZ: 68 },
      { minX: -142, maxX: -92, minZ: 18, maxZ: 68 },
      { minX: -68, maxX: -18, minZ: 92, maxZ: 180 },
      { minX: -142, maxX: -92, minZ: 92, maxZ: 180 },

      // Sector Quadrant 4 (South-West)
      { minX: -68, maxX: -18, minZ: -68, maxZ: -18 },
      { minX: -142, maxX: -92, minZ: -68, maxZ: -18 },
      { minX: -68, maxX: -18, minZ: -180, maxZ: -92 },
      { minX: -142, maxX: -92, minZ: -180, maxZ: -92 },
    ];

    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    blocks.forEach((blk) => {
      const stepX = 22;
      const stepZ = 24;

      for (let x = blk.minX + 8; x <= blk.maxX - 8; x += stepX) {
        for (let z = blk.minZ + 8; z <= blk.maxZ - 8; z += stepZ) {
          const width = 16 + pseudoRandom() * 6;
          const depth = 16 + pseudoRandom() * 6;
          const height = 24 + pseudoRandom() * 65; // Tall skyscrapers

          list.push({
            x,
            z,
            width,
            depth,
            height,
          });

          colliders.push({
            pos: [x, height / 2, z],
            halfArgs: [width / 2, height / 2, depth / 2],
          });
        }
      }
    });

    return { buildings: list, colliderBlocks: colliders };
  }, []);

  // Compute instanced transforms
  const instancedMeshRef = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        map: buildingTex,
        roughness: 0.3,
        metalness: 0.4,
      }),
      buildings.length
    );

    const dummy = new THREE.Object3D();
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.height / 2, b.z);
      dummy.scale.set(b.width, b.height, b.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }, [buildings, buildingTex]);

  return (
    <group>
      {/* 1. Visual Instanced Mesh of all Skyscrapers */}
      <primitive object={instancedMeshRef} />

      {/* 2. Static Rapier Colliders for physical car crashes against buildings */}
      <RigidBody type="fixed" colliders={false}>
        {colliderBlocks.map((c, i) => (
          <CuboidCollider key={i} position={c.pos} args={c.halfArgs} />
        ))}
      </RigidBody>
    </group>
  );
}

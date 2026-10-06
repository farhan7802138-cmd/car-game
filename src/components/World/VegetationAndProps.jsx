import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export function VegetationAndProps() {
  const isNight = useGameStore((s) => s.isNight);

  // Generate tree locations along roads and open parks
  const { treeTransforms, lampTransforms } = useMemo(() => {
    const trees = [];
    const lamps = [];

    // Lining North-South Avenue (X = -8.5 and +8.5)
    for (let z = -200; z <= 200; z += 18) {
      if (Math.abs(z) > 10 && Math.abs(z - 80) > 10 && Math.abs(z + 80) > 10) {
        trees.push({ x: -8.8, y: 0, z, scale: 0.85 + Math.random() * 0.3 });
        trees.push({ x: 8.8, y: 0, z, scale: 0.85 + Math.random() * 0.3 });

        if (z % 36 === 0) {
          lamps.push({ x: -8.2, y: 0, z, rotY: Math.PI / 2 });
          lamps.push({ x: 8.2, y: 0, z, rotY: -Math.PI / 2 });
        }
      }
    }

    // Lining East-West Avenue (Z = -8.5 and +8.5)
    for (let x = -200; x <= 140; x += 18) {
      if (Math.abs(x) > 10 && Math.abs(x - 80) > 10 && Math.abs(x + 80) > 10) {
        trees.push({ x, y: 0, z: -8.8, scale: 0.8 + Math.random() * 0.3 });
        trees.push({ x, y: 0, z: 8.8, scale: 0.8 + Math.random() * 0.3 });

        if (x % 36 === 0) {
          lamps.push({ x, y: 0, z: -8.2, rotY: 0 });
          lamps.push({ x, y: 0, z: 8.2, rotY: Math.PI });
        }
      }
    }

    // Scattered trees in open field around Stunt Park (X < -120)
    for (let i = 0; i < 45; i++) {
      const angle = (i / 45) * Math.PI * 2;
      const radius = 68 + (i % 5) * 12;
      const x = -170 + Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      if (x > -320 && x < -100 && z > -250 && z < 250) {
        trees.push({ x, y: 0, z, scale: 0.9 + (i % 3) * 0.2 });
      }
    }

    return { treeTransforms: trees, lampTransforms: lamps };
  }, []);

  // Instanced Meshes for Tree Trunks & Foliage
  const trunkMesh = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.2, 0.28, 2.8, 6),
      new THREE.MeshStandardMaterial({ color: '#4e3629', roughness: 0.85 }),
      treeTransforms.length
    );
    const dummy = new THREE.Object3D();
    treeTransforms.forEach((t, i) => {
      dummy.position.set(t.x, 1.4 * t.scale, t.z);
      dummy.scale.set(t.scale, t.scale, t.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    return mesh;
  }, [treeTransforms]);

  const foliageMesh = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1.5, 1),
      new THREE.MeshStandardMaterial({ color: '#2e7d32', roughness: 0.75, flatShading: true }),
      treeTransforms.length
    );
    const dummy = new THREE.Object3D();
    treeTransforms.forEach((t, i) => {
      dummy.position.set(t.x, 3.4 * t.scale, t.z);
      dummy.scale.set(t.scale, t.scale * 1.2, t.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    return mesh;
  }, [treeTransforms]);

  // Instanced Street Lamp Posts
  const lampPoleMesh = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.08, 0.1, 4.8, 8),
      new THREE.MeshStandardMaterial({ color: '#374151', metalness: 0.8, roughness: 0.3 }),
      lampTransforms.length
    );
    const dummy = new THREE.Object3D();
    lampTransforms.forEach((l, i) => {
      dummy.position.set(l.x, 2.4, l.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, [lampTransforms]);

  const lampBulbMesh = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.22, 8, 8),
      new THREE.MeshStandardMaterial({
        color: '#fff3bf',
        emissive: new THREE.Color('#ffe066'),
        emissiveIntensity: isNight ? 2.5 : 0.8,
        roughness: 0.1,
      }),
      lampTransforms.length
    );
    const dummy = new THREE.Object3D();
    lampTransforms.forEach((l, i) => {
      dummy.position.set(l.x, 4.8, l.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, [lampTransforms, isNight]);

  return (
    <group>
      <primitive object={trunkMesh} />
      <primitive object={foliageMesh} />
      <primitive object={lampPoleMesh} />
      <primitive object={lampBulbMesh} />
    </group>
  );
}

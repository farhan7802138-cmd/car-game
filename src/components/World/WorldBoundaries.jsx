import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export function WorldBoundaries() {
  const BOUND = 340;
  const WALL_HEIGHT = 15;
  const THICKNESS = 10;

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* North Boundary */}
      <CuboidCollider position={[0, WALL_HEIGHT / 2, BOUND]} args={[BOUND, WALL_HEIGHT / 2, THICKNESS]} />
      {/* South Boundary */}
      <CuboidCollider position={[0, WALL_HEIGHT / 2, -BOUND]} args={[BOUND, WALL_HEIGHT / 2, THICKNESS]} />
      {/* East Boundary */}
      <CuboidCollider position={[BOUND, WALL_HEIGHT / 2, 0]} args={[THICKNESS, WALL_HEIGHT / 2, BOUND]} />
      {/* West Boundary */}
      <CuboidCollider position={[-BOUND, WALL_HEIGHT / 2, 0]} args={[THICKNESS, WALL_HEIGHT / 2, BOUND]} />
    </RigidBody>
  );
}

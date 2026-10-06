import React from 'react';
import { EnvironmentLighting } from './EnvironmentLighting';
import { RoadSystem } from './RoadSystem';
import { CityBuildings } from './CityBuildings';
import { VegetationAndProps } from './VegetationAndProps';
import { WorldBoundaries } from './WorldBoundaries';
import { Checkpoints } from './Checkpoints';
import { TrafficSystem } from './TrafficSystem';

export function World() {
  return (
    <group>
      {/* Lighting and Sky/Fog */}
      <EnvironmentLighting />

      {/* Roads and Physical Ground */}
      <RoadSystem />

      {/* City Skyscrapers with Colliders */}
      <CityBuildings />

      {/* Low-Poly Trees and Street Lamps */}
      <VegetationAndProps />

      {/* Invisible Perimeter Barriers */}
      <WorldBoundaries />

      {/* Time Trial Checkpoint Rings */}
      <Checkpoints />

      {/* Dynamic Highway AI Traffic */}
      <TrafficSystem />
    </group>
  );
}

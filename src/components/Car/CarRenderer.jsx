import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { ProceduralCar } from './ProceduralCar';

// Subcomponent that tries to load GLTF
function GLTFModel({ url, color }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene.clone()} />;
}

export function CarRenderer({ carDef, color, isNight, isNitro }) {
  // If model path is configured, we can render procedural by default or try GLTF with fallback
  // Since GLTF models are optional user-supplied drops, we can provide an ErrorBoundary/fallback wrapper:
  return (
    <ProceduralCar
      carId={carDef.id}
      color={color}
      isNight={isNight}
      isNitro={isNitro}
    />
  );
}

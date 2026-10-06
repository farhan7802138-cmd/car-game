import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export function EnvironmentLighting() {
  const isNight = useGameStore((s) => s.isNight);
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);

  const enableShadows = graphicsQuality === 'high';

  return (
    <>
      {/* Sky color / Fog */}
      <color attach="background" args={[isNight ? '#050814' : '#7db4e6']} />
      <fog
        attach="fog"
        args={[isNight ? '#050814' : '#a8ceee', isNight ? 30 : 60, isNight ? 350 : 600]}
      />

      {/* Ambient Fill */}
      <ambientLight
        color={isNight ? '#101d36' : '#d2e4f7'}
        intensity={isNight ? 0.35 : 0.85}
      />

      {/* Main Directional Sun / Moon Light */}
      <directionalLight
        position={isNight ? [80, 120, -60] : [120, 160, 80]}
        intensity={isNight ? 0.5 : 2.2}
        color={isNight ? '#638bbb' : '#fff5e6'}
        castShadow={enableShadows}
        shadow-mapSize-width={enableShadows ? 2048 : 512}
        shadow-mapSize-height={enableShadows ? 2048 : 512}
        shadow-camera-near={10}
        shadow-camera-far={450}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-bias={-0.0005}
      />

      {/* Secondary Soft Hemisphere Light */}
      <hemisphereLight
        args={[
          isNight ? '#0d182b' : '#c3e0fc',
          isNight ? '#03050a' : '#5c7860',
          isNight ? 0.3 : 0.6,
        ]}
      />
    </>
  );
}

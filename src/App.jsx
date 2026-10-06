import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useGameStore } from './store/useGameStore';
import { useControls } from './hooks/useControls';
import { World } from './components/World/World';
import { Car } from './components/Car/Car';
import { CameraController } from './components/Camera/CameraController';
import { PerformanceHandler } from './components/World/PerformanceHandler';
import { HUD } from './components/HUD/HUD';
import { MainMenu } from './components/Menu/MainMenu';
import { CarSelect } from './components/Menu/CarSelect';
import { PauseModal } from './components/Menu/PauseModal';
import { ResultsModal } from './components/Menu/ResultsModal';
import { SettingsModal } from './components/Menu/SettingsModal';
import { RotateOverlay } from './components/Menu/RotateOverlay';
import { LoadingScreen } from './components/Menu/LoadingScreen';

export default function App() {
  const gameState = useGameStore((s) => s.gameState);
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);

  // Initialize input listeners
  useControls();

  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [dpr, setDpr] = useState(() => (window.innerWidth < 800 ? 1.25 : 1.5));

  // Determine shadow rendering
  const enableShadows = graphicsQuality === 'high';

  return (
    <div className="game-root">
      {/* 3D WebGL Canvas Viewport */}
      <Canvas
        shadows={enableShadows}
        dpr={[1, dpr]}
        camera={{ position: [0, 4, -9], fov: 60, near: 0.1, far: 800 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: graphicsQuality !== 'low',
          depth: true,
          stencil: false,
        }}
      >
        <Suspense fallback={null}>
          <PerformanceHandler setDpr={setDpr} />

          {/* Rapier Physics Simulation */}
          <Physics gravity={[0, -9.81, 0]}>
            {/* 3D City, Roads, Buildings, Highway, Traffic, Stunt Park */}
            <World />

            {/* Dynamic Raycast Suspension Player Car */}
            <Car position={[0, 1.2, 0]} rotation={[0, 0, 0]} />
          </Physics>

          {/* Third Person & Cockpit Camera Controller */}
          <CameraController />
        </Suspense>
      </Canvas>

      {/* ================= 2D UI & HUD LAYERS ================= */}
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onLoaded={() => setIsLoading(false)} />}

      {/* Main Menu */}
      {!isLoading && gameState === 'menu' && (
        <MainMenu onOpenSettings={() => setShowSettings(true)} />
      )}

      {/* Vehicle Showroom & Customizer */}
      {!isLoading && gameState === 'carSelect' && <CarSelect />}

      {/* In-Game Racing Telemetry HUD & Mobile Pedals */}
      {!isLoading && gameState === 'playing' && <HUD />}

      {/* Pause Menu Modal */}
      {!isLoading && <PauseModal />}

      {/* Race Results & Records Screen */}
      {!isLoading && <ResultsModal />}

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Mobile Portrait Rotation Prompt */}
      <RotateOverlay />
    </div>
  );
}

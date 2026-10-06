import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { SpeedometerGauge } from './SpeedometerGauge';
import { NitroBar } from './NitroBar';
import { Minimap } from './Minimap';
import { ModeOverlays } from './ModeOverlays';
import { MobileControls } from '../Controls/MobileControls';
import { isMobileDevice } from '../../utils/device';
import {
  Pause,
  Camera,
  RotateCcw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from 'lucide-react';

export function HUD() {
  const gameState = useGameStore((s) => s.gameState);
  const gameMode = useGameStore((s) => s.gameMode);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const switchCamera = useGameStore((s) => s.switchCamera);
  const resetCar = useGameStore((s) => s.resetCar);
  const toggleDayNight = useGameStore((s) => s.toggleDayNight);
  const isNight = useGameStore((s) => s.isNight);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const isMuted = useGameStore((s) => s.isMuted);
  const showDebug = useGameStore((s) => s.showDebug);
  const fps = useGameStore((s) => s.fps);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    const onResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (gameState !== 'playing') return null;

  return (
    <div className={`game-hud-overlay ${isMobile ? 'hud-mobile-mode' : 'hud-desktop-mode'}`}>
      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="hud-top-bar">
        {/* Quick Game Actions (Left) */}
        <div className="hud-top-left">
          <button
            className="hud-action-btn"
            onClick={pauseGame}
            title="Pause Game (Esc)"
            type="button"
          >
            <Pause size={18} />
          </button>

          <button
            className="hud-action-btn"
            onClick={switchCamera}
            title="Switch Camera (C)"
            type="button"
          >
            <Camera size={18} />
          </button>

          <button
            className="hud-action-btn"
            onClick={resetCar}
            title="Reset / Respawn Car (R)"
            type="button"
          >
            <RotateCcw size={18} />
          </button>

          <button
            className="hud-action-btn"
            onClick={toggleDayNight}
            title="Toggle Day / Night"
            type="button"
          >
            {isNight ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="hud-action-btn"
            onClick={toggleMute}
            title="Toggle Audio Mute"
            type="button"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            className="hud-action-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            type="button"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          <div className="mode-pill-tag">
            {gameMode === 'free' && 'FREE ROAM'}
            {gameMode === 'timeTrial' && 'TIME TRIAL'}
            {gameMode === 'traffic' && 'TRAFFIC HIGHWAY'}
          </div>
        </div>

        {/* Minimap & FPS Counter (Right) */}
        <div className="hud-top-right">
          {showDebug && (
            <div className="fps-counter-badge">
              <span>{Math.round(fps)} FPS</span>
            </div>
          )}
          <Minimap />
        </div>
      </div>

      {/* ================= MODE SPECIFIC OVERLAYS ================= */}
      <ModeOverlays />

      {/* ================= TELEMETRY SPEEDOMETER CLUSTER ================= */}
      <div className="hud-bottom-right">
        <NitroBar />
        <SpeedometerGauge />
      </div>

      {/* ================= TOUCH PEDALS & STEERING (MOBILE ONLY) ================= */}
      {isMobile && <MobileControls />}
    </div>
  );
}

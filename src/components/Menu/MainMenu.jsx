import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Play, Compass, Timer, Car, Settings, Download, Trophy } from 'lucide-react';
import { CAR_DEFINITIONS } from '../../utils/carDefinitions';

export function MainMenu({ onOpenSettings }) {
  const setGameState = useGameStore((s) => s.setGameState);
  const startGame = useGameStore((s) => s.startGame);
  const selectedCarIndex = useGameStore((s) => s.selectedCarIndex);
  const highScores = useGameStore((s) => s.highScores);
  const bestTimes = useGameStore((s) => s.bestTimes);

  const { isInstallable, promptInstall } = usePWAInstall();
  const currentCar = CAR_DEFINITIONS[selectedCarIndex] || CAR_DEFINITIONS[0];

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="menu-backdrop">
      <div className="main-menu-card">
        {/* Title Header */}
        <div className="menu-header">
          <div className="brand-pill">NEXT-GEN 3D DRIVING SIMULATOR</div>
          <h1 className="game-title">
            APEX <span>DRIFT 3D</span>
          </h1>
          <p className="game-subtitle">
            Realistic Rapier Physics &bull; Open World &bull; Time Attack &bull; Highway Traffic
          </p>
        </div>

        {/* Selected Vehicle Badge */}
        <div className="selected-car-banner" onClick={() => setGameState('carSelect')}>
          <div className="car-banner-info">
            <span className="car-banner-tag">{currentCar.type}</span>
            <span className="car-banner-name">{currentCar.name}</span>
          </div>
          <button className="change-car-btn">
            <Car size={16} />
            <span>CUSTOMIZE / GARAGE</span>
          </button>
        </div>

        {/* Game Mode Selection Grid */}
        <div className="modes-grid">
          {/* Free Roam */}
          <div className="mode-card" onClick={() => startGame('free')}>
            <div className="mode-icon-wrap bg-cyan">
              <Compass size={28} />
            </div>
            <div className="mode-info">
              <h3>Free Roam</h3>
              <p>Explore the full city, test speed on the highway, and hit stunt ramps in the drift park.</p>
            </div>
            <button className="mode-play-btn">
              <Play size={16} />
              <span>PLAY</span>
            </button>
          </div>

          {/* Time Trial */}
          <div className="mode-card" onClick={() => startGame('timeTrial')}>
            <div className="mode-icon-wrap bg-amber">
              <Timer size={28} />
            </div>
            <div className="mode-info">
              <h3>Time Trial</h3>
              <p>Race against the clock across 12 street and highway checkpoints.</p>
              {bestTimes.timeTrial && (
                <span className="record-snippet">
                  <Trophy size={12} /> Record: {formatTime(bestTimes.timeTrial)}
                </span>
              )}
            </div>
            <button className="mode-play-btn">
              <Play size={16} />
              <span>RACE</span>
            </button>
          </div>

          {/* Traffic Highway */}
          <div className="mode-card" onClick={() => startGame('traffic')}>
            <div className="mode-icon-wrap bg-rose">
              <Car size={28} />
            </div>
            <div className="mode-info">
              <h3>Traffic Drive</h3>
              <p>Weave through busy multi-lane highway traffic and score huge near-miss combos.</p>
              {highScores.trafficDrive?.score > 0 && (
                <span className="record-snippet">
                  <Trophy size={12} /> High Score: {highScores.trafficDrive.score.toLocaleString()}
                </span>
              )}
            </div>
            <button className="mode-play-btn">
              <Play size={16} />
              <span>DRIVE</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="menu-footer-actions">
          <button className="footer-btn" onClick={onOpenSettings}>
            <Settings size={18} />
            <span>SETTINGS</span>
          </button>

          {isInstallable && (
            <button className="footer-btn install-btn" onClick={promptInstall}>
              <Download size={18} />
              <span>INSTALL APP (PWA)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { SettingsModal } from './SettingsModal';
import { Play, RotateCcw, Car, Settings, Home } from 'lucide-react';

export function PauseModal() {
  const gameState = useGameStore((s) => s.gameState);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const startGame = useGameStore((s) => s.startGame);
  const setGameState = useGameStore((s) => s.setGameState);
  const gameMode = useGameStore((s) => s.gameMode);

  const [showSettings, setShowSettings] = useState(false);

  if (gameState !== 'paused') return null;

  return (
    <>
      <div className="modal-backdrop">
        <div className="pause-modal-card">
          <div className="pause-header">
            <h2>GAME PAUSED</h2>
            <p>Take a breath and get ready to hit the tarmac</p>
          </div>

          <div className="pause-actions-list">
            <button className="pause-btn primary-pause-btn" onClick={resumeGame}>
              <Play size={18} />
              <span>RESUME DRIVING</span>
            </button>

            <button className="pause-btn" onClick={() => startGame(gameMode)}>
              <RotateCcw size={18} />
              <span>RESTART RUN</span>
            </button>

            <button className="pause-btn" onClick={() => setGameState('carSelect')}>
              <Car size={18} />
              <span>SELECT VEHICLE</span>
            </button>

            <button className="pause-btn" onClick={() => setShowSettings(true)}>
              <Settings size={18} />
              <span>SETTINGS</span>
            </button>

            <button className="pause-btn danger-pause-btn" onClick={() => setGameState('menu')}>
              <Home size={18} />
              <span>MAIN MENU</span>
            </button>
          </div>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Trophy, Timer, Car, RotateCcw, Home, Sparkles } from 'lucide-react';

function formatTime(seconds) {
  if (!seconds) return '--:--.--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function ResultsModal() {
  const gameState = useGameStore((s) => s.gameState);
  const gameMode = useGameStore((s) => s.gameMode);
  const timeTrial = useGameStore((s) => s.timeTrial);
  const trafficDrive = useGameStore((s) => s.trafficDrive);
  const bestTimes = useGameStore((s) => s.bestTimes);
  const highScores = useGameStore((s) => s.highScores);
  const startGame = useGameStore((s) => s.startGame);
  const setGameState = useGameStore((s) => s.setGameState);

  if (gameState !== 'results') return null;

  const isTimeTrial = gameMode === 'timeTrial';
  const isTraffic = gameMode === 'traffic';

  return (
    <div className="modal-backdrop">
      <div className="results-modal-card">
        {/* Banner */}
        <div className="results-header">
          {((isTimeTrial && timeTrial.isNewRecord) || (isTraffic && trafficDrive.isNewRecord)) && (
            <div className="new-record-pill">
              <Sparkles size={16} />
              <span>NEW PERSONAL RECORD!</span>
            </div>
          )}

          <h2>{isTimeTrial ? 'TIME TRIAL COMPLETE' : isTraffic ? 'CRASH / DRIVE OVER' : 'RUN COMPLETE'}</h2>
          <p>{isTimeTrial ? 'All checkpoints cleared in record time!' : 'Highway traffic run terminated.'}</p>
        </div>

        {/* Stats Summary */}
        <div className="results-stats-body">
          {isTimeTrial && (
            <>
              <div className="results-stat-row">
                <span className="results-stat-label">
                  <Timer size={16} /> FINAL LAP TIME
                </span>
                <span className="results-stat-val text-cyan">
                  {formatTime(timeTrial.lapTime)}
                </span>
              </div>
              <div className="results-stat-row">
                <span className="results-stat-label">
                  <Trophy size={16} /> ALL-TIME BEST
                </span>
                <span className="results-stat-val text-amber">
                  {formatTime(bestTimes.timeTrial)}
                </span>
              </div>
            </>
          )}

          {isTraffic && (
            <>
              <div className="results-stat-row">
                <span className="results-stat-label">
                  <Trophy size={16} /> FINAL SCORE
                </span>
                <span className="results-stat-val text-amber">
                  {trafficDrive.score.toLocaleString()} PTS
                </span>
              </div>
              <div className="results-stat-row">
                <span className="results-stat-label">
                  <Car size={16} /> DISTANCE TRAVELED
                </span>
                <span className="results-stat-val text-cyan">
                  {Math.round(trafficDrive.distance)} METERS
                </span>
              </div>
              <div className="results-stat-row">
                <span className="results-stat-label">NEAR MISSES</span>
                <span className="results-stat-val text-emerald">
                  {trafficDrive.nearMisses} (Max x{trafficDrive.multiplier})
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button className="results-btn primary-results-btn" onClick={() => startGame(gameMode)}>
            <RotateCcw size={18} />
            <span>PLAY AGAIN</span>
          </button>

          <button className="results-btn" onClick={() => setGameState('menu')}>
            <Home size={18} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
}

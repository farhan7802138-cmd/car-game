import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Timer, Zap, Trophy, ShieldAlert, RotateCcw } from 'lucide-react';

function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return '--:--.--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function ModeOverlays() {
  const gameMode = useGameStore((s) => s.gameMode);
  const timeTrial = useGameStore((s) => s.timeTrial);
  const trafficDrive = useGameStore((s) => s.trafficDrive);
  const bestTimes = useGameStore((s) => s.bestTimes);
  const highScores = useGameStore((s) => s.highScores);
  const telemetry = useGameStore((s) => s.telemetry);
  const resetCar = useGameStore((s) => s.resetCar);

  return (
    <div className="mode-overlays">
      {/* ================= TIME TRIAL HUD ================= */}
      {gameMode === 'timeTrial' && (
        <div className="time-trial-hud">
          <div className="hud-card">
            <div className="hud-card-header">
              <Timer size={16} className="text-cyan" />
              <span>LAP TIME</span>
            </div>
            <div className="hud-card-value timer-val">
              {formatTime(timeTrial.lapTime)}
            </div>
            {bestTimes.timeTrial && (
              <div className="hud-card-sub">
                <Trophy size={12} className="text-amber" />
                <span>BEST: {formatTime(bestTimes.timeTrial)}</span>
              </div>
            )}
          </div>

          <div className="hud-card">
            <div className="hud-card-header">
              <Zap size={16} className="text-cyan" />
              <span>CHECKPOINT</span>
            </div>
            <div className="hud-card-value">
              {timeTrial.currentCheckpoint} / {timeTrial.totalCheckpoints}
            </div>
            <div className="checkpoint-progress-track">
              <div
                className="checkpoint-progress-fill"
                style={{
                  width: `${(timeTrial.currentCheckpoint / timeTrial.totalCheckpoints) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= TRAFFIC DRIVE HUD ================= */}
      {gameMode === 'traffic' && (
        <div className="traffic-hud">
          <div className="hud-card">
            <div className="hud-card-header">
              <Trophy size={16} className="text-amber" />
              <span>SCORE</span>
            </div>
            <div className="hud-card-value score-val">
              {trafficDrive.score.toLocaleString()}
            </div>
            <div className="hud-card-sub">
              <span>BEST: {(highScores.trafficDrive?.score || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="hud-card">
            <div className="hud-card-header">
              <span>DISTANCE</span>
            </div>
            <div className="hud-card-value">
              {Math.round(trafficDrive.distance)} m
            </div>
            <div className="hud-card-sub">
              <span className="near-miss-tag">
                NEAR MISSES: {trafficDrive.nearMisses} (x{trafficDrive.multiplier})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= FREE ROAM / DRIFT HUD ================= */}
      {telemetry.isDrifting && (
        <div className="drift-score-badge">
          <span className="drift-label">DRIFT!</span>
          <span className="drift-pts">+{telemetry.driftScore}</span>
          <span className="drift-multiplier">x{telemetry.driftCombo}</span>
        </div>
      )}

      {/* ================= FLIPPED CAR WARNING ================= */}
      {telemetry.isFlipped && (
        <div className="flipped-banner">
          <ShieldAlert size={20} className="text-red" />
          <span>VEHICLE OVERTURNED!</span>
          <button className="respawn-btn" onClick={resetCar}>
            <RotateCcw size={16} />
            <span>RESPAWN (R)</span>
          </button>
        </div>
      )}
    </div>
  );
}

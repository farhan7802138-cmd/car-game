import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';
import { X, Volume2, Music, Monitor, Gamepad2, Moon, Sun, Activity, Smartphone } from 'lucide-react';

export function SettingsModal({ onClose }) {
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);
  const setGraphicsQuality = useGameStore((s) => s.setGraphicsQuality);
  const soundVolume = useGameStore((s) => s.soundVolume);
  const setSoundVolume = useGameStore((s) => s.setSoundVolume);
  const musicVolume = useGameStore((s) => s.musicVolume);
  const setMusicVolume = useGameStore((s) => s.setMusicVolume);
  const controlsType = useGameStore((s) => s.controlsType);
  const setControlsType = useGameStore((s) => s.setControlsType);
  const isNight = useGameStore((s) => s.isNight);
  const toggleDayNight = useGameStore((s) => s.toggleDayNight);
  const showDebug = useGameStore((s) => s.showDebug);
  const setShowDebug = useGameStore((s) => s.setShowDebug);

  const { permissionGranted, requestPermission } = useDeviceOrientation();

  const handleSelectTilt = async () => {
    const granted = await requestPermission();
    if (granted) {
      setControlsType('tilt');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="settings-modal-card">
        {/* Header */}
        <div className="modal-header">
          <h2>GAME SETTINGS</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-scroll-body">
          {/* Graphics Quality */}
          <div className="setting-group">
            <div className="setting-label">
              <Monitor size={18} />
              <span>GRAPHICS QUALITY</span>
            </div>
            <div className="segment-control">
              {['low', 'medium', 'high'].map((q) => (
                <button
                  key={q}
                  className={`segment-btn ${graphicsQuality === q ? 'active-segment' : ''}`}
                  onClick={() => setGraphicsQuality(q)}
                >
                  {q.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Scheme */}
          <div className="setting-group">
            <div className="setting-label">
              <Gamepad2 size={18} />
              <span>CONTROLS SCHEME</span>
            </div>
            <div className="segment-control">
              <button
                className={`segment-btn ${controlsType === 'buttons' ? 'active-segment' : ''}`}
                onClick={() => setControlsType('buttons')}
              >
                BUTTONS
              </button>
              <button
                className={`segment-btn ${controlsType === 'wheel' ? 'active-segment' : ''}`}
                onClick={() => setControlsType('wheel')}
              >
                WHEEL
              </button>
              <button
                className={`segment-btn ${controlsType === 'tilt' ? 'active-segment' : ''}`}
                onClick={handleSelectTilt}
              >
                <Smartphone size={14} style={{ display: 'inline', marginRight: 4 }} />
                GYRO TILT
              </button>
            </div>
          </div>

          {/* Time of Day */}
          <div className="setting-group">
            <div className="setting-label">
              {isNight ? <Moon size={18} /> : <Sun size={18} />}
              <span>TIME OF DAY</span>
            </div>
            <button className="toggle-pill-btn" onClick={toggleDayNight}>
              {isNight ? 'NIGHT MODE (HEADLIGHTS ON)' : 'DAYTIME (BRIGHT SUN)'}
            </button>
          </div>

          {/* Sound FX Volume */}
          <div className="setting-group">
            <div className="setting-label">
              <Volume2 size={18} />
              <span>SOUND EFFECTS VOLUME ({Math.round(soundVolume * 100)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              className="settings-slider"
            />
          </div>

          {/* Music Volume */}
          <div className="setting-group">
            <div className="setting-label">
              <Music size={18} />
              <span>MUSIC VOLUME ({Math.round(musicVolume * 100)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="settings-slider"
            />
          </div>

          {/* FPS & Telemetry Debug */}
          <div className="setting-group">
            <div className="setting-label">
              <Activity size={18} />
              <span>SHOW FPS & DEBUG TELEMETRY</span>
            </div>
            <button
              className={`toggle-pill-btn ${showDebug ? 'active-toggle' : ''}`}
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="confirm-btn" onClick={onClose}>
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Flame } from 'lucide-react';

export function NitroBar() {
  const telemetry = useGameStore((s) => s.telemetry);
  const nitro = telemetry.nitro ?? 100;
  const isNitro = telemetry.isNitro;

  return (
    <div className={`nitro-container ${isNitro ? 'nitro-active' : ''}`}>
      <div className="nitro-icon-wrap">
        <Flame size={16} className="nitro-icon" />
        <span className="nitro-label">NOS</span>
      </div>
      <div className="nitro-track">
        <div
          className="nitro-fill"
          style={{ width: `${nitro}%` }}
        />
      </div>
      <span className="nitro-pct">{nitro}%</span>
    </div>
  );
}

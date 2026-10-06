import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export function SpeedometerGauge() {
  const telemetry = useGameStore((s) => s.telemetry);
  const speed = telemetry.speed || 0;
  const rpm = telemetry.rpm || 900;
  const gear = telemetry.gear || 1;

  // Max speed on gauge: 300 km/h
  // Needle angle: -135deg (0 km/h) to +135deg (300 km/h)
  const angle = -135 + Math.min(1, speed / 300) * 270;

  // RPM percentage (900 to 7500)
  const rpmPct = Math.min(100, Math.max(0, ((rpm - 900) / 6600) * 100));
  const isRedline = rpm >= 6500;

  return (
    <div className="speedometer-cluster">
      {/* SVG Analog Dial */}
      <svg className="gauge-svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="speedArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00e5ff" />
            <stop offset="70%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#ff2a55" />
          </linearGradient>
        </defs>

        {/* Background track arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="10"
          strokeDasharray="377"
          strokeDashoffset="94"
          strokeLinecap="round"
          transform="rotate(135 100 100)"
        />

        {/* Active speed arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="url(#speedArcGrad)"
          strokeWidth="10"
          strokeDasharray="377"
          strokeDashoffset={377 - (speed / 300) * 283}
          strokeLinecap="round"
          transform="rotate(135 100 100)"
          style={{ transition: 'stroke-dashoffset 0.06s linear' }}
        />

        {/* Dial Ticks */}
        {[0, 50, 100, 150, 200, 250, 300].map((val, idx) => {
          const tickAngle = (-135 + (idx / 6) * 270) * (Math.PI / 180);
          const x1 = 100 + Math.cos(tickAngle) * 68;
          const y1 = 100 + Math.sin(tickAngle) * 68;
          const x2 = 100 + Math.cos(tickAngle) * 74;
          const y2 = 100 + Math.sin(tickAngle) * 74;
          return (
            <line
              key={val}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={idx >= 5 ? '#ff2a55' : 'rgba(255,255,255,0.4)'}
              strokeWidth="2"
            />
          );
        })}

        {/* Center Pivot */}
        <circle cx="100" cy="100" r="14" fill="#090d16" stroke="#00e5ff" strokeWidth="2" />

        {/* Needle pointer */}
        <g transform={`rotate(${angle} 100 100)`} style={{ transition: 'transform 0.06s linear' }}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="34"
            stroke="#ff2a55"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="34" r="3" fill="#ff2a55" />
        </g>
      </svg>

      {/* Digital Center Readout */}
      <div className="speed-digital">
        <span className="speed-number">{speed}</span>
        <span className="speed-unit">KM/H</span>
      </div>

      {/* Gear Badge */}
      <div className="gear-badge">
        <span className="gear-label">GEAR</span>
        <span className="gear-val">{gear}</span>
      </div>

      {/* RPM Tachometer Bar */}
      <div className="rpm-bar-container">
        <div className="rpm-bar-track">
          <div
            className={`rpm-bar-fill ${isRedline ? 'rpm-redline' : ''}`}
            style={{ width: `${rpmPct}%` }}
          />
        </div>
        <div className="rpm-label-row">
          <span>RPM {rpm}</span>
          {isRedline && <span className="redline-alert">SHIFT!</span>}
        </div>
      </div>
    </div>
  );
}

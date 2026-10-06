import React, { useState, useEffect } from 'react';
import { Gauge } from 'lucide-react';

const TIPS = [
  'Pro Tip: Tap DRIFT while cornering at high speed to break traction and initiate a power slide.',
  'Pro Tip: Nitro regenerates automatically when cruising. Save it for straightaways and overtakes.',
  'Pro Tip: Switch to Cockpit camera (C key or HUD button) for immersive first-person apex lines.',
  'Pro Tip: Highway traffic near-misses grant massive score multipliers and boost your final rank.',
  'Pro Tip: Install Apex Drift 3D as a PWA to play offline with zero browser address bar distractions.',
];

export function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(15);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onLoaded(), 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 22) + 8;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onLoaded]);

  return (
    <div className="loading-screen-backdrop">
      <div className="loading-container">
        {/* Animated Brand Badge */}
        <div className="loading-badge">
          <Gauge size={32} className="spin-slow text-cyan" />
          <h1>APEX DRIFT 3D</h1>
        </div>

        {/* Loading Bar */}
        <div className="loading-track">
          <div
            className="loading-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="loading-meta-row">
          <span>INITIALIZING RAPIER 3D PHYSICS ENGINE...</span>
          <span className="loading-pct">{progress}%</span>
        </div>

        {/* Tip Pill */}
        <div className="loading-tip-card">
          <p>{TIPS[tipIndex]}</p>
        </div>
      </div>
    </div>
  );
}

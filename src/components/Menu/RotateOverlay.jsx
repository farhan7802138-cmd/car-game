import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Smartphone, X, Play } from 'lucide-react';
import { isMobileDevice } from '../../utils/device';

export function RotateOverlay() {
  const gameState = useGameStore((s) => s.gameState);
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = isMobileDevice();
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobile && portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Reset dismissal when orientation returns to landscape
  useEffect(() => {
    if (!isPortrait) {
      setDismissed(false);
    }
  }, [isPortrait]);

  // NEVER block the main menu, car select, or settings! Menus work seamlessly in both portrait & landscape.
  // Only show gentle guidance if actively driving in portrait and user hasn't dismissed it.
  if (!isPortrait || dismissed || gameState !== 'playing') {
    return null;
  }

  return (
    <div className="rotate-device-overlay">
      <div className="rotate-content">
        <button className="dismiss-rotate-btn" onClick={() => setDismissed(true)}>
          <X size={20} />
        </button>
        <div className="rotate-icon-pulse">
          <Smartphone size={52} className="rotating-phone-svg" />
        </div>
        <h2>ROTATE FOR BEST VIEW</h2>
        <p>Landscape mode gives you a wider view of the track and larger pedals.</p>
        <div className="rotate-actions-row">
          <button className="continue-portrait-btn" onClick={() => setDismissed(true)}>
            <Play size={16} />
            <span>PLAY IN PORTRAIT</span>
          </button>
        </div>
      </div>
    </div>
  );
}

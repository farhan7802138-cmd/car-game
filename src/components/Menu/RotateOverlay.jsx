import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export function RotateOverlay() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobileSize = window.innerWidth < 900;
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobileSize && portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="rotate-device-overlay">
      <div className="rotate-content">
        <div className="rotate-icon-pulse">
          <Smartphone size={56} className="rotating-phone-svg" />
        </div>
        <h2>PLEASE ROTATE YOUR DEVICE</h2>
        <p>Apex Drift 3D is designed for the ultimate immersive cockpit experience in Landscape mode.</p>
        <div className="rotate-hint-pill">TURN PHONE HORIZONTALLY</div>
      </div>
    </div>
  );
}

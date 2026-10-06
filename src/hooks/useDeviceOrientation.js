import { useState, useEffect, useCallback } from 'react';

export function useDeviceOrientation() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [tiltGamma, setTiltGamma] = useState(0); // Left/Right tilt in landscape

  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          return true;
        }
        return false;
      } catch (err) {
        console.warn('DeviceOrientation permission error:', err);
        return false;
      }
    } else {
      // Non-iOS or standard Android device
      setPermissionGranted(true);
      return true;
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (e) => {
      // In landscape orientation:
      // gamma or beta corresponds to tilting the device left or right like a steering wheel
      const isLandscape = window.innerWidth > window.innerHeight;
      let rawTilt = 0;
      
      if (isLandscape) {
        // In landscape, beta represents up/down tilt or steering rotation depending on angle
        rawTilt = e.beta || 0;
      } else {
        rawTilt = e.gamma || 0;
      }

      // Clamp between -35 and +35 degrees, normalize to -1.0 .. +1.0
      const clamped = Math.max(-35, Math.min(35, rawTilt));
      setTiltGamma(clamped / 35);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [permissionGranted]);

  return { permissionGranted, requestPermission, tiltGamma };
}

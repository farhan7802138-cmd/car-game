import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';

export function PerformanceHandler({ setDpr }) {
  const setFps = useGameStore((s) => s.setFps);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    if (elapsed >= 500) {
      const currentFps = (frameCount.current / elapsed) * 1000;
      setFps(currentFps);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return (
    <PerformanceMonitor
      onDecline={() => {
        // Automatically drop DPR to keep frame rate silky smooth on mobile
        setDpr(1.0);
      }}
      onIncline={() => {
        const isMobile = window.innerWidth < 800;
        setDpr(isMobile ? 1.3 : 1.75);
      }}
    />
  );
}

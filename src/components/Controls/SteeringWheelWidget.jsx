import React, { useRef, useState, useEffect } from 'react';
import { controlsState } from '../../hooks/useControls';

export function SteeringWheelWidget() {
  const wheelRef = useRef(null);
  const [wheelAngle, setWheelAngle] = useState(0); // in degrees
  const isDraggingRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const centerPosRef = useRef({ x: 0, y: 0 });

  const MAX_WHEEL_ROTATION = 140; // Max turn angle in degrees

  const handlePointerDown = (e) => {
    e.preventDefault();
    if (activePointerIdRef.current !== null) return;

    activePointerIdRef.current = e.pointerId;
    isDraggingRef.current = true;

    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect();
      centerPosRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || e.pointerId !== activePointerIdRef.current) return;
    e.preventDefault();

    const dx = e.clientX - centerPosRef.current.x;
    const dy = e.clientY - centerPosRef.current.y;
    let angleRad = Math.atan2(dy, dx) + Math.PI / 2; // Offset so up is 0

    // Normalize angle to -PI..PI
    while (angleRad > Math.PI) angleRad -= Math.PI * 2;
    while (angleRad < -Math.PI) angleRad += Math.PI * 2;

    let angleDeg = angleRad * (180 / Math.PI);
    angleDeg = Math.max(-MAX_WHEEL_ROTATION, Math.min(MAX_WHEEL_ROTATION, angleDeg));

    setWheelAngle(angleDeg);
    controlsState.touchSteer = angleDeg / MAX_WHEEL_ROTATION;
  };

  const handlePointerUp = (e) => {
    if (e.pointerId === activePointerIdRef.current) {
      isDraggingRef.current = false;
      activePointerIdRef.current = null;
      setWheelAngle(0);
      controlsState.touchSteer = 0;
    }
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  return (
    <div
      ref={wheelRef}
      className="virtual-steering-wheel"
      onPointerDown={handlePointerDown}
      style={{
        transform: `rotate(${wheelAngle}deg)`,
      }}
    >
      <svg viewBox="0 0 120 120" className="wheel-svg">
        {/* Outer Rim */}
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="12" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="#00e5ff" strokeWidth="3" />

        {/* 12 o'clock center stripe */}
        <rect x="56" y="2" width="8" height="12" fill="#ff2a55" rx="2" />

        {/* 3 Spokes */}
        {/* Left spoke */}
        <line x1="14" y1="60" x2="48" y2="60" stroke="rgba(255,255,255,0.6)" strokeWidth="10" strokeLinecap="round" />
        {/* Right spoke */}
        <line x1="72" y1="60" x2="106" y2="60" stroke="rgba(255,255,255,0.6)" strokeWidth="10" strokeLinecap="round" />
        {/* Bottom spoke */}
        <line x1="60" y1="72" x2="60" y2="106" stroke="rgba(255,255,255,0.6)" strokeWidth="10" strokeLinecap="round" />

        {/* Center Hub */}
        <circle cx="60" cy="60" r="16" fill="#111827" stroke="#00e5ff" strokeWidth="2" />
        <circle cx="60" cy="60" r="6" fill="#ff2a55" />
      </svg>
    </div>
  );
}

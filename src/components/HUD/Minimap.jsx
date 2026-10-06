import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CHECKPOINTS_LIST } from '../World/Checkpoints';

export function Minimap() {
  const canvasRef = useRef(null);
  const telemetry = useGameStore((s) => s.telemetry);
  const gameMode = useGameStore((s) => s.gameMode);
  const timeTrial = useGameStore((s) => s.timeTrial);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Map scaling: 1 pixel = ~2.4 meters, Car at center
    const scale = 0.38;
    const [carX, carY, carZ] = telemetry.position;
    const carRotY = telemetry.rotation[1] || 0;

    ctx.save();
    // Center of radar
    ctx.translate(center, center);

    // Background circle clip
    ctx.beginPath();
    ctx.arc(0, 0, center - 4, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = 'rgba(10, 15, 26, 0.82)';
    ctx.fill();

    // Concentric radar rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    [25, 45, 65].forEach((r) => {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // World to radar coordinates conversion (car centered, north up)
    const worldToRadar = (wx, wz) => {
      const rx = (wx - carX) * scale;
      const ry = -(wz - carZ) * scale; // invert Z
      return [rx, ry];
    };

    // Draw Roads on Minimap
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 4;

    // Central N-S Avenue (X=0)
    const [ns1X, ns1Y] = worldToRadar(0, -220);
    const [ns2X, ns2Y] = worldToRadar(0, 220);
    ctx.beginPath();
    ctx.moveTo(ns1X, ns1Y);
    ctx.lineTo(ns2X, ns2Y);
    ctx.stroke();

    // Central E-W Avenue (Z=0)
    const [ew1X, ew1Y] = worldToRadar(-220, 0);
    const [ew2X, ew2Y] = worldToRadar(220, 0);
    ctx.beginPath();
    ctx.moveTo(ew1X, ew1Y);
    ctx.lineTo(ew2X, ew2Y);
    ctx.stroke();

    // Highway (X=160)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 6;
    const [hw1X, hw1Y] = worldToRadar(160, -260);
    const [hw2X, hw2Y] = worldToRadar(160, 260);
    ctx.beginPath();
    ctx.moveTo(hw1X, hw1Y);
    ctx.lineTo(hw2X, hw2Y);
    ctx.stroke();

    // Drift Arena (X=-170, Z=0)
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 2;
    const [daX, daY] = worldToRadar(-170, 0);
    ctx.beginPath();
    ctx.arc(daX, daY, 55 * scale, 0, Math.PI * 2);
    ctx.stroke();

    // Draw active checkpoint in Time Trial
    if (gameMode === 'timeTrial') {
      const targetCp = CHECKPOINTS_LIST[timeTrial.currentCheckpoint];
      if (targetCp) {
        const [cpx, cpy] = worldToRadar(targetCp.pos[0], targetCp.pos[2]);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cpx, cpy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Player Car icon (Center Triangle Arrow pointing in heading)
    ctx.save();
    ctx.rotate(-carRotY);
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 4);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.restore();
  }, [telemetry, gameMode, timeTrial]);

  return (
    <div className="minimap-container">
      <canvas
        ref={canvasRef}
        width={140}
        height={140}
        className="minimap-canvas"
      />
      <div className="minimap-badge">GPS RADAR</div>
    </div>
  );
}

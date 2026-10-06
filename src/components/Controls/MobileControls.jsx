import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { setTouchControl } from '../../hooks/useControls';
import { SteeringWheelWidget } from './SteeringWheelWidget';
import { ChevronLeft, ChevronRight, Flame, Disc } from 'lucide-react';

export function MobileControls() {
  const controlsType = useGameStore((s) => s.controlsType);
  const gameState = useGameStore((s) => s.gameState);

  if (gameState !== 'playing') return null;

  // Multi-touch Pointer Event Helpers with full safety and touch-release detection
  const makePointerHandlers = (controlKey) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
      setTouchControl(controlKey, true);
    },
    onPointerUp: (e) => {
      e.preventDefault();
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
      setTouchControl(controlKey, false);
    },
    onPointerCancel: (e) => {
      e.preventDefault();
      setTouchControl(controlKey, false);
    },
    onPointerLeave: () => {
      setTouchControl(controlKey, false);
    },
    onTouchStart: (e) => {
      e.stopPropagation();
    },
  });

  return (
    <div className="mobile-controls-layer">
      {/* ================= LEFT CONTROLS ================= */}
      <div className="mobile-left-controls">
        {controlsType === 'wheel' ? (
          <SteeringWheelWidget />
        ) : controlsType === 'tilt' ? (
          <div className="tilt-guidance-pill">
            <span>TILT DEVICE TO STEER</span>
          </div>
        ) : (
          <div className="dual-steer-buttons">
            <button
              className="steer-btn steer-btn-left"
              {...makePointerHandlers('left')}
              type="button"
              aria-label="Steer Left"
            >
              <ChevronLeft size={34} />
            </button>
            <button
              className="steer-btn steer-btn-right"
              {...makePointerHandlers('right')}
              type="button"
              aria-label="Steer Right"
            >
              <ChevronRight size={34} />
            </button>
          </div>
        )}
      </div>

      {/* ================= RIGHT CONTROLS ================= */}
      <div className="mobile-right-controls">
        {/* Secondary Action Buttons (Nitro + Handbrake Drift) */}
        <div className="action-buttons-col">
          <button
            className="mobile-action-btn nitro-action-btn"
            {...makePointerHandlers('nitro')}
            type="button"
            aria-label="Nitro Boost"
          >
            <Flame size={20} />
            <span>NITRO</span>
          </button>

          <button
            className="mobile-action-btn handbrake-action-btn"
            {...makePointerHandlers('handbrake')}
            type="button"
            aria-label="Handbrake Drift"
          >
            <Disc size={20} />
            <span>DRIFT</span>
          </button>
        </div>

        {/* Main Drive Pedals (Brake & Gas) */}
        <div className="pedals-row">
          {/* Brake / Reverse Pedal */}
          <button
            className="pedal-btn brake-pedal"
            {...makePointerHandlers('backward')}
            type="button"
            aria-label="Brake or Reverse"
          >
            <div className="pedal-treads">
              <span />
              <span />
              <span />
            </div>
            <span className="pedal-text">BRAKE</span>
          </button>

          {/* Gas Accelerator Pedal */}
          <button
            className="pedal-btn gas-pedal"
            {...makePointerHandlers('forward')}
            type="button"
            aria-label="Accelerate"
          >
            <div className="pedal-treads">
              <span />
              <span />
              <span />
              <span />
            </div>
            <span className="pedal-text">GAS</span>
          </button>
        </div>
      </div>
    </div>
  );
}

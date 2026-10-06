import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useGamepad } from './useGamepad';

// Global mutable controls state for 60fps frame loop access without React state lag
export const controlsState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  handbrake: false,
  nitro: false,
  analogSteer: 0, // -1 (left) to +1 (right)
  analogThrottle: 0, // 0 to 1
  analogBrake: 0, // 0 to 1
  touchSteer: 0,
};

export function useControls() {
  const switchCamera = useGameStore((s) => s.switchCamera);
  const resetCar = useGameStore((s) => s.resetCar);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const gameState = useGameStore((s) => s.gameState);
  const controlsType = useGameStore((s) => s.controlsType);

  const { getGamepadInput } = useGamepad();

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controlsState.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controlsState.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controlsState.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controlsState.right = true;
          break;
        case 'Space':
          controlsState.handbrake = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          controlsState.nitro = true;
          break;
        case 'KeyC':
          switchCamera();
          break;
        case 'KeyR':
          resetCar();
          break;
        case 'Escape':
          if (gameState === 'playing') pauseGame();
          else if (gameState === 'paused') resumeGame();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controlsState.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controlsState.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controlsState.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controlsState.right = false;
          break;
        case 'Space':
          controlsState.handbrake = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          controlsState.nitro = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [switchCamera, resetCar, pauseGame, resumeGame, gameState]);

  // Read inputs including gamepad & virtual controls
  const getActiveInputs = useCallback((tiltAngle = 0) => {
    // Check Gamepad
    const gp = getGamepadInput();

    let fwd = controlsState.forward || (gp ? gp.forward : false);
    let bwd = controlsState.backward || (gp ? gp.backward : false);
    let hb = controlsState.handbrake || (gp ? gp.handbrake : false);
    let nit = controlsState.nitro || (gp ? gp.nitro : false);

    let steerVal = 0;

    if (controlsType === 'tilt' && Math.abs(tiltAngle) > 0.04) {
      steerVal = tiltAngle;
    } else if (controlsType === 'wheel' && Math.abs(controlsState.touchSteer) > 0.01) {
      steerVal = controlsState.touchSteer;
    } else if (gp && Math.abs(gp.analogSteer) > 0.1) {
      steerVal = gp.analogSteer;
    } else {
      // Discrete left/right (keyboard or screen buttons)
      if (controlsState.left) steerVal -= 1;
      if (controlsState.right) steerVal += 1;
    }

    return {
      forward: fwd,
      backward: bwd,
      handbrake: hb,
      nitro: nit,
      steer: Math.max(-1, Math.min(1, steerVal)),
    };
  }, [controlsType, getGamepadInput]);

  return { getActiveInputs, controlsState };
}

// Touch input action helper functions
export const setTouchControl = (key, value) => {
  if (key in controlsState) {
    controlsState[key] = value;
    if (value && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Safe catch for browsers blocking vibrate without user interaction
      }
    }
  }
};

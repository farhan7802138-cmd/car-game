import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useGamepad() {
  const gamepadIndexRef = useRef(null);

  useEffect(() => {
    const onConnected = (e) => {
      console.log('Gamepad connected:', e.gamepad.id);
      gamepadIndexRef.current = e.gamepad.index;
    };
    const onDisconnected = (e) => {
      if (gamepadIndexRef.current === e.gamepad.index) {
        gamepadIndexRef.current = null;
      }
    };

    window.addEventListener('gamepadconnected', onConnected);
    window.addEventListener('gamepaddisconnected', onDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', onConnected);
      window.removeEventListener('gamepaddisconnected', onDisconnected);
    };
  }, []);

  const getGamepadInput = () => {
    if (gamepadIndexRef.current === null) return null;

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[gamepadIndexRef.current];
    if (!gp) return null;

    // Left stick X (-1.0 to 1.0)
    const deadzone = 0.12;
    let steer = gp.axes[0] || 0;
    if (Math.abs(steer) < deadzone) steer = 0;

    // Triggers: RT (accelerate), LT (brake)
    // On standard gamepads: buttons[7] is RT, buttons[6] is LT
    const throttleVal = gp.buttons[7] ? gp.buttons[7].value : (gp.buttons[0]?.pressed ? 1 : 0);
    const brakeVal = gp.buttons[6] ? gp.buttons[6].value : 0;

    const handbrake = !!(gp.buttons[0] && gp.buttons[0].pressed); // A / Cross
    const nitro = !!(gp.buttons[1] && gp.buttons[1].pressed); // B / Circle
    const camBtn = !!(gp.buttons[2] && gp.buttons[2].pressed); // X / Square
    const resetBtn = !!(gp.buttons[3] && gp.buttons[3].pressed); // Y / Triangle

    return {
      forward: throttleVal > 0.1,
      backward: brakeVal > 0.1,
      steerLeft: steer < -0.2,
      steerRight: steer > 0.2,
      analogSteer: steer,
      analogThrottle: throttleVal,
      analogBrake: brakeVal,
      handbrake,
      nitro,
      camera: camBtn,
      reset: resetBtn,
    };
  };

  return { getGamepadInput };
}

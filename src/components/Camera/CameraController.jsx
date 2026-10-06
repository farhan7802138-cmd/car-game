import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export function CameraController() {
  const { camera } = useThree();
  const cameraMode = useGameStore((s) => s.cameraMode);
  const telemetry = useGameStore((s) => s.telemetry);

  const currentCamPos = useRef(new THREE.Vector3(0, 5, -10));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    const carPos = new THREE.Vector3(...telemetry.position);
    const carRot = new THREE.Euler(...telemetry.rotation);
    const carQuat = new THREE.Quaternion().setFromEuler(carRot);

    // Direction vectors
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(carQuat);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(carQuat);

    const speedKmH = telemetry.speed || 0;
    const isNitro = telemetry.isNitro;

    if (cameraMode === 'chase') {
      // Dynamic camera distance based on speed
      const speedDistanceAdd = Math.min(2.5, (speedKmH / 200) * 2.2);
      const camDist = 6.2 + speedDistanceAdd;
      const camHeight = 2.4 + (speedKmH / 240) * 0.4;

      // Camera sits behind and above car
      targetCamPos.current
        .copy(carPos)
        .sub(forward.clone().multiplyScalar(camDist))
        .add(new THREE.Vector3(0, camHeight, 0));

      // Look slightly ahead of car
      const lookAhead = 4.0 + (speedKmH / 100) * 4.0;
      targetLookAt.current.copy(carPos).add(forward.clone().multiplyScalar(lookAhead)).add(new THREE.Vector3(0, 0.8, 0));

      // Dynamic FOV (speed stretch effect)
      const targetFOV = 55 + Math.min(18, (speedKmH / 220) * 16 + (isNitro ? 6 : 0));
      camera.fov += (targetFOV - camera.fov) * Math.min(1, dt * 5);
      camera.updateProjectionMatrix();

      // Smooth camera interpolation
      const smoothFactor = Math.min(1, dt * 7.5);
      currentCamPos.current.lerp(targetCamPos.current, smoothFactor);
      currentLookAt.current.lerp(targetLookAt.current, smoothFactor);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);
    } else {
      // Hood / Cockpit Camera
      // Mount point at front of windshield
      const hoodOffset = new THREE.Vector3(0, 0.85, 0.4).applyQuaternion(carQuat);
      targetCamPos.current.copy(carPos).add(hoodOffset);

      // Look forward directly down the road
      const hoodLookAt = new THREE.Vector3(0, 0.75, 25).applyQuaternion(carQuat);
      targetLookAt.current.copy(carPos).add(hoodLookAt);

      // Subtle engine vibration shake at high RPM
      if (telemetry.rpm > 3500) {
        const shake = (telemetry.rpm / 7500) * 0.015;
        targetCamPos.current.x += (Math.random() - 0.5) * shake;
        targetCamPos.current.y += (Math.random() - 0.5) * shake;
      }

      const targetFOV = 70 + (isNitro ? 8 : 0);
      camera.fov += (targetFOV - camera.fov) * Math.min(1, dt * 8);
      camera.updateProjectionMatrix();

      camera.position.copy(targetCamPos.current);
      camera.lookAt(targetLookAt.current);
    }
  });

  return null;
}

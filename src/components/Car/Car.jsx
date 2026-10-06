import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { useControls } from '../../hooks/useControls';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';
import { CAR_DEFINITIONS } from '../../utils/carDefinitions';
import { CarRenderer } from './CarRenderer';
import { Wheel } from './Wheel';
import { TireSmoke } from './TireSmoke';
import { SkidMarks } from './SkidMarks';
import { soundManager } from '../../utils/audioEngine';

export function Car({ position = [0, 1.2, 0], rotation = [0, 0, 0] }) {
  const rigidBodyRef = useRef();

  // Store bindings
  const selectedCarIndex = useGameStore((s) => s.selectedCarIndex);
  const carColors = useGameStore((s) => s.carColors);
  const isNight = useGameStore((s) => s.isNight);
  const resetTrigger = useGameStore((s) => s.resetTrigger);
  const updateTelemetry = useGameStore((s) => s.updateTelemetry);
  const reachCheckpoint = useGameStore((s) => s.reachCheckpoint);
  const updateTrafficDistance = useGameStore((s) => s.updateTrafficDistance);
  const timeTrial = useGameStore((s) => s.timeTrial);
  const gameMode = useGameStore((s) => s.gameMode);
  const gameState = useGameStore((s) => s.gameState);

  const carDef = CAR_DEFINITIONS[selectedCarIndex] || CAR_DEFINITIONS[0];
  const carColor = carColors[selectedCarIndex] || carDef.defaultColor;

  // Controls hooks
  const { getActiveInputs } = useControls();
  const { tiltGamma } = useDeviceOrientation();

  // Internal vehicle simulation state
  const steerAngleRef = useRef(0);
  const wheelRollAngleRef = useRef(0);
  const nitroReserveRef = useRef(100);
  const flipTimerRef = useRef(0);
  const driftPointsRef = useRef(0);
  const driftComboRef = useRef(1);

  // Wheel mesh refs
  const flWheelRef = useRef();
  const frWheelRef = useRef();
  const rlWheelRef = useRef();
  const rrWheelRef = useRef();

  // Reusable THREE vectors to avoid GC pressure in useFrame
  const forwardVec = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3());
  const upVec = useRef(new THREE.Vector3());
  const linvelVec = useRef(new THREE.Vector3());
  const carPosVec = useRef(new THREE.Vector3());
  const carQuat = useRef(new THREE.Quaternion());
  const rearLeftPos = useRef(new THREE.Vector3());
  const rearRightPos = useRef(new THREE.Vector3());

  // Wheel contact positions for smoke & skid marks
  const [wheelWorldPositions, setWheelWorldPositions] = useState([]);
  const [isDriftingState, setIsDriftingState] = useState(false);

  // Handle Car Reset / Respawn
  useEffect(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
      const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2]);
      const q = new THREE.Quaternion().setFromEuler(euler);
      rigidBodyRef.current.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      steerAngleRef.current = 0;
      nitroReserveRef.current = 100;
      driftPointsRef.current = 0;
      driftComboRef.current = 1;
    }
  }, [resetTrigger, position, rotation]);

  // Main Vehicle Physics Frame Loop
  useFrame((_, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb || gameState === 'paused') return;

    const dt = Math.min(delta, 0.05); // Clamp dt to prevent tunneling on frame lag

    // 1. Fetch current physics state
    const t = rb.translation();
    const r = rb.rotation();
    const lv = rb.linvel();
    const av = rb.angvel();

    carPosVec.current.set(t.x, t.y, t.z);
    carQuat.current.set(r.x, r.y, r.z, r.w);
    linvelVec.current.set(lv.x, lv.y, lv.z);

    // Orientation vectors
    forwardVec.current.set(0, 0, 1).applyQuaternion(carQuat.current);
    rightVec.current.set(1, 0, 0).applyQuaternion(carQuat.current);
    upVec.current.set(0, 1, 0).applyQuaternion(carQuat.current);

    // Speeds in m/s & km/h
    const forwardSpeed = linvelVec.current.dot(forwardVec.current);
    const lateralSpeed = linvelVec.current.dot(rightVec.current);
    const totalSpeed = linvelVec.current.length();
    const speedKmH = Math.round(totalSpeed * 3.6);

    // 2. Read Controls
    const inputs = getActiveInputs(tiltGamma);
    let { forward, backward, handbrake, nitro, steer } = inputs;

    // Nitro Management
    let isNitroActive = false;
    if (nitro && nitroReserveRef.current > 2 && forward) {
      isNitroActive = true;
      nitroReserveRef.current = Math.max(0, nitroReserveRef.current - dt * 26);
    } else {
      nitroReserveRef.current = Math.min(100, nitroReserveRef.current + dt * 10);
    }

    // 3. Speed-Sensitive Steering
    // Reduce steering lock as speed increases to prevent violent roll-overs
    const speedRatio = Math.min(1, speedKmH / 180);
    const maxSteer = carDef.specs.steerLimit * (1.0 - speedRatio * 0.72);
    const targetSteerAngle = -steer * maxSteer;

    // Steering smoothing
    steerAngleRef.current += (targetSteerAngle - steerAngleRef.current) * Math.min(1, dt * carDef.specs.steerSpeed);

    // 4. Automatic Gearbox & RPM Simulation
    let gear = 1;
    let rpm = 900;
    if (backward && forwardSpeed < -0.5) {
      gear = 'R';
      rpm = Math.min(6500, 1200 + Math.abs(speedKmH) * 110);
    } else {
      if (speedKmH < 45) {
        gear = 1;
        rpm = 900 + (speedKmH / 45) * 5800;
      } else if (speedKmH < 85) {
        gear = 2;
        rpm = 2800 + ((speedKmH - 45) / 40) * 4400;
      } else if (speedKmH < 135) {
        gear = 3;
        rpm = 3200 + ((speedKmH - 85) / 50) * 4100;
      } else if (speedKmH < 195) {
        gear = 4;
        rpm = 3400 + ((speedKmH - 135) / 60) * 3800;
      } else {
        gear = 5;
        rpm = 3800 + Math.min(3400, ((speedKmH - 195) / 75) * 3400);
      }
      if (forward && speedKmH < 5) {
        rpm = Math.max(rpm, 2500); // Standing start rev
      }
    }

    // 5. Four-Wheel Raycast Suspension Simulation
    const { suspensionRestLength, suspensionStiffness, suspensionDamping, mass } = carDef.specs;
    const offsets = carDef.specs.wheelOffsets;
    const wheels = [
      { name: 'FL', local: offsets.frontLeft, isFront: true, isLeft: true, ref: flWheelRef },
      { name: 'FR', local: offsets.frontRight, isFront: true, isLeft: false, ref: frWheelRef },
      { name: 'RL', local: offsets.rearLeft, isFront: false, isLeft: true, ref: rlWheelRef },
      { name: 'RR', local: offsets.rearRight, isFront: false, isLeft: false, ref: rrWheelRef },
    ];

    let wheelsGroundedCount = 0;
    const contactPoints = [];

    // Road terrain baseline height is Y=0
    const groundY = 0.0;

    wheels.forEach((w) => {
      // Calculate wheel attachment point in world space
      const worldPoint = new THREE.Vector3(...w.local)
        .applyQuaternion(carQuat.current)
        .add(carPosVec.current);

      const heightAboveGround = worldPoint.y - groundY;
      const compression = suspensionRestLength - heightAboveGround;

      if (compression > 0) {
        wheelsGroundedCount++;
        contactPoints.push(worldPoint.clone());

        // Vertical suspension spring + damping force
        const vertVel = lv.y;
        const springForce = Math.max(0, compression * suspensionStiffness * (mass / 4) - vertVel * suspensionDamping * (mass / 4));
        const upwardImpulse = new THREE.Vector3(0, springForce * dt, 0);

        rb.applyImpulseAtPoint(upwardImpulse, worldPoint, true);

        // Visual suspension compression offset
        if (w.ref.current) {
          w.ref.current.position.y = w.local[1] + compression * 0.45;
        }
      } else {
        if (w.ref.current) {
          w.ref.current.position.y = w.local[1];
        }
      }
    });

    const isGrounded = wheelsGroundedCount >= 2;

    // 6. Driving Forces & Acceleration
    if (isGrounded) {
      const nitroMultiplier = isNitroActive ? 1.65 : 1.0;

      if (forward) {
        // Forward propulsion
        const accelForce = (carDef.specs.enginePower * nitroMultiplier * mass) / 1200;
        const driveImpulse = forwardVec.current.clone().multiplyScalar(accelForce * dt);
        rb.applyImpulse(driveImpulse, true);
      } else if (backward) {
        if (forwardSpeed > 2.0) {
          // Foot Brake: decelerate firmly
          const brakeForce = (carDef.specs.brakePower * mass) / 1200;
          const brakeImpulse = forwardVec.current.clone().multiplyScalar(-brakeForce * dt);
          rb.applyImpulse(brakeImpulse, true);
        } else {
          // Reverse
          const revForce = (carDef.specs.reversePower * mass) / 1200;
          const revImpulse = forwardVec.current.clone().multiplyScalar(-revForce * dt);
          rb.applyImpulse(revImpulse, true);
        }
      }

      // 7. Lateral Tire Friction & Realistic Drifting Physics
      // Front wheels have steer direction
      const frontSteerDir = rightVec.current.clone().applyAxisAngle(upVec.current, steerAngleRef.current);
      const frontLatSpeed = linvelVec.current.dot(frontSteerDir);
      const rearLatSpeed = lateralSpeed;

      // When handbrake engaged, rear lateral grip drops drastically (inducing drift slide)
      const rearGripFactor = handbrake ? 0.16 : (isNitroActive ? 0.55 : 0.88);
      const frontGripFactor = 0.94;

      // Lateral friction impulses opposing sideways sliding
      const frontLatFriction = frontSteerDir.clone().multiplyScalar(-frontLatSpeed * frontGripFactor * (mass / 2) * dt * 1.8);
      const rearLatFriction = rightVec.current.clone().multiplyScalar(-rearLatSpeed * rearGripFactor * (mass / 2) * dt * 1.8);

      rb.applyImpulse(frontLatFriction, true);
      rb.applyImpulse(rearLatFriction, true);

      // 8. Aerodynamic Downforce & Air Drag
      const downforceMagnitude = carDef.specs.downforceCoeff * (forwardSpeed * forwardSpeed) * 0.18;
      const downforceImpulse = upVec.current.clone().multiplyScalar(-downforceMagnitude * dt);
      rb.applyImpulse(downforceImpulse, true);

      const dragMagnitude = carDef.specs.dragCoeff * (totalSpeed * totalSpeed) * 0.28;
      const dragImpulse = linvelVec.current.clone().normalize().multiplyScalar(-dragMagnitude * dt);
      rb.applyImpulse(dragImpulse, true);
    }

    // 9. Visual Wheel Rotations & Steering Angles
    const rollSpeed = forwardSpeed / carDef.specs.wheelRadius;
    wheelRollAngleRef.current += rollSpeed * dt;

    if (flWheelRef.current && frWheelRef.current) {
      flWheelRef.current.rotation.y = steerAngleRef.current;
      frWheelRef.current.rotation.y = steerAngleRef.current;
      flWheelRef.current.rotation.x = wheelRollAngleRef.current;
      frWheelRef.current.rotation.x = wheelRollAngleRef.current;
    }
    if (rlWheelRef.current && rrWheelRef.current) {
      rlWheelRef.current.rotation.x = wheelRollAngleRef.current;
      rrWheelRef.current.rotation.x = wheelRollAngleRef.current;
    }

    // 10. Drift Scoring & Skid Detection
    const isDrifting = Math.abs(lateralSpeed) > 3.2 && speedKmH > 24 && isGrounded;
    setIsDriftingState(isDrifting);

    if (isDrifting) {
      driftComboRef.current = Math.min(5, Number((driftComboRef.current + dt * 0.4).toFixed(1)));
      driftPointsRef.current += Math.round(dt * speedKmH * 3 * driftComboRef.current);
    } else {
      driftComboRef.current = 1;
    }

    // 11. Flip / Overturn Detection
    const isUpsideDown = upVec.current.y < 0.25;
    if (isUpsideDown) {
      flipTimerRef.current += dt;
    } else {
      flipTimerRef.current = 0;
    }
    const isFlipped = flipTimerRef.current > 1.8;

    // 12. Rear Wheel Contact Points for Smoke & Skid Marks
    if (wheels[2].ref.current && wheels[3].ref.current) {
      rearLeftPos.current.set(...offsets.rearLeft).applyQuaternion(carQuat.current).add(carPosVec.current);
      rearRightPos.current.set(...offsets.rearRight).applyQuaternion(carQuat.current).add(carPosVec.current);
      setWheelWorldPositions([rearLeftPos.current, rearRightPos.current]);
    }

    // 13. Mode-specific updates
    if (gameMode === 'traffic' && gameState === 'playing') {
      updateTrafficDistance(forwardSpeed * dt);
    }

    // 14. Sync Telemetry to Store
    updateTelemetry({
      speed: speedKmH,
      rpm: Math.round(rpm),
      gear,
      nitro: Math.round(nitroReserveRef.current),
      isNitro: isNitroActive,
      isDrifting,
      driftScore: driftPointsRef.current,
      driftCombo: driftComboRef.current,
      isFlipped,
      position: [t.x, t.y, t.z],
      rotation: [r.x, r.y, r.z],
      throttle: forward,
    });
  });

  return (
    <group>
      {/* Dynamic Rapier Rigid Body with compound collider and realistic center of mass */}
      <RigidBody
        ref={rigidBodyRef}
        colliders="cuboid"
        position={position}
        rotation={rotation}
        mass={carDef.specs.mass}
        linearDamping={0.25}
        angularDamping={2.2}
        restitution={0.08}
        friction={0.65}
        canSleep={false}
      >
        {/* Car Visual Body */}
        <CarRenderer
          carDef={carDef}
          color={carColor}
          isNight={isNight}
          isNitro={useGameStore.getState().telemetry.isNitro}
        />

        {/* 4 Interactive Visual Wheels */}
        {/* Front Left */}
        <group
          ref={flWheelRef}
          position={carDef.specs.wheelOffsets.frontLeft}
        >
          <Wheel
            radius={carDef.specs.wheelRadius}
            width={carDef.specs.wheelWidth}
            isFront={true}
            isLeft={true}
          />
        </group>

        {/* Front Right */}
        <group
          ref={frWheelRef}
          position={carDef.specs.wheelOffsets.frontRight}
        >
          <Wheel
            radius={carDef.specs.wheelRadius}
            width={carDef.specs.wheelWidth}
            isFront={true}
            isLeft={false}
          />
        </group>

        {/* Rear Left */}
        <group
          ref={rlWheelRef}
          position={carDef.specs.wheelOffsets.rearLeft}
        >
          <Wheel
            radius={carDef.specs.wheelRadius}
            width={carDef.specs.wheelWidth}
            isFront={false}
            isLeft={true}
          />
        </group>

        {/* Rear Right */}
        <group
          ref={rrWheelRef}
          position={carDef.specs.wheelOffsets.rearRight}
        >
          <Wheel
            radius={carDef.specs.wheelRadius}
            width={carDef.specs.wheelWidth}
            isFront={false}
            isLeft={false}
          />
        </group>
      </RigidBody>

      {/* Visual Drift FX: Tire Smoke and Skid Marks */}
      <TireSmoke
        active={isDriftingState}
        wheelPositions={wheelWorldPositions}
      />
      <SkidMarks
        active={isDriftingState}
        wheelPositions={wheelWorldPositions}
      />
    </group>
  );
}

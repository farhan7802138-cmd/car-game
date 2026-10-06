import { create } from 'zustand';
import { loadSaveData, writeSaveData } from '../utils/storage';
import { CAR_DEFINITIONS } from '../utils/carDefinitions';
import { soundManager } from '../utils/audioEngine';

const initialSave = loadSaveData();

export const useGameStore = create((set, get) => ({
  // Core Game State
  gameMode: 'free', // 'free' | 'timeTrial' | 'traffic'
  gameState: 'menu', // 'menu' | 'carSelect' | 'playing' | 'paused' | 'results'
  resetTrigger: 0, // Incremented to signal car respawn / reset
  
  // Vehicle Selection & Customization
  selectedCarIndex: initialSave.selectedCar || 0,
  carColors: initialSave.carColors || ['#ff2a55', '#ffa000', '#00e5ff'],

  // Camera Mode
  cameraMode: 'chase', // 'chase' | 'hood'

  // Settings & Graphics
  graphicsQuality: initialSave.settings?.graphicsQuality || 'high',
  isNight: initialSave.settings?.isNight || false,
  controlsType: initialSave.settings?.controlsType || 'buttons', // 'buttons' | 'wheel' | 'tilt'
  tiltEnabled: false,
  isMuted: false,
  soundVolume: initialSave.settings?.soundVolume ?? 0.8,
  musicVolume: initialSave.settings?.musicVolume ?? 0.5,
  showDebug: initialSave.settings?.showDebug || false,
  fps: 60,

  // Saved Records
  highScores: initialSave.highScores || {
    trafficDrive: { score: 0, distance: 0, nearMisses: 0 },
    freeRoam: { maxDrift: 0 },
  },
  bestTimes: initialSave.bestTimes || {
    timeTrial: null,
  },

  // Telemetry (Real-time driving stats)
  telemetry: {
    speed: 0, // km/h
    rpm: 900,
    gear: 1, // 1 to 5, 'R', 'N'
    nitro: 100, // 0 to 100
    isNitro: false,
    isDrifting: false,
    driftScore: 0,
    driftCombo: 1,
    isFlipped: false,
    position: [0, 1, 0],
    rotation: [0, 0, 0],
    throttle: false,
  },

  // Time Trial Mode State
  timeTrial: {
    currentCheckpoint: 0,
    totalCheckpoints: 12,
    lapTime: 0,
    isRunning: false,
    completed: false,
    isNewRecord: false,
  },

  // Traffic Drive Mode State
  trafficDrive: {
    distance: 0, // meters
    score: 0,
    nearMisses: 0,
    multiplier: 1,
    crashed: false,
    isNewRecord: false,
  },

  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),
  setGameState: (state) => {
    set({ gameState: state });
    if (state === 'playing') {
      soundManager.init();
      soundManager.resume();
      soundManager.startMusic();
    }
  },

  startGame: (mode) => {
    const targetMode = mode || get().gameMode;
    soundManager.init();
    soundManager.resume();
    soundManager.startMusic();

    set((state) => ({
      gameMode: targetMode,
      gameState: 'playing',
      resetTrigger: state.resetTrigger + 1,
      timeTrial: {
        currentCheckpoint: 0,
        totalCheckpoints: 12,
        lapTime: 0,
        isRunning: true,
        completed: false,
        isNewRecord: false,
      },
      trafficDrive: {
        distance: 0,
        score: 0,
        nearMisses: 0,
        multiplier: 1,
        crashed: false,
        isNewRecord: false,
      },
      telemetry: {
        ...state.telemetry,
        driftScore: 0,
        driftCombo: 1,
        nitro: 100,
      },
    }));
  },

  pauseGame: () => {
    if (get().gameState === 'playing') {
      set({ gameState: 'paused' });
    }
  },

  resumeGame: () => {
    if (get().gameState === 'paused') {
      soundManager.resume();
      set({ gameState: 'playing' });
    }
  },

  resetCar: () => {
    set((state) => ({ resetTrigger: state.resetTrigger + 1 }));
  },

  switchCamera: () => {
    set((state) => ({ cameraMode: state.cameraMode === 'chase' ? 'hood' : 'chase' }));
  },

  setSelectedCar: (index) => {
    set({ selectedCarIndex: index });
    const current = get();
    writeSaveData({
      highScores: current.highScores,
      bestTimes: current.bestTimes,
      selectedCar: index,
      carColors: current.carColors,
      settings: {
        graphicsQuality: current.graphicsQuality,
        soundVolume: current.soundVolume,
        musicVolume: current.musicVolume,
        controlsType: current.controlsType,
        isNight: current.isNight,
        showDebug: current.showDebug,
      },
    });
  },

  setCarColor: (carIndex, color) => {
    set((state) => {
      const newColors = [...state.carColors];
      newColors[carIndex] = color;
      const updated = { ...state, carColors: newColors };
      writeSaveData({
        highScores: updated.highScores,
        bestTimes: updated.bestTimes,
        selectedCar: updated.selectedCarIndex,
        carColors: newColors,
        settings: {
          graphicsQuality: updated.graphicsQuality,
          soundVolume: updated.soundVolume,
          musicVolume: updated.musicVolume,
          controlsType: updated.controlsType,
          isNight: updated.isNight,
          showDebug: updated.showDebug,
        },
      });
      return { carColors: newColors };
    });
  },

  setGraphicsQuality: (quality) => {
    set({ graphicsQuality: quality });
    get().saveSettings();
  },

  toggleDayNight: () => {
    set((state) => ({ isNight: !state.isNight }));
    get().saveSettings();
  },

  setControlsType: (type) => {
    set({ controlsType: type });
    get().saveSettings();
  },

  setTiltEnabled: (enabled) => {
    set({ tiltEnabled: enabled });
  },

  toggleMute: () => {
    set((state) => {
      const newMuted = !state.isMuted;
      soundManager.setMuted(newMuted);
      return { isMuted: newMuted };
    });
  },

  setSoundVolume: (vol) => {
    soundManager.setSFXVolume(vol);
    set({ soundVolume: vol });
    get().saveSettings();
  },

  setMusicVolume: (vol) => {
    soundManager.setMusicVolume(vol);
    set({ musicVolume: vol });
    get().saveSettings();
  },

  setShowDebug: (show) => {
    set({ showDebug: show });
    get().saveSettings();
  },

  setFps: (fps) => set({ fps }),

  saveSettings: () => {
    const state = get();
    writeSaveData({
      highScores: state.highScores,
      bestTimes: state.bestTimes,
      selectedCar: state.selectedCarIndex,
      carColors: state.carColors,
      settings: {
        graphicsQuality: state.graphicsQuality,
        soundVolume: state.soundVolume,
        musicVolume: state.musicVolume,
        controlsType: state.controlsType,
        isNight: state.isNight,
        showDebug: state.showDebug,
      },
    });
  },

  updateTelemetry: (data) => {
    set((state) => ({
      telemetry: { ...state.telemetry, ...data },
    }));

    // Feed real-time sound engine
    soundManager.updateTelemetry({
      rpm: data.rpm ?? get().telemetry.rpm,
      throttle: data.throttle ?? get().telemetry.throttle,
      isDrifting: data.isDrifting ?? get().telemetry.isDrifting,
      isNitro: data.isNitro ?? get().telemetry.isNitro,
      speed: data.speed ?? get().telemetry.speed,
    });
  },

  // Time Trial checkpoint triggered
  reachCheckpoint: (checkpointIndex) => {
    const { timeTrial, bestTimes } = get();
    if (!timeTrial.isRunning || timeTrial.completed) return;

    if (checkpointIndex === timeTrial.currentCheckpoint) {
      soundManager.playCheckpointChime();
      const nextCheckpoint = timeTrial.currentCheckpoint + 1;

      if (nextCheckpoint >= timeTrial.totalCheckpoints) {
        // Lap Completed!
        const finalTime = timeTrial.lapTime;
        const previousBest = bestTimes.timeTrial;
        const isNewRecord = !previousBest || finalTime < previousBest;

        const updatedBest = isNewRecord ? finalTime : previousBest;
        const newBestTimes = { ...bestTimes, timeTrial: updatedBest };

        set({
          timeTrial: {
            ...timeTrial,
            currentCheckpoint: nextCheckpoint,
            completed: true,
            isRunning: false,
            isNewRecord,
          },
          bestTimes: newBestTimes,
          gameState: 'results',
        });

        const state = get();
        writeSaveData({
          highScores: state.highScores,
          bestTimes: newBestTimes,
          selectedCar: state.selectedCarIndex,
          carColors: state.carColors,
          settings: {
            graphicsQuality: state.graphicsQuality,
            soundVolume: state.soundVolume,
            musicVolume: state.musicVolume,
            controlsType: state.controlsType,
            isNight: state.isNight,
            showDebug: state.showDebug,
          },
        });
      } else {
        set({
          timeTrial: { ...timeTrial, currentCheckpoint: nextCheckpoint },
        });
      }
    }
  },

  updateTimeTrialTimer: (dt) => {
    const { timeTrial } = get();
    if (timeTrial.isRunning && !timeTrial.completed) {
      set({
        timeTrial: { ...timeTrial, lapTime: timeTrial.lapTime + dt },
      });
    }
  },

  // Traffic drive near-miss bonus
  triggerNearMiss: (distanceMeters = 15) => {
    soundManager.playNearMissChime();
    set((state) => {
      const addedPoints = Math.round(150 * state.trafficDrive.multiplier);
      return {
        trafficDrive: {
          ...state.trafficDrive,
          score: state.trafficDrive.score + addedPoints,
          nearMisses: state.trafficDrive.nearMisses + 1,
          multiplier: Math.min(5, Number((state.trafficDrive.multiplier + 0.2).toFixed(1))),
        },
      };
    });
  },

  // Traffic drive distance progression
  updateTrafficDistance: (deltaDist) => {
    const { trafficDrive, highScores, gameState, gameMode } = get();
    if (gameState !== 'playing' || gameMode !== 'traffic' || trafficDrive.crashed) return;

    const newDist = trafficDrive.distance + deltaDist;
    const addedScore = Math.round(deltaDist * 0.5 * trafficDrive.multiplier);
    const newScore = trafficDrive.score + addedScore;

    set({
      trafficDrive: {
        ...trafficDrive,
        distance: newDist,
        score: newScore,
      },
    });
  },

  // Traffic drive crash
  triggerTrafficCrash: () => {
    const { trafficDrive, highScores } = get();
    if (trafficDrive.crashed) return;

    soundManager.playCollision(1.5);
    const isNewRecord = trafficDrive.score > (highScores.trafficDrive?.score || 0);
    const newHighScores = {
      ...highScores,
      trafficDrive: {
        score: Math.max(trafficDrive.score, highScores.trafficDrive?.score || 0),
        distance: Math.max(trafficDrive.distance, highScores.trafficDrive?.distance || 0),
        nearMisses: Math.max(trafficDrive.nearMisses, highScores.trafficDrive?.nearMisses || 0),
      },
    };

    set({
      trafficDrive: {
        ...trafficDrive,
        crashed: true,
        isNewRecord,
      },
      highScores: newHighScores,
      gameState: 'results',
    });

    const state = get();
    writeSaveData({
      highScores: newHighScores,
      bestTimes: state.bestTimes,
      selectedCar: state.selectedCarIndex,
      carColors: state.carColors,
      settings: {
        graphicsQuality: state.graphicsQuality,
        soundVolume: state.soundVolume,
        musicVolume: state.musicVolume,
        controlsType: state.controlsType,
        isNight: state.isNight,
        showDebug: state.showDebug,
      },
    });
  },
}));

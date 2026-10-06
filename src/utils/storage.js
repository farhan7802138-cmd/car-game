const STORAGE_KEY = 'apex_drift_3d_save_v1';

const DEFAULT_SAVE_DATA = {
  highScores: {
    trafficDrive: { score: 0, distance: 0, nearMisses: 0 },
    freeRoam: { maxDrift: 0 },
  },
  bestTimes: {
    timeTrial: null, // in seconds
  },
  selectedCar: 0,
  carColors: ['#ff2a55', '#ffa000', '#00e5ff'],
  settings: {
    graphicsQuality: 'high',
    soundVolume: 0.8,
    musicVolume: 0.5,
    controlsType: 'buttons', // 'buttons' | 'wheel' | 'tilt'
    isNight: false,
    showDebug: false,
  },
};

export function loadSaveData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SAVE_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SAVE_DATA,
      ...parsed,
      settings: { ...DEFAULT_SAVE_DATA.settings, ...(parsed.settings || {}) },
      highScores: { ...DEFAULT_SAVE_DATA.highScores, ...(parsed.highScores || {}) },
      bestTimes: { ...DEFAULT_SAVE_DATA.bestTimes, ...(parsed.bestTimes || {}) },
    };
  } catch (err) {
    console.warn('Failed to load save data from localStorage:', err);
    return DEFAULT_SAVE_DATA;
  }
}

export function writeSaveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

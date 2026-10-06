import * as THREE from 'three';

// Generate seamless asphalt texture with markings
export function createAsphaltTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark asphalt base
  ctx.fillStyle = '#22252c';
  ctx.fillRect(0, 0, 512, 512);

  // Grain noise
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const gray = Math.floor(25 + Math.random() * 25);
    ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Solid yellow edge lines
  ctx.fillStyle = '#ffb300';
  ctx.fillRect(16, 0, 8, 512);
  ctx.fillRect(488, 0, 8, 512);

  // Dashed white center line
  ctx.fillStyle = '#f0f4f8';
  for (let y = 0; y < 512; y += 64) {
    ctx.fillRect(252, y + 10, 8, 36);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Generate building facade texture with windows
export function createBuildingTexture(isNight = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Concrete exterior
  ctx.fillStyle = '#1c2230';
  ctx.fillRect(0, 0, 256, 512);

  // Window grid
  const cols = 8;
  const rows = 16;
  const padX = 10;
  const padY = 12;
  const w = 18;
  const h = 18;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padX + c * (w + 12);
      const y = padY + r * (h + 18);

      const isLit = Math.random() > 0.45;
      if (isLit) {
        ctx.fillStyle = Math.random() > 0.3 ? '#ffecb3' : '#a7e4ff';
      } else {
        ctx.fillStyle = '#0f1420';
      }
      ctx.fillRect(x, y, w, h);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Racing curb (red & white alternating stripes)
export function createRacingCurbTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#d32f2f';
  ctx.fillRect(0, 0, 64, 128);
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(64, 0, 64, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

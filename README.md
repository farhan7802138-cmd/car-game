# 🏎️ Apex Drift 3D - Ultimate Realistic 3D Car Driving Simulator

A production-grade, high-performance 3D realistic car driving game built with **React**, **Vite**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **@react-three/drei**, and **Rapier Physics (@react-three/rapier)**.

Engineered to run at a silky smooth 60 FPS on desktop and 30–60 FPS on modern mobile devices (Android Chrome, iOS Safari, iPads, tablets). Fully installable as an offline **Progressive Web App (PWA)**.

---

## ⚡ Quick Start & Commands

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or the port displayed in your terminal, e.g. `5174`) in your browser.

### 3. Production Build
```bash
npm run build
```
This compiles the optimized production bundle, generates the Service Worker, and creates all PWA assets in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🎮 Game Modes

1. **Free Roam**:
   - Drive freely across the expansive open world: city avenues, multi-lane highway, and the western Stunt & Drift Park.
   - Launch off physical stunt ramps, test top speeds, and rack up drift combos.

2. **Time Trial**:
   - A high-speed checkpoint circuit with **12 sequential holographic gates** spanning city roads and high-speed highway straights.
   - Live precision stopwatch, sector tracking, checkpoint chimes, and automatic persistence of your best lap record.

3. **Traffic Drive**:
   - High-intensity expressway survival mode featuring multi-lane dynamic AI traffic cars.
   - Score points based on distance traveled and thrilling **Near-Misses** (weave close past AI vehicles at high speed to unlock combo multipliers up to 5x!).
   - Detects physical collisions and saves your high scores.

---

## 🕹️ Controls

### Desktop Keyboard
| Key | Action |
| :--- | :--- |
| **W** / **Up Arrow** | Accelerate / Gas |
| **S** / **Down Arrow** | Brake / Reverse |
| **A** / **Left Arrow** | Steer Left |
| **D** / **Right Arrow** | Steer Right |
| **Spacebar** | Handbrake (Initiate Drift & Power Slide) |
| **Left / Right Shift** | Nitro NOS Boost (1.65x Acceleration) |
| **C** | Switch Camera (Chase ↔ Cockpit / Hood) |
| **R** | Respawn / Reset Vehicle |
| **Escape** | Pause / Resume Game |

### Gamepad (Xbox / PlayStation / Generic)
- **Left Thumbstick**: Analog steering
- **Right Trigger (RT / R2)**: Analog gas
- **Left Trigger (LT / L2)**: Analog brake
- **A / Cross Button**: Handbrake / Drift
- **B / Circle Button**: Nitro boost
- **X / Square Button**: Switch camera
- **Y / Triangle Button**: Respawn vehicle
- **Start / Options**: Pause game

### Mobile & Tablet Touch Controls
- **Multi-Touch Support**: Steer, accelerate, and nitro simultaneously with dedicated pointer tracking.
- **Left Side**: Choose between **Dual Touch Buttons** or **Interactive Virtual Steering Wheel** (rotates smoothly with your finger), or **Gyroscope Tilt Steering**.
- **Right Side**: Realistic textured **Gas Pedal** (Accelerator), wide **Brake Pedal**, **Drift Handbrake**, and **NOS Boost** button.
- **Haptic Feedback**: Subtle vibration feedback on button presses and collisions via the Web Vibration API.
- **Portrait Lock Overlay**: Guides players to rotate phones to landscape for full immersion.
- **Full Touch Guard**: Prevents browser pull-to-refresh, double-tap zoom, scrolling, and contextual menus.
- **Safe-Area Insets**: Adapts automatically around notches and dynamic islands on iPhones and modern Androids.

---

## ⚙️ Realistic Car Physics Engine

- **Rapier Rigid Body & Suspension**:
  - 4-wheel independent raycast suspension simulation with spring stiffness, compression velocity damping, and realistic ground contact.
  - Low center of gravity (`[0, -0.2, 0]`) and tuned chassis mass for planted high-speed cornering without unwanted tipping.
- **Automatic Gearbox & RPM Simulation**:
  - 5 forward gears + Reverse + Neutral.
  - Realistic engine RPM simulation (900 RPM idle up to 7,500 RPM redline) with tachometer redline shift warnings.
- **Drift Dynamics & Tire Friction**:
  - Handbrake cuts rear tire lateral grip from 0.88 down to 0.16, allowing smooth, controllable counter-steered drifting.
  - Dynamic tire smoke particles and asphalt rubber skid marks spawn when drifting or burning out.
- **Speed-Sensitive Steering**:
  - Steering lock scales down from 33° at low speeds to 8° at 180+ km/h to prevent violent rollover while maintaining agile responsiveness.
- **Aerodynamics & Stability**:
  - Aerodynamic downforce proportional to $v^2$ pushes the car firmly onto the track at high speeds.
  - Air drag opposes motion.
  - Real-time overturn detection with a 1-tap "RESPAWN" assist.

---

## 🚗 Included Cars & Custom GLB Model Support

### Built-in Procedural 3D Cars:
1. **Apex GT**: High-speed twin-turbo supercar with balanced grip and active rear wing.
2. **Viper Muscle**: High-torque American V8 with aggressive hood scoop, wide rear stance, and maximum drift capability.
3. **Phantom Hyper**: Lightweight Le Mans track prototype with carbon shark fin and extreme high-downforce GT wing.

### Custom Exterior Paint:
- 8 curated racing colors (Apex Crimson, Cyber Cyan, Sunset Orange, Venom Green, Electric Purple, Midnight Onyx, Pearl White, Solar Yellow) + **Custom Hex Color Picker**.

### Custom 3D `.glb` Models:
To use external 3D car models:
1. Download any free `.glb` model (e.g. from [Kenney.nl Car Kit](https://kenney.nl/assets/car-kit), [Poly Pizza](https://poly.pizza), or [Sketchfab CC0](https://sketchfab.com)).
2. Place the file inside `public/models/`:
   - `car_apex.glb`
   - `car_muscle.glb`
   - `car_hyper.glb`
3. The game will automatically load your custom GLB model with Draco compression support, and seamlessly falls back to the high-detail procedural models if not present!

---

## 🔊 Web Audio API Synthesizer (Zero External Audio Downloads)

Apex Drift 3D features a built-in procedural Web Audio synthesizer:
- **Engine Sound**: Dual sawtooth and triangle oscillators with dynamic low-pass filtering and volume tracking RPM and throttle load.
- **Tire Screech**: Filtered white noise modulated by lateral drift slip velocity.
- **Nitro Whoosh**: Resonant bandpass sweep and high-frequency rush.
- **Crash Impacts**: Bass drop punch and noise burst on physical collisions.
- **Checkpoints**: Melodic chimes on passing gates.
- **Cyberpunk Synth BGM**: Procedural electronic arpeggio bassline groove.
- **Audio Unlock Compliance**: Complies with mobile browser audio policies by resuming audio context on the first user interaction.

---

## 📱 PWA & Offline Installation

Apex Drift 3D includes a full Web App Manifest and Service Worker via `vite-plugin-pwa`:
- Works 100% offline after initial load.
- Native "INSTALL APP" button in the main menu using `beforeinstallprompt`.

### Installing on Android (Google Chrome):
1. Open the game in Chrome.
2. Tap the in-game **"INSTALL APP (PWA)"** button, or tap the three dots `⋮` > **Install app** (or **Add to Home screen**).
3. The game will launch full-screen without address bar clutter.

### Installing on iPhone / iPad (Apple Safari):
1. Open the game in Safari.
2. Tap the **Share** button (box with upward arrow).
3. Scroll down and tap **Add to Home Screen**.
4. Launch from your home screen in landscape mode for full-screen gaming.

---

## 🚀 Deployment Guide

### Deploying to Vercel
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root and follow prompts (Output directory: `dist`).
3. Or push your code to GitHub and import the repository directly in [vercel.com](https://vercel.com).

### Deploying to Netlify
1. Run `npm run build`.
2. Drag and drop the `dist` folder into [app.netlify.com/drop](https://app.netlify.com/drop).
3. Or connect your Git repository and set Build command: `npm run build`, Publish directory: `dist`.

### Deploying to GitHub Pages
1. In `vite.config.js`, add `base: '/<repository-name>/'`.
2. Build with `npm run build`.
3. Deploy the `dist` folder to your `gh-pages` branch.

---

## 📦 Optional: Packaging as Native Android APK with Capacitor

To build a standalone `.apk` using Capacitor:
```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor
npx cap init "Apex Drift 3D" "com.apexdrift.game" --web-dir dist

# 3. Build project
npm run build

# 4. Add Android platform
npx cap add android

# 5. Sync web build
npx cap sync

# 6. Open in Android Studio to build APK
npx cap open android
```
In Android Studio, click **Build > Build Bundle(s) / APK(s) > Build APK(s)** to produce a debug or release `.apk`.

---

## 📄 License
MIT License. Built with React Three Fiber & Rapier Physics.

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CAR_DEFINITIONS, COLOR_PRESETS } from '../../utils/carDefinitions';
import { ChevronLeft, ChevronRight, Check, ArrowLeft, Play, Gauge, Zap, Compass, Disc } from 'lucide-react';

export function CarSelect() {
  const setGameState = useGameStore((s) => s.setGameState);
  const startGame = useGameStore((s) => s.startGame);
  const selectedCarIndex = useGameStore((s) => s.selectedCarIndex);
  const setSelectedCar = useGameStore((s) => s.setSelectedCar);
  const carColors = useGameStore((s) => s.carColors);
  const setCarColor = useGameStore((s) => s.setCarColor);

  const car = CAR_DEFINITIONS[selectedCarIndex] || CAR_DEFINITIONS[0];
  const currentColor = carColors[selectedCarIndex] || car.defaultColor;

  const nextCar = () => {
    setSelectedCar((selectedCarIndex + 1) % CAR_DEFINITIONS.length);
  };

  const prevCar = () => {
    setSelectedCar((selectedCarIndex - 1 + CAR_DEFINITIONS.length) % CAR_DEFINITIONS.length);
  };

  return (
    <div className="menu-backdrop">
      <div className="car-select-container">
        {/* Top Header */}
        <div className="car-select-top">
          <button className="back-btn" onClick={() => setGameState('menu')}>
            <ArrowLeft size={18} />
            <span>BACK</span>
          </button>
          <h2>GARAGE / VEHICLE SHOWROOM</h2>
          <div style={{ width: 80 }} />
        </div>

        {/* Vehicle Showcase Card */}
        <div className="car-showcase-card">
          {/* Car Navigation Header */}
          <div className="car-nav-row">
            <button className="nav-arrow-btn" onClick={prevCar}>
              <ChevronLeft size={28} />
            </button>
            <div className="car-title-block">
              <span className="car-type-tag">{car.type}</span>
              <h1 className="car-name-heading">{car.name}</h1>
              <p className="car-desc-text">{car.description}</p>
            </div>
            <button className="nav-arrow-btn" onClick={nextCar}>
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Color Customizer */}
          <div className="customizer-section">
            <div className="section-title">EXTERIOR PAINT FINISH</div>
            <div className="palette-swatches-row">
              {COLOR_PRESETS.map((p) => {
                const isSelected = currentColor.toLowerCase() === p.hex.toLowerCase();
                return (
                  <button
                    key={p.hex}
                    className={`color-swatch-btn ${isSelected ? 'active-swatch' : ''}`}
                    style={{ backgroundColor: p.hex }}
                    onClick={() => setCarColor(selectedCarIndex, p.hex)}
                    title={p.name}
                  >
                    {isSelected && <Check size={14} color={p.hex === '#f0f4f8' ? '#000' : '#fff'} />}
                  </button>
                );
              })}

              {/* Custom Color Input */}
              <div className="custom-color-wrap">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCarColor(selectedCarIndex, e.target.value)}
                  className="custom-color-picker"
                  title="Choose Custom Hex Color"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Stats Matrix */}
          <div className="stats-matrix">
            <div className="stat-card">
              <div className="stat-header">
                <Gauge size={16} className="text-cyan" />
                <span>TOP SPEED</span>
              </div>
              <div className="stat-value">{car.topSpeed} KM/H</div>
              <div className="stat-track">
                <div
                  className="stat-fill"
                  style={{ width: `${(car.topSpeed / 300) * 100}%` }}
                />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <Zap size={16} className="text-amber" />
                <span>ACCELERATION</span>
              </div>
              <div className="stat-value">{car.acceleration} / 10</div>
              <div className="stat-track">
                <div
                  className="stat-fill"
                  style={{ width: `${(car.acceleration / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <Compass size={16} className="text-emerald" />
                <span>HANDLING</span>
              </div>
              <div className="stat-value">{car.handling} / 10</div>
              <div className="stat-track">
                <div
                  className="stat-fill"
                  style={{ width: `${(car.handling / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <Disc size={16} className="text-rose" />
                <span>DRIFT FACTOR</span>
              </div>
              <div className="stat-value">{car.driftRating} / 10</div>
              <div className="stat-track">
                <div
                  className="stat-fill"
                  style={{ width: `${(car.driftRating / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Select and Drive Button */}
          <div className="car-select-actions">
            <button className="drive-btn" onClick={() => startGame()}>
              <Play size={20} />
              <span>SELECT & DRIVE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

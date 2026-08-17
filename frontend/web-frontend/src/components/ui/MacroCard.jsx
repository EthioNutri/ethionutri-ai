import React from 'react';

const MacroCard = ({
  name,
  consumed,
  target,
  unit = 'g',
  color = '#1F4B3F',
  isWater = false,
}) => {
  const percent = Math.min(100, Math.round((consumed / target) * 100));

  if (isWater) {
    return (
      <div className="macro-card macro-card-water">
        <div className="macro-header">
          <div className="macro-label-row">
            <span className="water-drop-icon">💧</span>
            <span className="macro-title">{name}</span>
          </div>
        </div>
        <div className="macro-values">
          <span className="macro-consumed water-color">{consumed}{unit}</span>
          <span className="macro-target"> / {target}{unit}</span>
        </div>
        <div className="macro-progress-track">
          <div
            className="macro-progress-fill"
            style={{
              width: `${percent}%`,
              backgroundColor: '#3B82F6',
            }}
          />
        </div>
        {/* Soft background water drop watermark */}
        <div className="water-watermark">💧</div>
      </div>
    );
  }

  return (
    <div className="macro-card">
      <div className="macro-header">
        <div className="macro-label-row">
          <span className="macro-dot" style={{ backgroundColor: color }} />
          <span className="macro-title">{name}</span>
        </div>
      </div>
      <div className="macro-values">
        <span className="macro-consumed">{consumed}{unit}</span>
        <span className="macro-target"> / {target}{unit}</span>
      </div>
      <div className="macro-progress-track">
        <div
          className="macro-progress-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default MacroCard;

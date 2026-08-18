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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#5FA8F5" stroke="#5FA8F5" strokeWidth="1.5">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <span className="macro-title water-title">{name}</span>
          </div>
        </div>
        <div className="macro-values">
          <span className="macro-consumed water-color">{consumed}{unit}</span>
          <span className="macro-target water-target"> / {target}{unit}</span>
        </div>
        <div className="macro-progress-track water-track">
          <div
            className="macro-progress-fill"
            style={{
              width: `${percent}%`,
              backgroundColor: '#5FA8F5',
            }}
          />
        </div>
        {/* Soft background water drop watermark */}
        <div className="water-watermark">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#5FA8F5" strokeWidth="1.5">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        </div>
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

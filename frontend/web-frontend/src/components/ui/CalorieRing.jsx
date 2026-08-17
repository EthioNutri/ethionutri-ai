import React from 'react';

const CalorieRing = ({
  consumed = 1240,
  target = 2100,
  size = 200,
  strokeWidth = 14,
  label = "kcal eaten"
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((consumed / target) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Create arc effect or full circular progress
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="calorie-ring-container" style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="calorie-svg">
        {/* Track circle (warm earthy brown/tan) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#C97B3D"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={-circumference * 0.125}
          strokeLinecap="round"
          style={{ opacity: 0.85 }}
        />
        {/* Progress circle (deep forest green) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F4B3F"
          strokeWidth={strokeWidth + 1}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      
      {/* Centered Calorie Number */}
      <div className="calorie-ring-center">
        <div className="calorie-number">{consumed.toLocaleString()}</div>
        <div className="calorie-label">{label}</div>
      </div>
    </div>
  );
};

export default CalorieRing;

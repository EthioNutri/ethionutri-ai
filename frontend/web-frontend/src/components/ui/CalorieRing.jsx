import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const CalorieRing = ({
  consumed = 0,
  target = 2000,
  size = 220,
  strokeWidth = 14,
  label = "kcal eaten",
  macroCompliancePercent = null
}) => {
  const { isDark } = useTheme();
  const outerRadius = (size - strokeWidth) / 2;
  const innerRadius = outerRadius - strokeWidth - 2;

  // Arc length calculations for open gauge (270 degrees)
  const totalArcAngle = 270;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const outerArcLength = (totalArcAngle / 360) * outerCircumference;
  const innerArcLength = (totalArcAngle / 360) * innerCircumference;

  // Progress Percentages dynamically computed
  const safeTarget = target > 0 ? target : 2000;
  const caloriePercent = Math.min(1, Math.max(0, consumed / safeTarget));
  
  // Secondary inner ring represents either macro compliance or proportional protein progress
  const innerPercent = macroCompliancePercent !== null
    ? Math.min(1, Math.max(0, macroCompliancePercent))
    : Math.min(1, caloriePercent * 0.9);

  // Colors based on theme
  const trackColor = isDark ? '#252728' : '#EAE5DF';
  const outerColor = isDark ? '#F4A876' : '#C97B3D';
  const innerColor = isDark ? '#7FD9A8' : '#1F4B3F';

  return (
    <div className="calorie-ring-container" style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="calorie-svg">
        {/* Background Track (Arc) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${outerArcLength} ${outerCircumference}`}
          strokeDashoffset={-((360 - totalArcAngle) / 2 / 360) * outerCircumference}
          strokeLinecap="round"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        />

        {/* Outer Peach/Terracotta Progress Arc (Dynamic Calories) */}
        {caloriePercent > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={outerRadius}
            fill="none"
            stroke={outerColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${outerArcLength * caloriePercent} ${outerCircumference}`}
            strokeDashoffset={-((360 - totalArcAngle) / 2 / 360) * outerCircumference}
            strokeLinecap="round"
            transform={`rotate(90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}

        {/* Inner Mint Green Progress Arc (Dynamic Secondary Progress) */}
        {innerPercent > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={innerRadius}
            fill="none"
            stroke={innerColor}
            strokeWidth={strokeWidth - 2}
            strokeDasharray={`${innerArcLength * innerPercent} ${innerCircumference}`}
            strokeDashoffset={-((360 - totalArcAngle) / 2 / 360) * innerCircumference}
            strokeLinecap="round"
            transform={`rotate(90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}
      </svg>
      
      {/* Centered Calorie Number */}
      <div className="calorie-ring-center">
        <div className="calorie-number">{Math.round(consumed).toLocaleString()}</div>
        <div className="calorie-label">{label}</div>
      </div>
    </div>
  );
};

export default CalorieRing;

import React from 'react';

const HeroBanner = ({
  cycleTitle = "Wednesday Fast",
  dayText = "Day 3",
  description = "Adhering to strict plant-based guidelines. Your body is adapting well, maintaining good hydration levels.",
  allowedLabel = "100% Plant-Based (Tsom)",
  icon = "🌿",
}) => {
  return (
    <div className="hero-banner-card">
      <div className="hero-banner-content">
        <div className="hero-banner-badge-top">CURRENT CYCLE</div>
        <h1 className="hero-banner-title">
          {cycleTitle} <span className="hero-day-text">{dayText}</span>
        </h1>
        <p className="hero-banner-desc">{description}</p>
      </div>

      <div className="hero-status-pill">
        <div className="hero-status-icon-wrap">
          <span className="hero-leaf-icon">{icon}</span>
        </div>
        <div className="hero-status-text-wrap">
          <div className="hero-status-sub">Allowed Today</div>
          <div className="hero-status-main">{allowedLabel}</div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

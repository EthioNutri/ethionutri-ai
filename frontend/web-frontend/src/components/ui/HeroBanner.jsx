import React from 'react';

const HeroBanner = ({
  cycleTitle = "Wednesday Fast",
  dayText = "Day 3",
  description = "Adhering to strict plant-based guidelines. Your body is adapting well, maintaining good hydration levels.",
  allowedLabel = "100% Plant-Based (Tsom)",
}) => {
  return (
    <div className="hero-banner-card">
      <div className="hero-banner-content">
        <div className="hero-banner-badge-top">CURRENT CYCLE</div>
        <h1 className="hero-banner-title">
          <span className="hero-cycle-title">{cycleTitle}</span>
          <span className="hero-day-text">{dayText}</span>
        </h1>
        <p className="hero-banner-desc">{description}</p>
      </div>

      <div className="hero-status-pill">
        <div className="hero-status-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4FDE8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
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

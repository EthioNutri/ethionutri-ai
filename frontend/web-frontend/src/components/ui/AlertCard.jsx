import React from 'react';

const AlertCard = ({
  title = "Iron intake low",
  description = "You are tracking below your target for iron today. Consider adding lentils or teff to your next meal.",
  onActionClick,
  actionText
}) => {
  return (
    <div className="nutrient-alert-card">
      <div className="alert-card-icon-col">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-triangle-svg">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <div className="alert-card-text-col">
        <h4 className="alert-card-title">{title}</h4>
        <p className="alert-card-desc">{description}</p>
        {actionText && (
          <button className="alert-action-btn" onClick={onActionClick}>
            {actionText} →
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;

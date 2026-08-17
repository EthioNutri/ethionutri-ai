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
        <div className="alert-triangle-icon">⚠️</div>
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

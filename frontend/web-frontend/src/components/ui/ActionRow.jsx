import React from 'react';

const ActionRow = ({ onScanMeal, onVoiceLog, onManualEntry }) => {
  return (
    <div className="action-buttons-row">
      {/* Scan Meal */}
      <button className="action-tile-btn" onClick={onScanMeal}>
        <div className="action-icon-circle action-icon-orange">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4A876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
        <span className="action-tile-label">Scan Meal</span>
      </button>

      {/* Voice Log */}
      <button className="action-tile-btn" onClick={onVoiceLog}>
        <div className="action-icon-circle action-icon-green">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7FD9A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </div>
        <span className="action-tile-label">Voice Log</span>
      </button>

      {/* Manual Entry */}
      <button className="action-tile-btn" onClick={onManualEntry}>
        <div className="action-icon-circle action-icon-orange">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4A876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <span className="action-tile-label">Manual Entry</span>
      </button>
    </div>
  );
};

export default ActionRow;

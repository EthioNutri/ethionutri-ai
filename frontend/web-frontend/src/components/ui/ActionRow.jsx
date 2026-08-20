import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ActionRow = ({ onVoiceLog, onManualEntry }) => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';

  return (
    <div className="action-buttons-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {/* Voice Log */}
      <button className="action-tile-btn" onClick={onVoiceLog} style={{ flex: 1 }}>
        <div className="action-icon-circle action-icon-green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7FD9A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </div>
        <div style={{ textAlign: 'left' }}>
          <span className="action-tile-label" style={{ fontSize: '15px', fontWeight: 800, display: 'block' }}>
            {isAmharic ? 'በድምጽ መዝግብ' : 'Voice Log'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: '2px', display: 'block' }}>
            {isAmharic ? 'በአማርኛ ወይም በእንግሊዝኛ ይናገሩ' : 'AI Speech Transcription'}
          </span>
        </div>
      </button>

      {/* Manual Entry */}
      <button className="action-tile-btn" onClick={onManualEntry} style={{ flex: 1 }}>
        <div className="action-icon-circle action-icon-orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4A876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <div style={{ textAlign: 'left' }}>
          <span className="action-tile-label" style={{ fontSize: '15px', fontWeight: 800, display: 'block' }}>
            {isAmharic ? 'በጽሑፍ መዝግብ' : 'Manual Entry'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: '2px', display: 'block' }}>
            {isAmharic ? 'የኢትዮጵያ ምግቦች ዝርዝር' : 'Ethiopian Food Presets'}
          </span>
        </div>
      </button>
    </div>
  );
};

export default ActionRow;


import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';

const NutritionistAI = () => {
  const { chatMessages, sendChatMessage } = useNutrition();
  const [inputText, setInputText] = useState('');
  const [dataConsentActive, setDataConsentActive] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const suggestedQuestions = [
    'What should I eat tonight?',
    'Am I getting enough iron on fasting days?',
    'How do I boost my protein during Wednesday fast?',
    'Is Teff Injera suitable for blood sugar management?',
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickQuestion = (q) => {
    sendChatMessage(q);
  };

  const handleVoicePrompt = () => {
    setIsRecording(true);
    setToastMsg('🎙️ Listening to voice question (Amharic / English)...');
    setTimeout(() => {
      setIsRecording(false);
      sendChatMessage('How can I optimize my iron absorption with Ethiopian food?');
      setToastMsg('');
    }, 1800);
  };

  const handleBookSession = (e) => {
    e.preventDefault();
    setShowBookingModal(false);
    setToastMsg('📅 Consultation booked with Dr. Selamawit for Friday, 10:00 AM!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="nutritionist-page-container">
      {/* Toast */}
      {toastMsg && (
        <div className="app-toast-alert">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="supervision-header">
        <h1 className="supervision-title">Professional Supervision</h1>
        <p className="supervision-sub">
          Manage your consultations and shared nutrition telemetry.
        </p>
      </div>

      {/* 2-Column Grid matching Screenshot 5 */}
      <div className="supervision-grid">
        {/* Left Column: Doctor Profile & Upcoming Sessions */}
        <div className="dietitian-profile-column">
          {/* Profile Card */}
          <div className="dietitian-card">
            <div className="dietitian-avatar-circle">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                alt="Dr. Selamawit Tadesse"
                className="doctor-photo"
              />
            </div>

            <h2 className="doctor-name">Dr. Selamawit Tadesse</h2>
            <div className="doctor-role-badge">REGISTERED DIETITIAN</div>

            <div className="doctor-meta-block">
              <div className="meta-sublabel">EXPERTISE</div>
              <p className="meta-detail">
                Ethiopian traditional diets, Clinical nutrition, Fasting management.
              </p>
            </div>

            <div className="doctor-meta-block">
              <div className="meta-sublabel">LANGUAGES</div>
              <p className="meta-detail">Amharic, English</p>
            </div>

            <button className="btn-book-consult" onClick={() => setShowBookingModal(true)}>
              <span className="calendar-icon">📅</span> Book Consultation
            </button>
          </div>

          {/* Upcoming Sessions Card */}
          <div className="upcoming-sessions-card">
            <div className="sessions-header-row">
              <h4 className="sessions-heading">Upcoming Sessions</h4>
              <button className="btn-add-session-icon" onClick={() => setShowBookingModal(true)}>+</button>
            </div>

            <div className="session-item-badge">
              <div className="session-date-box">
                <span className="session-month">OCT</span>
                <span className="session-day">12</span>
              </div>
              <div className="session-details">
                <h5 className="session-title">Follow-up: Abiy Tsom Prep</h5>
                <div className="session-time">🕒 10:00 AM (EAT)</div>
              </div>
            </div>

            <button className="btn-view-calendar" onClick={() => setShowBookingModal(true)}>
              View Calendar
            </button>
          </div>
        </div>

        {/* Right Column: Data Sharing Consent + Chat Panel */}
        <div className="chat-and-consent-column">
          {/* Data Sharing Consent Card (Screenshot 5) */}
          <div className="data-consent-card">
            <div className="consent-top-row">
              <div>
                <h4 className="consent-title">Data Sharing Consent</h4>
                <p className="consent-sub">Control what Dr. Selamawit and AI nutritionist can view.</p>
              </div>

              {/* Toggle Switch */}
              <div className="toggle-switch-wrap">
                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={dataConsentActive}
                    onChange={() => setDataConsentActive(!dataConsentActive)}
                  />
                  <span className="slider-round"></span>
                </label>
                <span className="switch-text">{dataConsentActive ? 'Active' : 'Paused'}</span>
              </div>
            </div>

            {/* Shared Telemetry Row */}
            <div className="shared-telemetry-grid">
              <div className="telemetry-chip shared-neutral">
                <div className="chip-head">
                  <span className="chip-icon">🍴</span>
                  <span className="chip-tag">Shared</span>
                </div>
                <div className="chip-label">Recent Logs</div>
                <div className="chip-value">Avg 1850 kcal/day</div>
              </div>

              <div className="telemetry-chip shared-neutral">
                <div className="chip-head">
                  <span className="chip-icon">📅</span>
                  <span className="chip-tag">Shared</span>
                </div>
                <div className="chip-label">Fasting Adherence</div>
                <div className="chip-value">92% Compliance</div>
              </div>

              <div className="telemetry-chip shared-alert">
                <div className="chip-head">
                  <span className="chip-icon">⚠️</span>
                  <span className="chip-tag alert">Alert Shared</span>
                </div>
                <div className="chip-label">Iron Levels</div>
                <div className="chip-value alert-text">Below target (Last 7d)</div>
              </div>
            </div>
          </div>

          {/* Secure AI Nutritionist Chat Panel (Screenshot 5) */}
          <div className="secure-chat-card">
            {/* Chat Top Banner */}
            <div className="chat-top-banner">
              <div className="chat-status-left">
                <span className="chat-icon">💬</span>
                <span className="chat-heading">Secure Messages</span>
                <span className="chat-online-indicator">
                  <span className="green-pulse-dot" /> AI Nutritionist is Online
                </span>
              </div>
              <div className="chat-encrypted-badge">
                🔒 Encrypted End-to-End
              </div>
            </div>

            {/* Suggested Question Chips */}
            <div className="suggested-chips-scroll">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className="suggested-q-chip"
                  onClick={() => handleQuickQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="chat-messages-viewport">
              {chatMessages.map((msg) => {
                const isAi = msg.sender === 'nutritionist';
                return (
                  <div
                    key={msg.id}
                    className={`chat-bubble-row ${isAi ? 'bubble-ai-row' : 'bubble-user-row'}`}
                  >
                    {isAi && (
                      <div className="ai-chat-avatar">
                        🌱
                      </div>
                    )}

                    <div className={`chat-bubble ${isAi ? 'bubble-ai' : 'bubble-user'}`}>
                      <p className="bubble-text">{msg.text}</p>
                      <span className="bubble-timestamp">
                        {msg.time} {isAi ? '' : '✓✓'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Input Form */}
            <form onSubmit={handleSend} className="chat-input-form">
              <button
                type="button"
                className="chat-attach-btn"
                title="Attach meal photo or blood panel lab report"
                onClick={() => setToastMsg('📎 Attachment support ready (Upload lab/photo)')}
              >
                📎
              </button>
              <button
                type="button"
                className={`chat-mic-btn ${isRecording ? 'recording' : ''}`}
                title="Voice input in Amharic or English"
                onClick={handleVoicePrompt}
              >
                🎙️
              </button>
              <input
                type="text"
                className="chat-text-input"
                placeholder="Type a message or ask about fasting nutrition..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="chat-send-btn" title="Send Message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Book Consultation Modal */}
      {showBookingModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title">Book Nutritionist Consultation</h3>
              <button className="modal-close-btn" onClick={() => setShowBookingModal(false)}>✕</button>
            </div>
            <form onSubmit={handleBookSession} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Consultant</label>
                <div style={{ padding: '10px 14px', background: '#F8F5F0', borderRadius: '10px', fontWeight: 600 }}>
                  Dr. Selamawit Tadesse (RD, Heritage Nutrition)
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">Consultation Focus</label>
                <select className="modal-input">
                  <option>Tsom Fasting Transition & Iron Optimization</option>
                  <option>Personalized Diabetes / Blood Sugar Heritage Diet</option>
                  <option>Post-Fasting Re-feeding & Muscle Building</option>
                  <option>General Ethiopian Culinary Nutrition Review</option>
                </select>
              </div>

              <div className="form-row-2" style={{ marginTop: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input type="date" className="modal-input" defaultValue="2023-10-16" />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time (EAT)</label>
                  <select className="modal-input">
                    <option>10:00 AM</option>
                    <option>2:00 PM</option>
                    <option>4:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-footer" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-modal-cancel" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Confirm Consultation (30 min)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionistAI;

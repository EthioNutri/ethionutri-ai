import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Formats an ISO timestamp into a short local time string, e.g. "9:15 AM".
function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * SecureChat — dumb/presentational chat UI. Takes messages and a send
 * handler as props so it has no idea whether data is mocked or real.
 *
 * Once the backend chat endpoint exists, the PARENT (NutritionistSupervision)
 * should be the only thing that changes: fetch real messages, pass a real
 * onSendMessage that calls the API. This component's internals stay the same.
 */
const SecureChat = ({
  messages = [],
  dietitianName = 'Dr. Selamawit Tadesse',
  isDietitianOnline = false,
  onSendMessage,
}) => {
  const { t } = useLanguage();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the latest message whenever the list changes.
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    if (onSendMessage) {
      onSendMessage({ type: 'text', text: trimmed });
    }
    setDraft('');
  };

  const handleAudioClick = () => {
    // TODO: wire up real audio recording once the backend supports it.
    // Kept as a no-op stub for now so the UI trigger exists per FE-SUP-03.
    if (onSendMessage) {
      onSendMessage({ type: 'audio', text: null });
    }
  };

  const handleAttachClick = () => {
    // TODO: wire up real file attachment once the backend supports it.
  };

  return (
    <div className="secure-chat">
      <div className="secure-chat-header">
        <div className="secure-chat-header-title">
          <span className="secure-chat-title-text">{t('secureChatTitle')}</span>
          <span className="secure-chat-online-status">
            <span className={`online-dot ${isDietitianOnline ? 'online-dot-active' : ''}`} />
            {dietitianName} {isDietitianOnline ? t('secureChatOnlineLabel') : t('secureChatOfflineLabel')}
          </span>
        </div>
        <span className="secure-chat-encrypted-badge">
          🔒 {t('secureChatEncrypted')}
        </span>
      </div>

      <div className="secure-chat-messages" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.sender === 'user' ? 'chat-bubble-row-user' : 'chat-bubble-row-doctor'}`}
          >
            <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-doctor'}`}>
              {msg.type === 'audio' ? (
                <span className="chat-bubble-audio">🎤 {t('secureChatAudioMessage')}</span>
              ) : (
                <span>{msg.text}</span>
              )}
              <span className="chat-bubble-time">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>

      <form className="secure-chat-input-row" onSubmit={handleSend}>
        <button
          type="button"
          className="chat-icon-btn"
          onClick={handleAttachClick}
          aria-label={t('secureChatAttach')}
        >
          📎
        </button>
        <button
          type="button"
          className="chat-icon-btn"
          onClick={handleAudioClick}
          aria-label={t('secureChatAudioMessage')}
        >
          🎤
        </button>
        <input
          type="text"
          className="secure-chat-input"
          placeholder={t('secureChatPlaceholder')}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="chat-send-btn" aria-label={t('secureChatSend')}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default SecureChat;
import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';

const NutritionistAI = () => {
  const { chatMessages, sendChatMessage } = useNutrition();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const suggestedQuestions = [
    'What should I eat tonight?',
    'Am I getting enough iron on fasting days?',
    'How do I boost my protein during Wednesday fast?',
    'Is Teff Injera suitable for blood sugar management?',
  ];

  const handleSend = (e) => {
    e.preventDefault();

    const message = inputText.trim();

    if (!message) return;

    sendChatMessage(message);
    setInputText('');
  };

  const handleQuickQuestion = (question) => {
    sendChatMessage(question);
  };

  const handleVoicePrompt = () => {
    if (isRecording) return;

    setIsRecording(true);
    setToastMsg('🎙️ Listening for your nutrition question...');

    // Temporary frontend simulation.
    // Replace with real speech-to-text integration later.
    setTimeout(() => {
      setIsRecording(false);

      sendChatMessage(
        'How can I optimize my iron absorption with Ethiopian food?'
      );

      setToastMsg('');
    }, 1800);
  };

  const handleAttachment = () => {
    // Temporary UI behavior until file-upload/API support is available.
    setToastMsg('📎 Meal photo and lab report upload will be connected later.');

    setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  return (
    <div className="nutritionist-page-container nutritionist-chat-only">
      {toastMsg && (
        <div className="app-toast-alert" role="status">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="supervision-header">
        <h1 className="supervision-title">AI Nutritionist</h1>

        <p className="supervision-sub">
          Get personalized nutrition guidance based on your Ethiopian foods,
          fasting practices, and nutrition goals.
        </p>
      </div>

      {/* AI Chat */}
      <div className="secure-chat-card">
        {/* Chat Header */}
        <div className="chat-top-banner">
          <div className="chat-status-left">
            <span className="chat-icon" aria-hidden="true">
              💬
            </span>

            <span className="chat-heading">
              AI Nutritionist
            </span>

            <span className="chat-online-indicator">
              <span
                className="green-pulse-dot"
                aria-hidden="true"
              />
              AI Nutritionist is Online
            </span>
          </div>

          <div className="chat-encrypted-badge">
            🔒 Secure AI Chat
          </div>
        </div>

        {/* Suggested Questions */}
        <div
          className="suggested-chips-scroll"
          aria-label="Suggested nutrition questions"
        >
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              className="suggested-q-chip"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="chat-messages-viewport">
          {chatMessages.map((message) => {
            const isAi = message.sender === 'nutritionist';

            return (
              <div
                key={message.id}
                className={`chat-bubble-row ${
                  isAi ? 'bubble-ai-row' : 'bubble-user-row'
                }`}
              >
                {isAi && (
                  <div
                    className="ai-chat-avatar"
                    aria-label="AI Nutritionist"
                  >
                    🌱
                  </div>
                )}

                <div
                  className={`chat-bubble ${
                    isAi ? 'bubble-ai' : 'bubble-user'
                  }`}
                >
                  <p className="bubble-text">
                    {message.text}
                  </p>

                  <span className="bubble-timestamp">
                    {message.time}
                    {!isAi && ' ✓✓'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSend}
          className="chat-input-form"
        >
          <button
            type="button"
            className="chat-attach-btn"
            title="Attach meal photo or lab report"
            aria-label="Attach meal photo or lab report"
            onClick={handleAttachment}
          >
            📎
          </button>

          <button
            type="button"
            className={`chat-mic-btn ${
              isRecording ? 'recording' : ''
            }`}
            title="Ask using voice"
            aria-label="Ask using voice"
            onClick={handleVoicePrompt}
          >
            🎙️
          </button>

          <input
            type="text"
            className="chat-text-input"
            placeholder="Ask about Ethiopian foods, fasting, meals, or nutrition..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            aria-label="Message AI Nutritionist"
          />

          <button
            type="submit"
            className="chat-send-btn"
            title="Send message"
            aria-label="Send message"
            disabled={!inputText.trim()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NutritionistAI;
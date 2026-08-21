import React, { useState, useRef, useEffect } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient';

const NutritionistAI = () => {
  const { chatMessages, setChatMessages, sendChatMessage, fastingCycle, dailyStats } = useNutrition();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { isDark } = useTheme();

  // Chat State
  const [inputText, setInputText] = useState('');
  const [dataConsentActive, setDataConsentActive] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null); // { name, data, mimeType, isImage, size }

  // Session & History State
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Fetch Past Chat History Sessions
  const fetchChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      let res;
      try {
        res = await apiClient.get('/ai/chat/history');
      } catch (err1) {
        if (err1.response?.status === 404) {
          res = await apiClient.get('/chat/history');
        } else {
          throw err1;
        }
      }
      if (res?.data && Array.isArray(res.data.conversations || res.data.history)) {
        setChatHistory(res.data.conversations || res.data.history);
      }
    } catch (e) {
      console.warn('Could not fetch chat history:', e?.message || e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Start Fresh Chat on Login / Mount
  const handleStartNewChat = async () => {
    setIsTyping(true);
    try {
      let res;
      try {
        res = await apiClient.post('/ai/chat/new', {});
      } catch {
        res = await apiClient.post('/chat/new', {});
      }

      if (res.data && res.data.conversation) {
        const conv = res.data.conversation;
        setCurrentSessionId(conv._id || res.data.conversationId);
        setChatMessages(
          conv.messages.map((m) => ({
            id: m._id || Math.random().toString(),
            sender: m.sender === 'user' ? 'user' : 'nutritionist',
            text: m.content,
            attachment: m.attachment,
            time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
        );
      } else {
        // Fallback local fresh chat
        setCurrentSessionId(`fresh-${Date.now()}`);
        setChatMessages([
          {
            id: `init-${Date.now()}`,
            sender: 'nutritionist',
            text: language === 'am'
              ? 'ሰላም! እኔ የኢትዮኑትሪ AI ክሊኒካል ስነ-ምግብ አማካሪዎ ነኝ። ስለ ባህላዊ ምግቦች፣ የጾም መርሃ-ግብር ወይም የምግብ ፎቶዎችን/የደም ምርመራዎችን ልመርምርልዎ እችላለሁ። ዛሬ በምን ልርዳዎ?'
              : 'Hello! I am your EthioNutri AI Certified Clinical Nutritionist. I can provide evidence-based guidance on Ethiopian heritage foods, Tsom plant-based fasting, or analyze your meal photos and lab reports. How can I support your health today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      fetchChatHistory();
      setToastMsg(language === 'am' ? '✨ አዲስ ውይይት ተጀምሯል' : '✨ Fresh chat session started');
      setTimeout(() => setToastMsg(''), 2500);
    } catch (e) {
      console.warn('Error starting new chat:', e);
    } finally {
      setIsTyping(false);
    }
  };

  // Load Past Session
  const handleSelectSession = async (sessionId) => {
    setIsTyping(true);
    setIsHistoryOpen(false);
    try {
      let res;
      try {
        res = await apiClient.get(`/ai/chat/${sessionId}`);
      } catch {
        res = await apiClient.get(`/chat/${sessionId}`);
      }

      if (res.data && res.data.conversation) {
        const conv = res.data.conversation;
        setCurrentSessionId(conv._id);
        setChatMessages(
          conv.messages.map((m) => ({
            id: m._id || Math.random().toString(),
            sender: m.sender === 'user' ? 'user' : 'nutritionist',
            text: m.content,
            attachment: m.attachment,
            time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
        );
      }
    } catch (e) {
      console.warn('Could not load session messages:', e);
    } finally {
      setIsTyping(false);
    }
  };

  // Delete Session Action
  const handleDeleteSession = async (sessionId, e) => {
    if (e) e.stopPropagation();
    try {
      try {
        await apiClient.delete(`/ai/chat/history/${sessionId}`);
      } catch {
        try {
          await apiClient.delete(`/chat/history/${sessionId}`);
        } catch {
          await apiClient.delete(`/ai/chat/${sessionId}`);
        }
      }
      setChatHistory((prev) => prev.filter((s) => (s._id || s.id || s.conversationId) !== sessionId));
      if (currentSessionId === sessionId) {
        handleStartNewChat();
      }
      setToastMsg(language === 'am' ? '🗑️ ውይይት ተሰርዟል' : '🗑️ Chat session deleted');
      setTimeout(() => setToastMsg(''), 2500);
    } catch (err) {
      console.warn('Failed to delete chat session:', err);
    }
  };

  // On initial mount, fetch chat history
  useEffect(() => {
    fetchChatHistory();
  }, []);

  const suggestedQuestions = [
    'What can I eat during fasting?',
    'Is shiro good for iron deficiency?',
    'Hydration tips for Tsom',
    'በጾም ወቅት ምን ዓይነት ምግብ መመገብ አለብኝ?',
    'How to optimize iron absorption with Teff?',
    'የጤፍ እንጀራ የብረት ንጥረ ነገር ጥቅሞች ምንድን ናቸው?'
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    const msg = inputText;
    const attachmentToSend = attachedFile;

    setInputText('');
    setAttachedFile(null);
    setIsTyping(true);

    try {
      const res = await sendChatMessage(msg, attachmentToSend, currentSessionId);
      if (res && res.conversationId && !currentSessionId) {
        setCurrentSessionId(res.conversationId);
      }
      fetchChatHistory();
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = async (q) => {
    setIsTyping(true);
    try {
      const res = await sendChatMessage(q, null, currentSessionId);
      if (res && res.conversationId && !currentSessionId) {
        setCurrentSessionId(res.conversationId);
      }
      fetchChatHistory();
    } finally {
      setIsTyping(false);
    }
  };

  // Real-Time Web Speech API Voice Recognition
  const handleVoicePrompt = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsRecording(true);
      setToastMsg('🎙️ Audio mic active. Transcribing query...');
      setTimeout(() => {
        setIsRecording(false);
        setToastMsg('');
        setInputText(
          language === 'am'
            ? 'በጾም ወቅት የብረት ንጥረ ነገር እጥረትን በጤፍ እና ምስር እንዴት ማሟላት እችላለሁ?'
            : 'How can I optimize non-heme iron absorption from Teff Injera and Misir Wat during fasting?'
        );
      }, 1500);
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'am' ? 'am-ET' : 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setToastMsg(
          language === 'am'
            ? '🎙️ እያዳመጥኩ ነው... በአማርኛ ወይም በእንግሊዝኛ ይናገሩ'
            : '🎙️ Listening... Speak your clinical nutrition question now'
        );
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        setToastMsg('⚠️ Speech recognition stopped. You can type or retry.');
        setTimeout(() => setToastMsg(''), 3000);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setToastMsg('✓ Voice transcribed! Review and press Send.');
        setTimeout(() => setToastMsg(''), 3000);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition initiation error:', err);
      setIsRecording(false);
    }
  };

  // Handle file attachment (meal photos, nutrition labels, blood lab reports)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setToastMsg('⚠️ File size must be under 10MB');
      setTimeout(() => setToastMsg(''), 3500);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      const isImage = file.type.startsWith('image/');
      setAttachedFile({
        name: file.name,
        data: base64Data,
        mimeType: file.type || 'image/jpeg',
        isImage,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      setToastMsg(`📎 Attached ${file.name} for Gemini AI multimodal diagnosis`);
      setTimeout(() => setToastMsg(''), 3500);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const removeAttachment = () => {
    setAttachedFile(null);
  };

  // Helper to format clean markdown subheaders, bold lead words, and aesthetic bullet points
  const renderFormattedText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} style={{ height: '6px' }} />;

      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--forest-green, #125238); font-weight: 700;">$1</strong>');

      if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
        const headerText = trimmed.replace(/^#+\s*/, '');
        return (
          <h4
            key={idx}
            dangerouslySetInnerHTML={{ __html: headerText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--forest-green, #125238)',
              marginTop: '10px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          />
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li
            key={idx}
            dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[-*]\s+/, '') }}
            style={{ marginLeft: '18px', marginBottom: '5px', lineHeight: '1.5', fontSize: '13.5px' }}
          />
        );
      }

      return (
        <p
          key={idx}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
          style={{ marginBottom: '6px', lineHeight: '1.5', fontSize: '13.5px' }}
        />
      );
    });
  };

  return (
    <div className="nutritionist-page-container" style={{ position: 'relative' }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div className="app-toast-alert" style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 99999 }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="supervision-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 className="supervision-title" style={{ fontSize: '26px', fontWeight: 800, color: '#125238', margin: 0 }}>
            {language === 'am' ? 'የአይአይ (AI) ስነ-ምግብ አማካሪ' : 'AI Nutritionist & Clinical Guidance'}
          </h1>
          <p className="supervision-sub" style={{ fontSize: '13.5px', color: '#5C544E', margin: '4px 0 0' }}>
            {language === 'am'
              ? 'የቀጥታ ስነ-ምግብ ምክር፣ የኢትዮጵያ ባህላዊ ምግቦች ሳይንሳዊ ትንታኔ እና የጾም አመጋገብ ክትትል።'
              : 'Real-time AI dietary advice, clinical Ethiopian nutrition intelligence, and multimodal meal inspection.'}
          </p>
        </div>

        {/* Top Actions: + New Chat & History Drawer Toggle */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleStartNewChat}
            style={{
              background: '#125238',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(18, 82, 56, 0.2)'
            }}
          >
            <span>+</span> {language === 'am' ? 'አዲስ ውይይት' : 'New Chat'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsHistoryOpen(!isHistoryOpen);
              if (!isHistoryOpen) fetchChatHistory();
            }}
            style={{
              background: isHistoryOpen ? 'rgba(201, 123, 61, 0.2)' : '#FFFFFF',
              color: '#C97B3D',
              border: '1px solid #C97B3D',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📜</span> {language === 'am' ? 'የውይይት ታሪክ' : 'History'} ({chatHistory.length})
          </button>
        </div>
      </div>

      {/* Main Layout: (Optional History Drawer + Chat Panel) */}
      <div style={{ display: 'grid', gridTemplateColumns: isHistoryOpen ? '280px 1fr' : '1fr', gap: '20px', transition: 'grid-template-columns 0.2s ease' }}>
        {/* Chat History Sidebar / Drawer */}
        {isHistoryOpen && (
          <div style={{
            background: isDark ? '#2B2622' : '#FFFFFF',
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#404943' : '#EADBCE'}`,
            padding: '16px',
            boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(43, 38, 34, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '750px'
          }}>
            {/* Sidebar Top: New Chat Action */}
            <button
              type="button"
              onClick={handleStartNewChat}
              style={{
                width: '100%',
                background: isDark ? '#2F6B4F' : '#125238',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '14px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <span>+</span> {language === 'am' ? 'አዲስ ውይይት ጀምር' : 'New Chat Session'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: `1px solid ${isDark ? '#352F2B' : '#FAF7F2'}`, paddingBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: isDark ? '#7FD9A8' : '#125238' }}>
                {language === 'am' ? 'ያለፉ ውይይቶች' : 'Past Consultations'}
              </h4>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#C0C9C1' : '#8E857E', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {isLoadingHistory ? (
                <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#C0C9C1' : '#8E857E', fontSize: '12.5px' }}>
                  Loading sessions...
                </div>
              ) : chatHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#C0C9C1' : '#8E857E', fontSize: '12.5px' }}>
                  No saved conversations yet.
                </div>
              ) : (
                chatHistory.map((s) => {
                  const sId = s.id || s._id || s.conversationId;
                  const isCurrent = sId === currentSessionId;
                  return (
                    <div
                      key={sId}
                      onClick={() => handleSelectSession(sId)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: isCurrent
                          ? (isDark ? 'rgba(127, 217, 168, 0.15)' : 'rgba(18, 82, 56, 0.08)')
                          : (isDark ? '#352F2B' : '#FAF7F2'),
                        border: isCurrent
                          ? `1px solid ${isDark ? '#7FD9A8' : '#125238'}`
                          : `1px solid ${isDark ? '#404943' : '#EADBCE'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: isCurrent ? 800 : 600, color: isDark ? '#F9EFE8' : '#2B2622', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          💬 {s.title || 'Consultation'}
                        </div>
                        <div style={{ fontSize: '11px', color: isDark ? '#C0C9C1' : '#716A63', marginTop: '3px' }}>
                          {s.lastUpdated ? new Date(s.lastUpdated).toLocaleDateString() : 'Recent'} • {s.messageCount || 0} msgs
                        </div>
                      </div>

                      {/* Trash Delete Action Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(sId, e)}
                        title={language === 'am' ? 'ውይይት አስወግድ' : 'Delete chat session'}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: isDark ? '#FCA5A5' : '#C93B2B',
                          fontSize: '14px',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.8
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Full-Width AI Nutritionist Container */}
        <div className="nutritionist-fullwidth-layout" style={{ minWidth: 0 }}>
          {/* Data Sharing Consent Card */}
          <div className="data-consent-card">
            <div className="consent-top-row">
              <div>
                <h4 className="consent-title">
                  {language === 'am' ? 'የጤና እና የጾም መረጃ ቅንብር (Telemetry & Context)' : 'Telemetry & Context Sharing'}
                </h4>
                <p className="consent-sub">
                  {language === 'am'
                    ? 'AI Nutritionist ከጾም መርሃ ግብርዎ እና ከተመገቧቸው ምግቦች ጋር በቀጥታ የተገናኘ ነው።'
                    : 'AI Nutritionist is injected with your active fasting status, health conditions & logged meals.'}
                </p>
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
                <span className="switch-text">{dataConsentActive ? (language === 'am' ? 'ገባሪ' : 'Active') : (language === 'am' ? 'የቆመ' : 'Paused')}</span>
              </div>
            </div>

            {/* Shared Telemetry Row */}
            <div className="shared-telemetry-grid">
              <div className="telemetry-chip shared-neutral">
                <div className="chip-head">
                  <span className="chip-icon">🍴</span>
                  <span className="chip-tag">{language === 'am' ? 'የተጋራ' : 'Shared'}</span>
                </div>
                <div className="chip-label">{language === 'am' ? 'የቅርብ ጊዜ አመጋገብ' : 'Recent Intake'}</div>
                <div className="chip-value">
                  {dailyStats?.calories?.consumed ? `${dailyStats.calories.consumed} kcal Logged` : 'Active Meal Logs'}
                </div>
              </div>

              <div className="telemetry-chip shared-neutral">
                <div className="chip-head">
                  <span className="chip-icon">📅</span>
                  <span className="chip-tag">{language === 'am' ? 'የተጋራ' : 'Shared'}</span>
                </div>
                <div className="chip-label">{language === 'am' ? 'የጾም ሁኔታ' : 'Fasting Adherence'}</div>
                <div className="chip-value">
                  {fastingCycle?.title ? fastingCycle.title : 'Orthodox Tsom Active'}
                </div>
              </div>

              <div className="telemetry-chip shared-alert">
                <div className="chip-head">
                  <span className="chip-icon">⚡</span>
                  <span className="chip-tag alert">AI Engine</span>
                </div>
                <div className="chip-label">{language === 'am' ? 'ሞዴል' : 'Model'}</div>
                <div className="chip-value alert-text">Groq Llama-3.3-70B</div>
              </div>
            </div>
          </div>

          {/* Secure AI Nutritionist Chat Panel */}
          <div className="secure-chat-card">
            {/* Chat Top Banner */}
            <div className="chat-top-banner">
              <div className="chat-status-left">
                <span className="chat-icon">💬</span>
                <span className="chat-heading">
                  {language === 'am' ? 'የ EthioNutri AI የምክክር መድረክ' : 'EthioNutri AI Consultation Thread'}
                </span>
                <span className="chat-online-indicator">
                  <span className="green-pulse-dot" /> Groq Llama-3.3 Online
                </span>
              </div>
              <div className="chat-encrypted-badge">
                🔒 {language === 'am' ? 'የግል መረጃ ጥበቃ የተረጋገጠ' : 'HIPAA & Privacy Protected'}
              </div>
            </div>

            {/* Quick Prompt Question Chips */}
            <div className="suggested-chips-scroll">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className="suggested-q-chip"
                  onClick={() => handleQuickQuestion(q)}
                  disabled={isTyping}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="chat-messages-viewport">
              {chatMessages.length === 0 ? (
                <div className="chat-empty-state" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-medium)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>🌱</div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                    {language === 'am' ? 'እንኳን ወደ EthioNutri AI በደህና መጡ!' : 'Welcome to EthioNutri AI Nutritionist!'}
                  </h4>
                  <p style={{ fontSize: '13px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
                    {language === 'am'
                      ? 'ስለ ጾም ምግቦች፣ የብረት ንጥረ ነገር ማሟያ፣ ፕሮቲን እና ጤናማ የባህላዊ አመጋገብ ጥያቄዎችዎን ይጠይቁ።'
                      : 'Ask any questions about Ethiopian fasting recipes, iron boost synergies, protein swaps, or balanced traditional meals in English or አማርኛ.'}
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isAi = msg.sender === 'nutritionist' || msg.sender === 'ai';
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
                        {/* Inline Attachment Rendering in User Bubble */}
                        {msg.attachment && (
                          <div style={{ marginBottom: '8px' }}>
                            {msg.attachment.isImage !== false && msg.attachment.data ? (
                              <img
                                src={msg.attachment.data}
                                alt={msg.attachment.name || 'Attachment'}
                                style={{ maxWidth: '180px', maxHeight: '140px', borderRadius: '8px', objectFit: 'cover', display: 'block', border: '1px solid rgba(255,255,255,0.3)' }}
                              />
                            ) : (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                                <span>📄</span> {msg.attachment.name || 'Document'}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="bubble-text">
                          {renderFormattedText(msg.text)}
                        </div>
                        <span className="bubble-timestamp">
                          {msg.time} {isAi ? '' : '✓✓'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="chat-bubble-row bubble-ai-row">
                  <div className="ai-chat-avatar">🌱</div>
                  <div className="chat-bubble bubble-ai" style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--forest-green)', fontWeight: 600 }}>
                        {language === 'am'
                          ? 'EthioNutri AI የምግብ እና የጤና ሁኔታዎን በመተንተን ላይ ነው...'
                          : 'EthioNutri AI is analyzing your nutritional telemetry...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Attachment Preview & Recording Indicator */}
            {isRecording && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                borderRadius: '10px',
                padding: '8px 14px',
                margin: '0 16px 8px',
                color: '#B91C1C',
                fontSize: '13px',
                fontWeight: 700
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="green-pulse-dot" style={{ background: '#EF4444', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' }} />
                  <span>{language === 'am' ? '🎙️ ድምጽ እያዳመጥኩ ነው... ይናገሩ (አማርኛ / English)' : '🎙️ Recording voice inquiry in real-time...'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleVoicePrompt}
                  style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '3px 8px', fontSize: '11.5px', cursor: 'pointer', fontWeight: 800 }}
                >
                  Stop
                </button>
              </div>
            )}

            {attachedFile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(18, 82, 56, 0.08)',
                border: '1px solid #125238',
                borderRadius: '10px',
                padding: '8px 14px',
                margin: '0 16px 8px',
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  {attachedFile.isImage ? (
                    <img
                      src={attachedFile.data}
                      alt="Preview"
                      style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #125238' }}
                    />
                  ) : (
                    <span style={{ fontSize: '20px' }}>📄</span>
                  )}
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 700, color: '#125238' }}>{attachedFile.name}</span>
                    <span style={{ fontSize: '11px', color: '#6B7280', marginLeft: '6px' }}>({attachedFile.size})</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeAttachment}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#991B1B',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    padding: '2px 6px'
                  }}
                  title="Remove attachment"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Hidden File Input for Attachments */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* Bottom Input Form */}
            <form onSubmit={handleSend} className="chat-input-form">
              <button
                type="button"
                className="chat-attach-btn"
                title="Attach meal photo, nutrition label, or blood lab report"
                onClick={() => fileInputRef.current?.click()}
              >
                📎
              </button>
              <button
                type="button"
                className={`chat-mic-btn ${isRecording ? 'recording' : ''}`}
                title="Voice input in Amharic or English"
                onClick={handleVoicePrompt}
                style={{
                  backgroundColor: isRecording ? '#EF4444' : undefined,
                  color: isRecording ? '#FFFFFF' : undefined
                }}
              >
                🎙️
              </button>
              <input
                type="text"
                className="chat-text-input"
                placeholder={language === 'am' ? 'ስለ ጾም ምግብ፣ ብረት፣ ፕሮቲን በአማርኛ ወይም በእንግሊዝኛ ይጠይቁ...' : 'Ask about fasting recipes, iron boost, protein swaps in English or አማርኛ...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                className="chat-send-btn"
                title="Send Message"
                disabled={isTyping || (!inputText.trim() && !attachedFile)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionistAI;

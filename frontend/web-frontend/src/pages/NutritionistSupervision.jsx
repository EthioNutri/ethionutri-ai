import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import DietitianProfileCard from '../components/nutritionist/DietitianProfileCard';
import DataSharingConsent from '../components/nutritionist/DataSharingConsent';
import SecureChat from '../components/nutritionist/SecureChat';
import { mockChatMessages, mockDietitianStatus } from '../components/nutritionist/mockChatMessages';

// Placeholder until the backend endpoint for the assigned dietitian is ready.
const mockDietitian = {
  name: 'Dr. Selamawit Tadesse',
  credential: 'Registered Dietitian',
  avatarUrl: null,
  expertise: ['Ethiopian traditional diets', 'Clinical nutrition', 'Fasting management'],
  languages: ['Amharic', 'English'],
};

const NutritionistSupervision = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState(mockChatMessages);

  const handleBookConsultation = () => {
    // TODO: wire up to the consultation booking API once available (backend team).
    console.log('Book consultation requested for', mockDietitian.name);
  };

  const handleSendMessage = ({ type, text }) => {
    // TEMPORARY: appends locally only. Once the backend chat endpoint
    // exists, replace this with a POST call, then update `messages`
    // from the response (or re-fetch) instead of pushing directly here.
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      type,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="supervision-page">
      <div className="supervision-header">
        <h1>{t('supervisionTitle')}</h1>
        <p>{t('supervisionSubtitle')}</p>
      </div>

      <div className="supervision-grid">
        <DietitianProfileCard
          dietitian={mockDietitian}
          onBookConsultation={handleBookConsultation}
        />
        <div className="supervision-right-column">
          <DataSharingConsent />
          <SecureChat
            messages={messages}
            dietitianName={mockDietitianStatus.name}
            isDietitianOnline={mockDietitianStatus.isOnline}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default NutritionistSupervision;
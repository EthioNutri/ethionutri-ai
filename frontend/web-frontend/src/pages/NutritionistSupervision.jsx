import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import DietitianProfileCard from '../components/nutritionist/DietitianProfileCard';
import DataSharingConsent from '../components/nutritionist/DataSharingConsent';
import SecureChat from '../components/nutritionist/SecureChat';
import UpcomingSessions from '../components/nutritionist/UpcomingSessions';
import { mockChatMessages, mockDietitianStatus } from '../components/nutritionist/mockChatMessages';
import { mockUpcomingSessions } from '../components/nutritionist/mockSessions';

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
    console.log('Book consultation requested for', mockDietitian.name);
  };

  const handleSendMessage = ({ type, text }) => {
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      type,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleAddSession = () => {
    console.log('Add session clicked');
  };

  const handleViewCalendar = () => {
    console.log('View calendar clicked');
  };

  return (
    <div className="supervision-page">
      <div className="supervision-header">
        <h1>{t('supervisionTitle')}</h1>
        <p>{t('supervisionSubtitle')}</p>
      </div>

      <div className="supervision-grid">
        <div className="supervision-left-column">
          <DietitianProfileCard
            dietitian={mockDietitian}
            onBookConsultation={handleBookConsultation}
          />
          <UpcomingSessions
            sessions={mockUpcomingSessions}
            onAddSession={handleAddSession}
            onViewCalendar={handleViewCalendar}
          />
        </div>
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
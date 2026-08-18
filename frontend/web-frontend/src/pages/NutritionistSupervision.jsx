import { useLanguage } from '../context/LanguageContext';
import DietitianProfileCard from '../components/nutritionist/DietitianProfileCard';

import DataSharingConsent from '../components/nutritionist/DataSharingConsent';

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

  const handleBookConsultation = () => {
    // TODO: wire up to the consultation booking API once available (backend team).
    console.log('Book consultation requested for', mockDietitian.name);
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
          {/* Secure Chat (FE-SUP-03) will be added below the consent panel
              in the next issue. */}
        </div>
      </div>
    </div>
  );
};

export default NutritionistSupervision;
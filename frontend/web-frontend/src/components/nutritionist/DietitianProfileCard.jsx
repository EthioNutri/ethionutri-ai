import { useLanguage } from '../../context/LanguageContext';
import Button from '../common/Button';

const DietitianProfileCard = ({ dietitian, onBookConsultation }) => {
  const { t } = useLanguage();
  const { name, credential, avatarUrl, expertise = [], languages = [] } = dietitian;

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="dietitian-card">
      <div className="dietitian-card-header">
        <div className="dietitian-avatar">
          {avatarUrl ? <img src={avatarUrl} alt={name} /> : initials}
        </div>
        <h3 className="dietitian-name">{name}</h3>
        <span className="dietitian-credential-badge">{credential}</span>
      </div>

      <div className="dietitian-info-section">
        <span className="dietitian-info-label">{t('dietitianExpertiseLabel')}</span>
        <div className="dietitian-tags-row">
          {expertise.map((item) => (
            <span key={item} className="dietitian-tag">{item}</span>
          ))}
        </div>
      </div>

      <div className="dietitian-info-section">
        <span className="dietitian-info-label">{t('dietitianLanguagesLabel')}</span>
        <p className="dietitian-languages-text">{languages.join(', ')}</p>
      </div>

      <Button variant="primary" fullWidth onClick={onBookConsultation}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"></rect>
          <path d="M16 2v4"></path>
          <path d="M8 2v4"></path>
          <path d="M3 10h18"></path>
        </svg>
        {t('bookConsultation')}
      </Button>
    </div>
  );
};

export default DietitianProfileCard;
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { translateFoodName } from '../../utils/i18n';

const tagTranslationsAm = {
  'high protein': 'ከፍተኛ ፕሮቲን',
  'iron rich': 'በብረት የበለጸገ',
  'high iron': 'በብረት የበለጸገ',
  'fasting': 'የጾም ምግብ',
  'fasting (tsom)': 'የጾም ምግብ',
  'fasting-friendly': 'የጾም ምግብ',
  'traditional': 'ባህላዊ',
  'traditional heritage': 'ባህላዊ ቅርስ',
  '100% plant-based': '100% የእጽዋት',
  'heritage recipe': 'የባህል ምግብ',
  'ai balanced': 'የተመጣጠነ'
};

const FoodCard = ({
  title = "Doro Wat & Quinoa",
  amharicTitle = "ዶሮ ወጥ",
  description = "A modern twist on a heritage classic. High protein to meet yo...",
  tags = ['450 kcal', 'High Protein', 'Iron Rich'],
  image = "/images/doro-wat.jpg",
  onLogMeal,
  onSecondaryAction,
  badgeText = "✨ AI Suggested Next Meal",
}) => {
  const { language } = useLanguage();

  const isAmharic = language === 'am';
  const displayTitle = isAmharic ? (amharicTitle || translateFoodName(title, 'am')) : title;
  const displaySubTitle = isAmharic ? title : amharicTitle;

  const translateTag = (t) => {
    if (!isAmharic) return t;
    const lower = t.toLowerCase().trim();
    if (tagTranslationsAm[lower]) return tagTranslationsAm[lower];
    if (lower.endsWith('kcal')) return `${lower.replace('kcal', '').trim()} ኪ.ካሎሪ`;
    if (lower.endsWith('protein')) return `${lower.replace('protein', '').trim()} ፕሮቲን`;
    return t;
  };

  return (
    <div className={`ai-suggested-meal-card ${isAmharic ? 'amharic-mode' : ''}`}>
      <div className="suggested-img-wrap">
        <img src={image} alt={title} className="suggested-food-img" onError={(e) => { e.target.src = '/images/hero-food.jpg'; }} />
        {badgeText && (
          <div className="suggested-badge-overlay">
            {isAmharic && badgeText.includes('AI Suggested') ? '✨ የተመከረ ባህላዊ ምግብ' : badgeText}
          </div>
        )}
      </div>

      <div className="suggested-content">
        <div className="suggested-header">
          <h3 className="suggested-title" style={{ fontFamily: isAmharic ? 'var(--font-ethiopic), sans-serif' : 'inherit' }}>
            {displayTitle}
          </h3>
          {displaySubTitle && displaySubTitle !== displayTitle && (
            <div className="suggested-amharic amharic-text" style={{ fontSize: '12px', color: '#716A63', marginTop: '2px' }}>
              {displaySubTitle}
            </div>
          )}
        </div>

        <p className="suggested-desc">{description}</p>

        <div className="suggested-tags-row">
          {tags.map((tag, idx) => {
            const isIron = tag.toLowerCase().includes('iron') || tag.includes('ብረት');
            return (
              <span key={idx} className={`tag-pill ${isIron ? 'tag-pill-iron' : 'tag-pill-default'}`} style={{ fontFamily: isAmharic ? 'var(--font-ethiopic), sans-serif' : 'inherit' }}>
                {translateTag(tag)}
              </span>
            );
          })}
        </div>

        <div className="suggested-actions-row">
          <button className="btn-log-meal" onClick={onLogMeal} style={{ fontFamily: isAmharic ? 'var(--font-ethiopic), sans-serif' : 'inherit' }}>
            <span className="plus-icon">+</span> {isAmharic ? 'ምግብ መዝግብ' : 'Log Meal'}
          </button>
          <button className="btn-ar-scan" onClick={onSecondaryAction} title={isAmharic ? 'የስነ-ምግብ ዝርዝር' : 'View Recipe & Nutrition AR Breakdown'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4A876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            </svg>
            <span className="ar-text-badge">S_AR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;


import React from 'react';

const FoodCard = ({
  title = "Doro Wat & Quinoa",
  amharicTitle = "ዶሮ ወጥ",
  description = "A modern twist on a heritage classic. High protein to meet your target while honoring authentic spices.",
  tags = ['450 kcal', 'High Protein', 'Iron Rich'],
  image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  onLogMeal,
  onSecondaryAction,
  badgeText = "✨ AI Suggested Next Meal",
}) => {
  return (
    <div className="ai-suggested-meal-card">
      <div className="suggested-img-wrap">
        <img src={image} alt={title} className="suggested-food-img" />
        {badgeText && (
          <div className="suggested-badge-overlay">
            {badgeText}
          </div>
        )}
      </div>

      <div className="suggested-content">
        <div className="suggested-header">
          <h3 className="suggested-title">{title}</h3>
          {amharicTitle && <div className="suggested-amharic amharic-text">{amharicTitle}</div>}
        </div>

        <p className="suggested-desc">{description}</p>

        <div className="suggested-tags-row">
          {tags.map((tag, idx) => {
            const isProtein = tag.toLowerCase().includes('protein');
            const isIron = tag.toLowerCase().includes('iron');
            const isCal = tag.toLowerCase().includes('kcal');
            let pillClass = "tag-pill-default";
            if (isProtein) pillClass = "tag-pill-protein";
            if (isIron) pillClass = "tag-pill-iron";
            if (isCal) pillClass = "tag-pill-cal";

            return (
              <span key={idx} className={`tag-pill ${pillClass}`}>
                {tag}
              </span>
            );
          })}
        </div>

        <div className="suggested-actions-row">
          <button className="btn-log-meal" onClick={onLogMeal}>
            <span className="plus-icon">+</span> Log Meal
          </button>
          <button className="btn-ar-scan" onClick={onSecondaryAction} title="View Recipe & Nutrition Breakdown">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <rect x="7" y="7" width="10" height="10" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

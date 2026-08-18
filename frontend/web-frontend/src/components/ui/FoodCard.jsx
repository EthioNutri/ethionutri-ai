import React from 'react';

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
  return (
    <div className="ai-suggested-meal-card">
      <div className="suggested-img-wrap">
        <img src={image} alt={title} className="suggested-food-img" onError={(e) => { e.target.src = '/images/hero-food.jpg'; }} />
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
            const isIron = tag.toLowerCase().includes('iron');
            return (
              <span key={idx} className={`tag-pill ${isIron ? 'tag-pill-iron' : 'tag-pill-default'}`}>
                {tag}
              </span>
            );
          })}
        </div>

        <div className="suggested-actions-row">
          <button className="btn-log-meal" onClick={onLogMeal}>
            <span className="plus-icon">+</span> Log Meal
          </button>
          <button className="btn-ar-scan" onClick={onSecondaryAction} title="View Recipe & Nutrition AR Breakdown">
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import HeroBanner from '../components/ui/HeroBanner';
import CalorieRing from '../components/ui/CalorieRing';
import MacroCard from '../components/ui/MacroCard';
import AlertCard from '../components/ui/AlertCard';
import FoodCard from '../components/ui/FoodCard';
import ActionRow from '../components/ui/ActionRow';
import LogMealModal from '../components/ui/LogMealModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { dailyStats, fastingCycle, recommendedMeal, addFoodLog } = useNutrition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('manual');
  const [toastMessage, setToastMessage] = useState('');

  const handleOpenModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleLogSuggestedMeal = () => {
    addFoodLog({
      name: recommendedMeal.name,
      amharicName: recommendedMeal.amharicName,
      portion: '1 serving (300g)',
      calories: recommendedMeal.calories,
      protein: 34,
      carbs: 48,
      fats: 12,
      category: 'dinner',
      isTsom: false,
      image: recommendedMeal.image,
    });
    setToastMessage('✨ Doro Wat & Quinoa logged successfully!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="dashboard-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="app-toast-alert">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner Card */}
      <HeroBanner
        cycleTitle={fastingCycle.title}
        dayText={fastingCycle.dayCount}
        description={fastingCycle.description}
        allowedLabel={fastingCycle.allowedBadge}
      />

      {/* Main 2-Column Grid */}
      <div className="dashboard-grid-layout">
        {/* Left Main Column */}
        <div className="dashboard-left-column">
          {/* Calorie Ring + Macros Overview Card */}
          <div className="calorie-macros-card">
            {/* Circular Ring Column */}
            <div className="ring-section">
              <CalorieRing
                consumed={dailyStats.calories.consumed}
                target={dailyStats.calories.target}
                size={220}
                label="kcal eaten"
              />
            </div>

            {/* 2x2 Macro Grid */}
            <div className="macros-quad-grid">
              <MacroCard
                name="Protein"
                consumed={dailyStats.protein.consumed}
                target={dailyStats.protein.target}
                unit={dailyStats.protein.unit}
                color="#F4A876" // Terracotta / Peach
              />
              <MacroCard
                name="Carbs"
                consumed={dailyStats.carbs.consumed}
                target={dailyStats.carbs.target}
                unit={dailyStats.carbs.unit}
                color="#7FD9A8" // Mint / Teal-Green
              />
              <MacroCard
                name="Fats"
                consumed={dailyStats.fats.consumed}
                target={dailyStats.fats.target}
                unit={dailyStats.fats.unit}
                color="#E5A65E" // Warm Amber
              />
              <MacroCard
                name="Water"
                consumed={dailyStats.water.consumed}
                target={dailyStats.water.target}
                unit={dailyStats.water.unit}
                isWater={true}
              />
            </div>
          </div>

          {/* Quick-Log Action Row */}
          <ActionRow
            onScanMeal={() => handleOpenModal('scan')}
            onVoiceLog={() => handleOpenModal('voice')}
            onManualEntry={() => handleOpenModal('manual')}
          />
        </div>

        {/* Right Sidebar Column */}
        <div className="dashboard-right-column">
          {/* Iron Nutrient Alert Card */}
          <AlertCard
            title="Iron intake low"
            description="You are tracking below your target for iron today. Consider adding lentils or teff to your next meal."
            actionText="View Iron-Rich Foods"
            onActionClick={() => navigate('/food-logging')}
          />

          {/* AI Suggested Next Meal Card */}
          <FoodCard
            title={recommendedMeal.name}
            amharicTitle={recommendedMeal.amharicName}
            description={recommendedMeal.description}
            tags={recommendedMeal.tags}
            image={recommendedMeal.image}
            onLogMeal={handleLogSuggestedMeal}
            onSecondaryAction={() => navigate('/meal-planning')}
          />
        </div>
      </div>

      {/* Log Meal Interactive Modal */}
      <LogMealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode={modalMode}
      />
    </div>
  );
};

export default Dashboard;

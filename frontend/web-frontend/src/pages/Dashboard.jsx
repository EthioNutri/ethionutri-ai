import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import HeroBanner from '../components/ui/HeroBanner';
import CalorieRing from '../components/ui/CalorieRing';
import MacroCard from '../components/ui/MacroCard';
import AlertCard from '../components/ui/AlertCard';
import FoodCard from '../components/ui/FoodCard';
import ActionRow from '../components/ui/ActionRow';
import LogMealModal from '../components/ui/LogMealModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { dailyStats, fastingCycle, recommendedMeal, foodLogs, addFoodLog } = useNutrition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('manual');
  const [toastMessage, setToastMessage] = useState('');

  const handleOpenModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleLogSuggestedMeal = () => {
    addFoodLog({
      name: recommendedMeal.name || 'Shiro Mitten with Teff Injera',
      amharicName: recommendedMeal.amharicName || 'ሽሮ ምጥን በጤፍ እንጀራ',
      portion: '1 serving (300g)',
      calories: recommendedMeal.calories || 460,
      protein: 18,
      carbs: 68,
      fats: 10,
      iron: 4.8,
      category: 'lunch',
      isTsom: true,
      image: recommendedMeal.image || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
    });
    setToastMessage(
      language === 'am'
        ? `✨ ${recommendedMeal.amharicName || recommendedMeal.name} በተሳካ ሁኔታ ተመዝግቧል!`
        : `✨ ${recommendedMeal.name} logged successfully!`
    );
    setTimeout(() => setToastMessage(''), 3500);
  };

  const consumedCalories = dailyStats?.calories?.consumed ?? 0;
  const targetCalories = dailyStats?.calories?.target ?? 2000;
  const consumedIron = dailyStats?.iron?.consumed ?? 0;

  // Compute exact iron RDA based on biological sex, age, and health profile
  const targetIronRDA = useMemo(() => {
    const gender = (user?.gender || user?.healthProfile?.biologicalSex || 'female').toLowerCase();
    const age = user?.age || user?.healthProfile?.age || 26;
    const isPregnant = user?.healthProfile?.healthConditions?.includes('Pregnancy') || user?.healthConditions?.includes('Pregnancy');

    if (isPregnant) return 27;
    if (gender === 'male' || gender === 'm') return 8;
    if (age >= 51) return 8;
    return 18; // Adult female (19-50)
  }, [user]);

  const hasNoLogsToday = foodLogs.length === 0 && consumedCalories === 0;

  // Only display deficiency alert if meals are logged AND consumed iron is strictly below RDA
  const isIronDeficient = consumedCalories > 0 && consumedIron < targetIronRDA;

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
                consumed={consumedCalories}
                target={targetCalories}
                size={220}
                label={language === 'am' ? 'የተመገቡት ካሎሪ' : 'kcal eaten'}
              />
            </div>

            <div className="macros-quad-grid">
              <MacroCard
                name={language === 'am' ? 'ፕሮቲን' : 'Protein'}
                consumed={dailyStats?.protein?.consumed ?? 0}
                target={dailyStats?.protein?.target}
                unit={dailyStats?.protein?.unit ?? 'g'}
                color="#F4A876" // Terracotta / Peach
              />
              <MacroCard
                name={language === 'am' ? 'ካርቦሃይድሬት' : 'Carbs'}
                consumed={dailyStats?.carbs?.consumed ?? 0}
                target={dailyStats?.carbs?.target}
                unit={dailyStats?.carbs?.unit ?? 'g'}
                color="#7FD9A8" // Mint / Teal-Green
              />
              <MacroCard
                name={language === 'am' ? 'ስብ (ቅባት)' : 'Fats'}
                consumed={dailyStats?.fats?.consumed ?? 0}
                target={dailyStats?.fats?.target}
                unit={dailyStats?.fats?.unit ?? 'g'}
                color="#E5A65E" // Warm Amber
              />
              <MacroCard
                name={language === 'am' ? 'ውሃ' : 'Water'}
                consumed={dailyStats?.water?.consumed ?? 0}
                target={dailyStats?.water?.target}
                unit={dailyStats?.water?.unit ?? 'L'}
                isWater={true}
              />
            </div>
          </div>

          {/* Graceful Empty State Indicator when 0 meals are logged */}
          {hasNoLogsToday && (
            <div className="dashboard-empty-banner" style={{
              background: 'var(--card-bg)',
              border: '1px dashed rgba(201, 123, 61, 0.3)',
              borderRadius: 'var(--card-radius)',
              padding: '20px 24px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '28px' }}>🍽️</span>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-dark)' }}>
                    {language === 'am' ? 'ዛሬ የተመዘገበ ምግብ የለም (0 kcal)' : '0 kcal eaten — No meals logged today'}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-medium)', marginTop: '2px' }}>
                    {language === 'am'
                      ? 'የቀንዎን አመጋገብ ለመከታተል የፈጣን ምግብ መዝገብን (Quick Log) ይጠቀሙ።'
                      : 'Use Quick Log below to scan, voice log, or manually add your Ethiopian meals.'}
                  </p>
                </div>
              </div>
              <button
                className="btn-empty-log"
                onClick={() => handleOpenModal('manual')}
                style={{ padding: '8px 18px', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                + {language === 'am' ? 'ምግብ መዝግብ' : 'Quick Log Meal'}
              </button>
            </div>
          )}

          {/* Quick-Log Action Row */}
          <ActionRow
            onVoiceLog={() => handleOpenModal('voice')}
            onManualEntry={() => handleOpenModal('manual')}
          />
        </div>

        {/* Right Sidebar Column */}
        <div className="dashboard-right-column">
          {/* Dynamic Micronutrient / Deficiency Alert Card */}
          {isIronDeficient ? (
            <AlertCard
              title={language === 'am' ? 'የብረት (Iron) ንጥረ ነገር ዝቅተኛ ነው' : 'Iron intake low'}
              description={
                language === 'am'
                  ? `የዛሬው የብረት መጠን ${consumedIron}mg / ${targetIronRDA}mg ነው። በሚቀጥለው ምግብዎ ምስር ወጥ ወይም የጤፍ እንጀራ ከሎሚ ጋር ይመገቡ።`
                  : `You have logged ${consumedIron}mg out of your ${targetIronRDA}mg iron RDA today. Consider adding Teff Injera, Misir Wat, or Gomen paired with citrus to your next meal.`
              }
              actionText={language === 'am' ? 'የብረት የበለጸጉ ምግቦችን ይመልከቱ' : 'View Iron-Rich Foods'}
              onActionClick={() => navigate('/food-logging')}
            />
          ) : (
            consumedCalories > 0 && (
              <div className="nutrient-alert-card" style={{ background: 'var(--forest-green-light)', borderColor: 'rgba(31, 75, 63, 0.2)' }}>
                <span className="alert-triangle-icon">✨</span>
                <div>
                  <h4 className="alert-card-title" style={{ color: 'var(--forest-green)' }}>
                    {language === 'am' ? 'የተመጣጠነ የንጥረ ነገር ደረጃ' : 'Micronutrients on Track'}
                  </h4>
                  <p className="alert-card-desc" style={{ color: 'var(--forest-green)' }}>
                    {language === 'am'
                      ? `የብረት እና ፕሮቲን መጠን በጥሩ ሁኔታ በመከታተል ላይ ይገኛል (${consumedIron}mg iron).`
                      : `Your iron intake meets your daily ${targetIronRDA}mg RDA target (${consumedIron}mg logged).`}
                  </p>
                </div>
              </div>
            )
          )}

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

import React, { useState, useEffect } from 'react';
import LanguageToggle from '../components/common/LanguageToggle';
import ThemeToggle from '../components/common/ThemeToggle';
import Step1Language from '../components/onboarding/Step1Language';
import Step2HealthProfile from '../components/onboarding/Step2HealthProfile';
import Step3DietaryNeeds from '../components/onboarding/Step3DietaryNeeds';
import Step4FastingPractices from '../components/onboarding/Step4FastingPractices';
import Step5NutritionGoals from '../components/onboarding/Step5NutritionGoals';
import OnboardingComplete from '../components/onboarding/OnboardingComplete';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('ethionutri_onboarding');
    return saved ? JSON.parse(saved) : {
      age: '30',
      sex: 'female',
      height: '170',
      weight: '65',
      activityLevel: 'lightly_active',
      conditions: [],
      fastingPractice: 'orthodox_tsom',
      nutritionGoal: 'health_balance'
    };
  });

  useEffect(() => {
    localStorage.setItem('ethionutri_onboarding', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));
  const resetToStep = (step = 1) => setCurrentStep(step);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Language onNext={nextStep} />;
      case 2:
        return (
          <Step2HealthProfile
            data={formData}
            onChange={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3DietaryNeeds
            data={formData}
            onChange={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Step4FastingPractices
            data={formData}
            onChange={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <Step5NutritionGoals
            data={formData}
            onChange={updateFormData}
            onComplete={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <OnboardingComplete
            data={formData}
            onReset={() => resetToStep(1)}
          />
        );
      default:
        return <Step1Language onNext={nextStep} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-page)' }}>
      {/* Top Header Bar with toggles */}
      <header className="app-header" style={{ paddingBottom: '0' }}>
        <div className="brand-logo-wrap">
          <div className="brand-logo-icon">🌾</div>
          <span className="brand-title">EthioNutri AI</span>
        </div>
        <div className="header-actions-group">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {renderStep()}
      </main>
    </div>
  );
};

export default Onboarding;

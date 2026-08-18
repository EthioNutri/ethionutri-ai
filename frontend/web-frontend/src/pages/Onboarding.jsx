import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LanguageToggle from '../components/common/LanguageToggle';
import ThemeToggle from '../components/common/ThemeToggle';
import Step1Language from '../components/onboarding/Step1Language';
import Step2HealthProfile from '../components/onboarding/Step2HealthProfile';
import Step3DietaryNeeds from '../components/onboarding/Step3DietaryNeeds';
import Step4FastingPractices from '../components/onboarding/Step4FastingPractices';
import Step5NutritionGoals from '../components/onboarding/Step5NutritionGoals';
import OnboardingComplete from '../components/onboarding/OnboardingComplete';

const defaultFormData = {
  age: '30',
  sex: 'female',
  height: '170',
  weight: '65',
  activityLevel: 'lightly_active',
  conditions: [],
  fastingPractice: 'orthodox_tsom',
  nutritionGoal: 'health_balance'
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('ethionutri_onboarding');
    if (saved) {
      try {
        return { ...defaultFormData, ...JSON.parse(saved) };
      } catch {
        // Corrupted saved data — fall back to defaults
      }
    }
    return defaultFormData;
  });

  useEffect(() => {
    localStorage.setItem('ethionutri_onboarding', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));
  const resetToStep = (step = 1) => setCurrentStep(step);

  const handleFinishStep5 = () => {
    localStorage.setItem('ethionutri_onboarded', 'true');
    navigate('/dashboard', { replace: true });
  };

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
            onComplete={handleFinishStep5}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <OnboardingComplete
            data={formData}
            onReset={() => resetToStep(1)}
            onFinish={handleFinishStep5}
          />
        );
      default:
        return <Step1Language onNext={nextStep} />;
    }
  };

  return (
    <div className="onboarding-page-wrapper">
      {/* Top Header Bar matching base web */}
      <header className="onboarding-topbar">
        <Link to="/" className="marketing-brand-logo" style={{ textDecoration: 'none' }}>
          <div className="marketing-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span className="marketing-brand-text">EthioNutri AI</span>
        </Link>
        <div className="header-actions-group">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="onboarding-main-container">
        {renderStep()}
      </main>
    </div>
  );
};

export default Onboarding;

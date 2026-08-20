import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { NutritionProvider } from './context/NutritionContext';

// Marketing Layout & Pages
import MarketingLayout from './components/layout/MarketingLayout';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import FastingCalendarPublic from './pages/FastingCalendarPublic';
import RecipesPage from './pages/RecipesPage';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CulturalGuidelines from './pages/CulturalGuidelines';
import ContactUs from './pages/ContactUs';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// App / In-App Core Screens
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import FoodLogging from './pages/FoodLogging';
import Analytics from './pages/Analytics';
import MealPlanning from './pages/MealPlanning';
import FastingCalendar from './pages/FastingCalendar';
import NutritionistAI from './pages/NutritionistAI';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import ErrorBoundary from './components/common/ErrorBoundary';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NutritionProvider>
            <ErrorBoundary>
              <BrowserRouter>
                <Routes>
                  {/* 1. Public Marketing Website Pages (Wrapped in MarketingLayout) */}
                  <Route element={<MarketingLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/fasting-calendar" element={<FastingCalendarPublic />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/cultural-guidelines" element={<CulturalGuidelines />} />
                    <Route path="/contact" element={<ContactUs />} />
                  </Route>

                  {/* 2. Standalone Auth Pages */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Register />} />
                  <Route path="/register" element={<Register />} />

                  {/* 3. In-App Authenticated Screens */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/food-logging" element={<FoodLogging />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/meal-planning" element={<MealPlanning />} />
                    <Route path="/fasting-app" element={<FastingCalendar />} />
                    <Route path="/nutritionist" element={<NutritionistAI />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>

                  {/* 4. Onboarding (Protected for authenticated users) */}
                  <Route
                    path="/onboarding"
                    element={
                      <ProtectedRoute requireOnboarded={false}>
                        <Onboarding />
                      </ProtectedRoute>
                    }
                  />

                  {/* 5. Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </NutritionProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { NutritionProvider } from './context/NutritionContext';

import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import FoodLogging from './pages/FoodLogging';
import Analytics from './pages/Analytics';
import MealPlanning from './pages/MealPlanning';
import FastingCalendar from './pages/FastingCalendar';
import NutritionistAI from './pages/NutritionistAI';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NutritionProvider>
            <BrowserRouter>
              <Routes>
                {/* Main App Layout containing all 6 core screens */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/food-logging" element={<FoodLogging />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/meal-planning" element={<MealPlanning />} />
                  <Route path="/fasting-calendar" element={<FastingCalendar />} />
                  <Route path="/nutritionist" element={<NutritionistAI />} />
                </Route>

                {/* Auth routes wrapped in AuthLayout */}
                <Route element={<AuthLayout />}>
                  <Route path="/register" element={<Register />} />
                  <Route path="/signup" element={<Navigate to="/register" replace />} />
                  <Route path="/login" element={<Login />} />
                </Route>

                {/* Multi-step onboarding wizard */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />

                {/* Direct preview route */}
                <Route path="/preview" element={<Onboarding />} />

                {/* Default route redirects to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </NutritionProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

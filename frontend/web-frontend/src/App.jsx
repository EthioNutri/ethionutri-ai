import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth routes wrapped in AuthLayout */}
              <Route element={<AuthLayout />}>
                <Route path="/register" element={<Register />} />
                <Route path="/signup" element={<Navigate to="/register" replace />} />
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Protected multi-step onboarding wizard */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />

              {/* Quick direct preview route for onboarding */}
              <Route path="/preview" element={<Onboarding />} />

              {/* Default redirects to signup auth before onboarding */}
              <Route path="/" element={<Navigate to="/register" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const TermsOfService = () => {
  const { language } = useLanguage();

  return (
    <div className="legal-page-container">
      <div className="legal-article-card">
        <div className="legal-header">
          <span className="stats-badge">
            {language === 'am' ? 'ህጋዊ ውል' : 'Legal Terms'}
          </span>
          <h1 className="legal-title">
            {language === 'am' ? 'የአገልግሎት ውሎች' : 'Terms of Service'}
          </h1>
          <p className="legal-updated">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="legal-body-content">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or registering for an account with EthioNutri AI, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you must refrain from using the platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Medical & Nutrition Advice Disclaimer</h2>
            <p>
              EthioNutri AI is an educational and lifestyle health tracking application powered by artificial intelligence and verified food composition tables. <strong>EthioNutri AI does not provide medical diagnoses, treatment prescriptions, or clinical medical advice.</strong>
            </p>
            <p>
              Always consult with a licensed physician, clinical dietitian, or qualified healthcare provider before undertaking significant dietary changes, especially if you have pre-existing medical conditions (such as Type 1/Type 2 diabetes, kidney disease, anemia, or gastrointestinal disorders) or are pregnant/nursing.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Account Registration & Security</h2>
            <p>
              You agree to provide accurate, up-to-date information during the registration process and to maintain the security and confidentiality of your login credentials. You are responsible for all activities occurring under your account.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Intellectual Property</h2>
            <p>
              All proprietary algorithms, food dataset classifications, computer-vision models, brand designs, typography, and original Amharic cultural nutritional translations are the exclusive intellectual property of EthioNutri AI.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Service Availability & Changes</h2>
            <p>
              We continually enhance our nutritional algorithms and features. We reserve the right to modify, suspend, or update parts of the service to improve accuracy, security, and cultural relevance.
            </p>
          </section>
        </div>

        <div className="legal-footer-cta">
          <p>Questions regarding our terms or service guidelines?</p>
          <Link to="/contact" className="landing-cta-primary">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

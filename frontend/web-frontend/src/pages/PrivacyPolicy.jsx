import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  return (
    <div className="legal-page-container">
      <div className="legal-article-card">
        <div className="legal-header">
          <span className="stats-badge">
            {language === 'am' ? 'ህጋዊ ሰነድ' : 'Legal Documentation'}
          </span>
          <h1 className="legal-title">
            {language === 'am' ? 'የግላዊነት ፖሊሲ' : 'Privacy Policy'}
          </h1>
          <p className="legal-updated">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="legal-body-content">
          <section className="legal-section">
            <h2>1. Introduction & Overview</h2>
            <p>
              EthioNutri AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal privacy and safeguarding your sensitive nutritional, health, and dietary data. This Privacy Policy outlines how we collect, process, and protect your information when using the EthioNutri AI web application, mobile applications, and affiliated services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>We only collect information necessary to provide accurate nutritional and fasting guidance:</p>
            <ul>
              <li><strong>Account Credentials:</strong> Name, email address, password hashes, and optional authentication identifiers (e.g. Google SSO).</li>
              <li><strong>Nutritional & Biometric Logs:</strong> Height, weight, age, biological sex, activity level, dietary goals, food photos uploaded for AI classification, and logged meals.</li>
              <li><strong>Fasting Observance Settings:</strong> Preferences regarding Ethiopian Orthodox fasting schedules (Tsom), fasting frequency, and non-fasting exemptions.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Data</h2>
            <p>Your data is used exclusively to deliver personalized nutrition intelligence:</p>
            <ul>
              <li>Calculating daily caloric and macronutrient targets calibrated for Ethiopian foods.</li>
              <li>Generating culturally accurate meal recommendations and fasting adjustments.</li>
              <li>Continuously improving our food computer-vision models using anonymized meal logs.</li>
              <li>Delivering critical account, security, and fasting period notifications.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Data Sharing & Third-Party Disclosure</h2>
            <p>
              <strong>We never sell, rent, or trade your personal health data</strong> to advertisers, pharmaceutical companies, or third-party data brokers. Data is processed securely with end-to-end encryption in transit (HTTPS/TLS) and AES-256 encryption at rest.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Your Rights & Data Portability</h2>
            <p>
              You maintain complete ownership of your dietary logs. You may at any time request an export of your health history, update your profile settings, or permanently delete your account and all associated logs from our systems by contacting <a href="mailto:privacy@ethionutri.ai">privacy@ethionutri.ai</a>.
            </p>
          </section>
        </div>

        <div className="legal-footer-cta">
          <p>Have questions about how we protect your information?</p>
          <Link to="/contact" className="landing-cta-primary">
            Contact Privacy Team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

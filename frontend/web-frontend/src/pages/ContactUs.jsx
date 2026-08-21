import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ContactUs = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg(language === 'am' ? 'እባክዎ ስምዎን ያስገቡ' : 'Please enter your name');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMsg(language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ' : 'Please enter a valid email address');
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMsg(language === 'am' ? 'እባክዎ ቢያንስ 10 ፊደላት ያለው መልእክት ያስገቡ' : 'Message must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', category: 'general', message: '' });
    }, 1000);
  };

  return (
    <div className="contact-page-container">
      {/* Hero Header */}
      <section className="how-hero-section">
        <div className="how-hero-container">
          <div className="landing-badge-pill">
            {language === 'am' ? 'ያግኙን' : 'Get In Touch'}
          </div>
          <h1 className="how-hero-title">
            {language === 'am' ? 'ከእኛ ጋር ይገናኙ' : 'Contact EthioNutri AI'}
          </h1>
          <p className="how-hero-subtitle">
            {language === 'am'
              ? 'ጥያቄ፣ አስተያየት ወይም የትብብር ጥያቄ አለዎት? ቡድናችን በማንኛውም ጊዜ ሊያግዝዎት ዝግጁ ነው።'
              : 'Have questions, feedback on Ethiopian recipe calculations, or partnership inquiries? We’d love to hear from you.'}
          </p>
        </div>
      </section>

      {/* Form & Info 2-Column Grid */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-grid">
            {/* Left Column: Interactive Contact Form */}
            <div className="contact-card-box">
              {submitted ? (
                <div className="contact-success-state">
                  <div className="success-icon-circle">✓</div>
                  <h3 className="success-title">
                    {language === 'am' ? 'መልእክትዎ በተሳካ ሁኔታ ተልኳል!' : 'Message Sent Successfully!'}
                  </h3>
                  <p className="success-desc">
                    {language === 'am'
                      ? 'ስላነጋገሩን እናመሰግናለን። የድጋፍ ቡድናችን በ24 ሰዓታት ውስጥ በኢሜይልዎ ምላሽ ይሰጣል።'
                      : 'Thank you for reaching out. Our nutrition and technical support team will respond to your email within 24 business hours.'}
                  </p>
                  <button
                    type="button"
                    className="landing-cta-primary"
                    onClick={() => setSubmitted(false)}
                    style={{ marginTop: '20px' }}
                  >
                    {language === 'am' ? 'ሌላ መልእክት ይላኩ' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form-inner">
                  <h2 className="contact-form-heading">
                    {language === 'am' ? 'መልእክት ይላኩልን' : 'Send Us a Message'}
                  </h2>

                  {errorMsg && (
                    <div className="form-error-banner">
                      {errorMsg}
                    </div>
                  )}

                  <div className="form-group-item">
                    <label className="form-label">
                      {language === 'am' ? 'ሙሉ ስም *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      className="form-input-field"
                      placeholder={language === 'am' ? 'ለምሳሌ፡ ሰላማዊት ታደሰ' : 'e.g. Selamawit Tadesse'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-label">
                      {language === 'am' ? 'ኢሜይል አድራሻ *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      className="form-input-field"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-label">
                      {language === 'am' ? 'የጥያቄው አይነት' : 'Inquiry Category'}
                    </label>
                    <select
                      className="form-select-field"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="general">{language === 'am' ? 'አጠቃላይ ጥያቄ' : 'General Inquiry / General Question'}</option>
                      <option value="recipe">{language === 'am' ? 'የምግብ አዘገጃጀትና ንጥረ ነገር አስተያየት' : 'Recipe & Macro Feedback'}</option>
                      <option value="fasting">{language === 'am' ? 'የጾም ቀን መቁጠሪያ ጥያቄ' : 'Fasting Calendar Inquiries'}</option>
                      <option value="partnership">{language === 'am' ? 'የትብብር እና የምርምር ጥያቄ' : 'Partnership & Research'}</option>
                    </select>
                  </div>

                  <div className="form-group-item">
                    <label className="form-label">
                      {language === 'am' ? 'መልእክትዎ *' : 'Message *'}
                    </label>
                    <textarea
                      rows={5}
                      className="form-textarea-field"
                      placeholder={language === 'am' ? 'ጥያቄዎን ወይም አስተያየትዎን እዚህ ይጻፉ...' : 'Type your question, suggestion, or feedback here...'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="landing-cta-primary large"
                    style={{ width: '100%', marginTop: '10px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? (language === 'am' ? 'በመላክ ላይ...' : 'Sending Message...')
                      : (language === 'am' ? 'መልእክት ላክ →' : 'Send Message →')}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Contact Channels & Location */}
            <div className="contact-info-column">
              <div className="contact-info-card">
                <div className="info-icon-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <h3 className="info-title">{language === 'am' ? 'ኢሜይል ይላኩልን' : 'Email Us'}</h3>
                  <p className="info-sub">{language === 'am' ? 'የድጋፍ ቡድናችን በ24 ሰዓት ውስጥ ምላሽ ይሰጣል።' : 'Our friendly support team responds within 24 hours.'}</p>
                  <a href="mailto:support@ethionutri.ai" className="info-link">support@ethionutri.ai</a>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="info-icon-badge mint">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="info-title">{language === 'am' ? 'የአዲስ አበባ ዋና መሥሪያ ቤት' : 'Addis Ababa Headquarters'}</h3>
                  <p className="info-sub">{language === 'am' ? 'ቦሌ መድኃኔዓለም፣ አዲስ አበባ፣ ኢትዮጵያ' : 'Bole Medhanialem, Sub-City, Addis Ababa, Ethiopia'}</p>
                  <span className="info-link">{language === 'am' ? 'ዋና መስሪያ ቤት እና የምርምር ማዕከል' : 'HQ & Research Lab'}</span>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="info-icon-badge tan">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="info-title">{language === 'am' ? 'የሥራ ሰዓት' : 'Global Support Hours'}</h3>
                  <p className="info-sub">{language === 'am' ? 'ከሰኞ - አርብ፡ ከጠዋቱ 2፡30 - 12፡00 (በኢትዮጵያ ሰዓት)' : 'Monday – Friday: 8:30 AM – 6:00 PM (EAT / UTC+3)'}</p>
                  <span className="info-link">{language === 'am' ? 'ለሀገር ውስጥ እና ለዲያስፖራ ማህበረሰብ' : 'Serving Ethiopia & Global Diaspora'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;

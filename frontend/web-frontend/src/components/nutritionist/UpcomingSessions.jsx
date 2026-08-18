import { useLanguage } from '../../context/LanguageContext';

function getDateBadgeParts(isoDate) {
  const d = new Date(isoDate);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  return { month, day };
}

const UpcomingSessions = ({ sessions = [], onAddSession, onViewCalendar }) => {
  const { t } = useLanguage();

  return (
    <div className="dietitian-card upcoming-sessions-card">
      <div className="upcoming-sessions-header">
        <h3 className="upcoming-sessions-title">{t('upcomingSessionsTitle')}</h3>
        <button
          type="button"
          className="upcoming-sessions-add-btn"
          onClick={onAddSession}
          aria-label={t('addSession')}
        >
          +
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="upcoming-sessions-empty">{t('noUpcomingSessions')}</p>
      ) : (
        <div className="upcoming-sessions-list">
          {sessions.map((session) => {
            const { month, day } = getDateBadgeParts(session.date);
            return (
              <div key={session.id} className="session-item">
                <div className="session-date-badge">
                  <span className="session-date-month">{month}</span>
                  <span className="session-date-day">{day}</span>
                </div>
                <div className="session-info">
                  <p className="session-title">{session.title}</p>
                  <p className="session-time">🕐 {session.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button type="button" className="view-calendar-btn" onClick={onViewCalendar}>
        {t('viewCalendar')}
      </button>
    </div>
  );
};

export default UpcomingSessions;
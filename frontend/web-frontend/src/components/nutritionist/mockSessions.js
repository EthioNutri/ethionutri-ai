// TEMPORARY MOCK DATA — replace with a real API call once the backend
// exposes scheduled/upcoming clinical sessions for the patient.
//
// UpcomingSessions.jsx consumes this through props, not by importing this
// file directly, so integration later only requires changing
// NutritionistSupervision.jsx.
//
// Expected real API shape (adjust once the backend contract is confirmed):
//   GET /api/nutritionist/sessions/upcoming -> { sessions: Session[] }
//
// Session shape used throughout this feature:
//   {
//     id: string | number,
//     title: string,
//     date: string,   // ISO 8601 date, e.g. '2026-10-12'
//     time: string,   // display string, e.g. '10:00 AM (EAT)'
//   }

export const mockUpcomingSessions = [
  {
    id: 1,
    title: 'Follow-up: Abiy Tsom Prep',
    date: '2026-10-12',
    time: '10:00 AM (EAT)',
  },
];
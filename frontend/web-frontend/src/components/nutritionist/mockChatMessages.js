// TEMPORARY MOCK DATA — replace with a real API call once the backend
// chat endpoint exists (Clinical System / doctor-patient chat work).
//
// This file is the ONLY thing that should need to change when real data
// arrives. SecureChat.jsx consumes messages through props, not from this
// file directly, so swapping this out is a one-line change in
// NutritionistSupervision.jsx, not a rewrite of the chat UI.
//
// Expected real API shape (adjust once the backend contract is confirmed):
//   GET  /api/clinical/chat/:patientId  -> { messages: ChatMessage[] }
//   POST /api/clinical/chat/:patientId  -> { message: ChatMessage }
//
// ChatMessage shape used throughout this feature:
//   {
//     id: string | number,
//     sender: 'user' | 'doctor',
//     type: 'text' | 'audio',
//     text: string,
//     timestamp: string, // ISO 8601, e.g. new Date().toISOString()
//   }

export const mockDietitianStatus = {
  name: 'Dr. Selamawit Tadesse',
  isOnline: true,
};

export const mockChatMessages = [
  {
    id: 1,
    sender: 'doctor',
    type: 'text',
    text: "I've analyzed your recent logs and noticed your iron intake is lower than usual. Would you like some traditional recipe suggestions rich in iron?",
    timestamp: '2026-08-16T16:30:00.000Z',
  },
  {
    id: 2,
    sender: 'user',
    type: 'text',
    text: 'Thank you, doctor. I will add Gomen to my dinner tonight.',
    timestamp: '2026-08-17T09:15:00.000Z',
  },
];
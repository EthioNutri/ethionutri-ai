const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

export const getAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '') {
    return DEFAULT_AVATAR;
  }
  const clean = avatar.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:image')) {
    return clean;
  }
  const isProd = typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  const backendBase = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    (isProd ? 'https://ethionutri-backend.onrender.com' : 'http://localhost:5000')
  ).replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

  return `${backendBase}${clean.startsWith('/') ? '' : '/'}${clean}`;
};

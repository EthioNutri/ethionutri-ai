const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api/v1', '');

export const getAvatarUrl = (avatar) => {
  if (!avatar) return '';
  if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image')) {
    return avatar;
  }
  return `${BACKEND_URL}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
};

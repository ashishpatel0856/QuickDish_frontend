export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getDeliveryTime = () => {
  const now = new Date();
  const deliveryTime = new Date(now.getTime() + 35 * 60000);
  return deliveryTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

export const storage = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return localStorage.getItem(key); } },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear()
};
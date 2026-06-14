// Format price in Indian Rupees
export const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

// Get first letter of a name for avatar fallback
export const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

// Generate a consistent color from a string (for avatars)
export const getAvatarColor = (name) => {
  const colors = ["#8b5cf6", "#ec4899", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Sleep for simulating async operations
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Generate a random 6-char room code
export const generateRoomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Get star rating display
export const getRatingStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
};

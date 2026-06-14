export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const ROOM_TYPES = {
  PUBLIC: "public",
  PRIVATE: "private",
};

export const ROOM_STATUS = {
  ACTIVE: "active",
  CLOSED: "closed",
};

export const VOTE_TYPES = {
  UPVOTE: "upvote",
  DOWNVOTE: "downvote",
};

export const PRODUCT_CATEGORIES = [
  "fashion",
  "electronics",
  "beauty",
  "home",
  "sports",
  "books",
  "toys",
  "grocery",
  "health",
  "automotive",
];

export const NOTIFICATION_TYPES = {
  ROOM_INVITE: "room_invite",
  VOTE_UPDATE: "vote_update",
  AI_SUGGESTION: "ai_suggestion",
  PRODUCT_SHARED: "product_shared",
  ROOM_CLOSED: "room_closed",
  NEW_MESSAGE: "new_message",
};

export const MESSAGE_TYPES = {
  TEXT: "text",
  PRODUCT_SHARE: "product_share",
  SYSTEM: "system",
  AI: "ai",
};

export const CART_ITEM_STATUS = {
  ADDED: "added",
  APPROVED: "approved",
  REMOVED: "removed",
};

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "15m",
  REFRESH_TOKEN: "7d",
  PASSWORD_RESET: "10m",
  EMAIL_VERIFY: "24h",
};

export const LIMITS = {
  MAX_ROOM_MEMBERS: 20,
  MAX_ROOMS_CREATED: 10,
  MAX_CART_ITEMS: 50,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_BIO_LENGTH: 160,
  MAX_USERNAME_LENGTH: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // Room
  JOIN_ROOM: "room:join",
  LEAVE_ROOM: "room:leave",
  ROOM_UPDATED: "room:updated",
  ROOM_CLOSED: "room:closed",

  // Chat
  SEND_MESSAGE: "chat:send",
  NEW_MESSAGE: "chat:new",
  TYPING_START: "chat:typing_start",
  TYPING_STOP: "chat:typing_stop",

  // Voting
  CAST_VOTE: "vote:cast",
  VOTE_UPDATED: "vote:updated",

  // Cart
  ADD_TO_CART: "cart:add",
  REMOVE_FROM_CART: "cart:remove",
  CART_UPDATED: "cart:updated",

  // Product
  SHARE_PRODUCT: "product:share",
  PRODUCT_SHARED: "product:shared",

  // Presence
  USER_ONLINE: "presence:online",
  USER_OFFLINE: "presence:offline",
  MEMBERS_LIST: "presence:members",

  // AI
  AI_RECOMMENDATION: "ai:recommendation",
  AI_SUMMARY: "ai:summary",

  // Notification
  NEW_NOTIFICATION: "notification:new",

  // Reaction
  SEND_REACTION: "reaction:send",
  NEW_REACTION: "reaction:new",
};
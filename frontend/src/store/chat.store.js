import { create } from "zustand";
import { MOCK_MESSAGES } from "../config/constants";

const useChatStore = create((set) => ({
  messages: MOCK_MESSAGES,
  typingUsers: [],

  setMessages: (messages) => set({ messages }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  addTypingUser: (user) =>
    set((state) => ({
      typingUsers: state.typingUsers.includes(user)
        ? state.typingUsers
        : [...state.typingUsers, user],
    })),

  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u !== userId),
    })),

  clearMessages: () => set({ messages: [] }),
}));

export default useChatStore;

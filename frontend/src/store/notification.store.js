import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  removeNotification: (notificationId) =>
    set((state) => {
      const notif = state.notifications.find((n) => n._id === notificationId);
      const wasUnread = notif && !notif.isRead;
      return {
        notifications: state.notifications.filter((n) => n._id !== notificationId),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),

  setLoading: (loading) => set({ loading }),
}));

export default useNotificationStore;
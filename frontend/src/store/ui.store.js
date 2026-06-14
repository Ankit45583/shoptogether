import { create } from "zustand";

const useUIStore = create((set) => ({
  sidebarOpen: true,
  activeRoomTab: "products",

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveRoomTab: (tab) => set({ activeRoomTab: tab }),
}));

export default useUIStore;

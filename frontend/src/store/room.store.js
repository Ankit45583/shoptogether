import { create } from "zustand";

const useRoomStore = create((set) => ({
  currentRoom: null,
  myRooms: [],
  publicRooms: [],
  isLoading: false,

  // Set current room (Live Room page ke liye)
  setCurrentRoom: (room) => set({ currentRoom: room }),

  // Set my rooms
  setMyRooms: (rooms) => set({ myRooms: rooms }),

  // Set public rooms
  setPublicRooms: (rooms) => set({ publicRooms: rooms }),

  // Add a new room (after create)
  addRoom: (room) =>
    set((state) => ({
      myRooms: [room, ...state.myRooms],
    })),

  // Remove room (after leave/close)
  removeRoom: (roomId) =>
    set((state) => ({
      myRooms: state.myRooms.filter((r) => r._id !== roomId && r.id !== roomId),
    })),

  // Loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Clear all (on logout)
  clearRooms: () =>
    set({
      currentRoom: null,
      myRooms: [],
      publicRooms: [],
    }),
}));

export default useRoomStore;
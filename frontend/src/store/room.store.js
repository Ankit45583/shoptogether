import { create } from "zustand";
import { MOCK_ROOMS } from "../config/constants";

const useRoomStore = create((set) => ({
  currentRoom: null,
  myRooms: MOCK_ROOMS.slice(0, 3),
  publicRooms: MOCK_ROOMS.filter((r) => r.type === "public"),
  isLoading: false,

  setCurrentRoom: (room) => set({ currentRoom: room }),
  setMyRooms: (rooms) => set({ myRooms: rooms }),
  setPublicRooms: (rooms) => set({ publicRooms: rooms }),
  setLoading: (isLoading) => set({ isLoading }),

  addRoom: (room) => set((state) => ({ myRooms: [room, ...state.myRooms] })),
}));

export default useRoomStore;

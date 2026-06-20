import Room from "../../models/Room.model.js";

const roomHandler = (io, socket) => {
  /* ==========================================
     JOIN ROOM
  ========================================== */
  
  socket.on("room:join", async (data) => {
    try {
      // ✅ Safety check
      if (!socket.user) {
        socket.emit("error", { message: "Not authenticated" });
        return;
      }

      const { roomId } = data;

      if (!roomId) {
        socket.emit("error", { message: "Room ID required" });
        return;
      }

      const room = await Room.findById(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const isMember = room.members.some(
        (m) => m.user.toString() === socket.user._id.toString()
      );

      if (!isMember) {
        socket.emit("error", { message: "Not a room member" });
        return;
      }

      // Join socket room
      socket.join(roomId);

      console.log(`✅ ${socket.user.username} joined room: ${roomId}`);

      // Notify others
      socket.to(roomId).emit("room:member_joined", {
        user: {
          _id: socket.user._id,
          name: socket.user.name,
          username: socket.user.username,
          avatar: socket.user.avatar,
        },
      });

      socket.emit("room:joined", {
        roomId,
        message: "Joined room successfully",
      });
    } catch (error) {
      console.error("room:join error:", error.message);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  /* ==========================================
     LEAVE ROOM
  ========================================== */

  socket.on("room:leave", (data) => {
    try {
      // ✅ Safety check — user disconnect ho gaya ho to crash mat ho
      if (!socket.user) {
        return;
      }

      const { roomId } = data || {};

      if (!roomId) {
        return;
      }

      socket.leave(roomId);

      console.log(`👋 ${socket.user.username} left room: ${roomId}`);

      // Notify others
      socket.to(roomId).emit("room:member_left", {
        user: {
          _id: socket.user._id,
          name: socket.user.name,
          username: socket.user.username,
        },
      });
    } catch (error) {
      console.error("room:leave error:", error.message);
    }
  });
};

export default roomHandler;
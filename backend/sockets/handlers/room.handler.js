import Room from "../../models/Room.model.js";

const roomHandler = (io, socket) => {
  // ─── Join Room ────────────────────────────────────────
  socket.on("room:join", async (data) => {
    try {
      const { roomId } = data;

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
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // ─── Leave Room ───────────────────────────────────────
  socket.on("room:leave", (data) => {
    const { roomId } = data;

    socket.leave(roomId);

    socket.to(roomId).emit("room:member_left", {
      user: {
        _id: socket.user._id,
        name: socket.user.name,
        username: socket.user.username,
      },
    });
  });
};

export default roomHandler;
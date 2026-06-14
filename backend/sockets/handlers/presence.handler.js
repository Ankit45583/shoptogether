const presenceHandler = (io, socket) => {
  // ─── Get Online Members ───────────────────────────────
  socket.on("presence:get_members", async (data) => {
    const { roomId } = data;

    const socketsInRoom = await io.in(roomId).fetchSockets();

    const onlineMembers = socketsInRoom.map((s) => ({
      _id: s.user._id,
      name: s.user.name,
      username: s.user.username,
      avatar: s.user.avatar,
    }));

    socket.emit("presence:members", {
      roomId,
      onlineMembers,
    });
  });

  // ─── On Disconnect ────────────────────────────────────
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit("presence:offline", {
          user: {
            _id: socket.user._id,
            name: socket.user.name,
            username: socket.user.username,
          },
        });
      }
    });
  });
};

export default presenceHandler;
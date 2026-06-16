import Vote from "../../models/Vote.model.js";
import Product from "../../models/Product.model.js";
import Room from "../../models/Room.model.js";
import { VOTE_EVENTS } from "../events/vote.events.js";
import logger from "../../utils/logger.js";

const recalculateVotes = async (productId, roomId) => {
  const [up, down] = await Promise.all([
    Vote.countDocuments({ product: productId, room: roomId, type: "upvote" }),
    Vote.countDocuments({ product: productId, room: roomId, type: "downvote" }),
  ]);

  await Product.findByIdAndUpdate(productId, {
    "totalVotes.up": up,
    "totalVotes.down": down,
  });

  const total = up + down;
  const percentage = total > 0 ? Math.round((up / total) * 100) : 0;
  return { up, down, total, percentage };
};

const voteHandler = (io, socket) => {
  // cast a vote
  socket.on(VOTE_EVENTS.CAST, async ({ productId, roomId, type }) => {
    try {
      if (!productId || !roomId || !type) {
        return socket.emit("error", { message: "productId, roomId, and type are required" });
      }

      if (!["upvote", "downvote"].includes(type)) {
        return socket.emit("error", { message: "Invalid vote type" });
      }

      const room = await Room.findById(roomId).lean();
      if (!room) return socket.emit("error", { message: "Room not found" });

      const isMember = room.members.some((m) => m.user.toString() === socket.user._id.toString());
      if (!isMember) return socket.emit("error", { message: "Not a room member" });

      const existing = await Vote.findOne({
        product: productId,
        room: roomId,
        user: socket.user._id,
      });

      let userVote = null;
      let action = "";

      if (existing) {
        if (existing.type === type) {
          await Vote.findByIdAndDelete(existing._id);
          action = "removed";
        } else {
          existing.type = type;
          await existing.save();
          userVote = type;
          action = "updated";
        }
      } else {
        await Vote.create({ product: productId, room: roomId, user: socket.user._id, type });
        userVote = type;
        action = "created";
      }

      const votes = await recalculateVotes(productId, roomId);

      io.to(roomId).emit(VOTE_EVENTS.UPDATED, {
        productId,
        roomId,
        votes,
        userVote: action === "removed" ? null : userVote,
        votedBy: socket.user._id,
        action,
      });
    } catch (err) {
      logger.error("vote:cast socket error:", err.message);
      socket.emit("error", { message: "Failed to cast vote" });
    }
  });

  // get all votes for a room
  socket.on(VOTE_EVENTS.GET_ROOM_VOTES, async ({ roomId }) => {
    try {
      if (!roomId) return socket.emit("error", { message: "roomId is required" });

      const room = await Room.findById(roomId).lean();
      if (!room) return socket.emit("error", { message: "Room not found" });

      const isMember = room.members.some((m) => m.user.toString() === socket.user._id.toString());
      if (!isMember) return socket.emit("error", { message: "Not a room member" });

      const votes = await Vote.find({ room: roomId })
        .populate("product", "name price thumbnail")
        .populate("user", "name username avatar")
        .lean();

      const grouped = {};
      for (const vote of votes) {
        const pid = vote.product?._id?.toString();
        if (!pid) continue;
        if (!grouped[pid]) {
          grouped[pid] = {
            productId: vote.product._id,
            product: vote.product,
            votes: { up: 0, down: 0, total: 0, percentage: 0 },
            userVote: null,
            voters: { up: [], down: [] },
          };
        }
        if (vote.type === "upvote") {
          grouped[pid].votes.up++;
          grouped[pid].voters.up.push(vote.user);
        } else {
          grouped[pid].votes.down++;
          grouped[pid].voters.down.push(vote.user);
        }
        if (vote.user?._id?.toString() === socket.user._id.toString()) {
          grouped[pid].userVote = vote.type;
        }
      }

      const result = Object.values(grouped).map((g) => {
        g.votes.total = g.votes.up + g.votes.down;
        g.votes.percentage =
          g.votes.total > 0 ? Math.round((g.votes.up / g.votes.total) * 100) : 0;
        return g;
      });

      socket.emit("vote:room_votes", { roomId, votes: result });
    } catch (err) {
      logger.error("vote:get_room_votes socket error:", err.message);
      socket.emit("error", { message: "Failed to fetch room votes" });
    }
  });
};

export default voteHandler;

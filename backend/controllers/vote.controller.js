import Vote from "../models/Vote.model.js";
import Product from "../models/Product.model.js";
import Room from "../models/Room.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { castVoteValidator } from "../validators/vote.validator.js";
import { createNotification } from "../services/notification.service.js";
import { NOTIFICATION_TYPES } from "../config/constants.js";

const recalculateProductVotes = async (productId, roomId) => {
  const [upCount, downCount] = await Promise.all([
    Vote.countDocuments({ product: productId, room: roomId, type: "upvote" }),
    Vote.countDocuments({ product: productId, room: roomId, type: "downvote" }),
  ]);

  await Product.findByIdAndUpdate(productId, {
    "totalVotes.up": upCount,
    "totalVotes.down": downCount,
  });

  return { up: upCount, down: downCount };
};

export const castVote = asyncHandler(async (req, res) => {
  const { error, value } = castVoteValidator.validate(req.body, { abortEarly: false });
  if (error) throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  const { productId, roomId, type } = value;
  const io = req.app.get("io");

  const [product, room] = await Promise.all([
    Product.findById(productId),
    Room.findById(roomId),
  ]);

  if (!product) throw new ApiError(404, "Product not found");
  if (!room) throw new ApiError(404, "Room not found");

  const isMember = room.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "You are not a member of this room");

  const existingVote = await Vote.findOne({ product: productId, room: roomId, user: req.user._id });

  let vote = null;
  let action = "";

  if (existingVote) {
    if (existingVote.type === type) {
      // Toggle off — remove vote
      await Vote.findByIdAndDelete(existingVote._id);
      action = "removed";
    } else {
      // Change vote type
      existingVote.type = type;
      await existingVote.save();
      vote = existingVote;
      action = "updated";
    }
  } else {
    vote = await Vote.create({ product: productId, room: roomId, user: req.user._id, type });
    action = "created";
  }

  const { up, down } = await recalculateProductVotes(productId, roomId);
  const total = up + down;
  const percentage = total > 0 ? Math.round((up / total) * 100) : 0;
  const userVote = action === "removed" ? null : type;

  const voteData = {
    productId,
    roomId,
    votes: { up, down, total, percentage },
    userVote,
    votedBy: req.user._id,
    action,
  };

  if (io) {
    io.to(roomId).emit("vote:updated", voteData);
  }

  // Notify product owner if they're not the voter
  if (action !== "removed" && product.addedBy?.toString() !== req.user._id.toString()) {
    createNotification({
      recipient: product.addedBy,
      sender: req.user._id,
      type: NOTIFICATION_TYPES.VOTE_UPDATE,
      title: `${type === "upvote" ? "👍" : "👎"} Vote on your product`,
      message: `${req.user.name} ${type === "upvote" ? "upvoted" : "downvoted"} "${product.name}"`,
      data: { roomId, productId },
      io,
    });
  }

  return res.status(200).json(
    new ApiResponse(200, {
      vote,
      productVotes: { up, down, total, percentage, userVote },
    }, `Vote ${action} successfully`)
  );
});

export const getRoomVotes = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findById(roomId).lean();
  if (!room) throw new ApiError(404, "Room not found");

  const isMember = room.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "You are not a member of this room");

  const votes = await Vote.find({ room: roomId })
    .populate("product", "name price thumbnail")
    .populate("user", "name username avatar")
    .lean();

  // Group by product
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

    if (vote.user?._id?.toString() === req.user._id.toString()) {
      grouped[pid].userVote = vote.type;
    }
  }

  // Calculate totals and percentages
  const result = Object.values(grouped).map((g) => {
    g.votes.total = g.votes.up + g.votes.down;
    g.votes.percentage = g.votes.total > 0 ? Math.round((g.votes.up / g.votes.total) * 100) : 0;
    return g;
  });

  return res.status(200).json(new ApiResponse(200, { votes: result }, "Room votes fetched"));
});

export const getProductVotes = asyncHandler(async (req, res) => {
  const { productId, roomId } = req.params;

  const room = await Room.findById(roomId).lean();
  if (!room) throw new ApiError(404, "Room not found");

  const isMember = room.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "You are not a member of this room");

  const votes = await Vote.find({ product: productId, room: roomId })
    .populate("user", "name username avatar")
    .lean();

  const up = votes.filter((v) => v.type === "upvote").length;
  const down = votes.filter((v) => v.type === "downvote").length;
  const total = up + down;
  const percentage = total > 0 ? Math.round((up / total) * 100) : 0;
  const consensus = percentage >= 70 ? "strong_approval" : percentage >= 50 ? "mild_approval" : percentage === 50 ? "split" : "disapproval";

  const userVote = votes.find((v) => v.user?._id?.toString() === req.user._id.toString())?.type || null;

  return res.status(200).json(
    new ApiResponse(200, {
      productId,
      votes: { up, down, total, percentage, consensus },
      userVote,
      voters: {
        up: votes.filter((v) => v.type === "upvote").map((v) => v.user),
        down: votes.filter((v) => v.type === "downvote").map((v) => v.user),
      },
    }, "Product votes fetched")
  );
});

export const getVoteSummary = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findById(roomId).lean();
  if (!room) throw new ApiError(404, "Room not found");

  const isMember = room.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "You are not a member of this room");

  const votes = await Vote.find({ room: roomId })
    .populate("product", "name price thumbnail category")
    .lean();

  // Aggregate per product
  const productMap = {};
  for (const vote of votes) {
    const pid = vote.product?._id?.toString();
    if (!pid) continue;
    if (!productMap[pid]) {
      productMap[pid] = { product: vote.product, up: 0, down: 0 };
    }
    if (vote.type === "upvote") productMap[pid].up++;
    else productMap[pid].down++;
  }

  const ranked = Object.values(productMap)
    .map((p) => {
      const total = p.up + p.down;
      const percentage = total > 0 ? Math.round((p.up / total) * 100) : 0;
      return { ...p, total, percentage };
    })
    .sort((a, b) => b.percentage - a.percentage || b.up - a.up);

  const topProduct = ranked[0] || null;
  const consensusPercentage = topProduct?.percentage || 0;
  const top3 = ranked.slice(0, 3);

  return res.status(200).json(
    new ApiResponse(200, {
      summary: {
        totalVotes: votes.length,
        totalProducts: ranked.length,
        mostVotedProduct: topProduct
          ? {
              product: topProduct.product,
              votes: { up: topProduct.up, down: topProduct.down, total: topProduct.total, percentage: topProduct.percentage },
            }
          : null,
        consensusPercentage,
        top3Products: top3.map((p) => ({
          product: p.product,
          votes: { up: p.up, down: p.down, total: p.total, percentage: p.percentage },
        })),
      },
    }, "Vote summary fetched")
  );
});

import mongoose from "mongoose";
import { VOTE_TYPES } from "../config/constants.js";

const voteSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    type: {
      type: String,
      enum: Object.values(VOTE_TYPES),
      required: [true, "Vote type is required"],
    },
  },
  { timestamps: true }
);

voteSchema.index({ product: 1, room: 1, user: 1 }, { unique: true });
voteSchema.index({ product: 1 });
voteSchema.index({ room: 1 });
voteSchema.index({ user: 1 });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;

import mongoose from "mongoose";
import { CART_ITEM_STATUS } from "../config/constants.js";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, "Quantity must be at least 1"],
    max: [10, "Quantity cannot exceed 10"],
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: Object.values(CART_ITEM_STATUS),
    default: CART_ITEM_STATUS.ADDED,
  },
  note: {
    type: String,
    maxlength: [100, "Note cannot exceed 100 characters"],
  },
});

const groupCartSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

groupCartSchema.index({ room: 1 });

const GroupCart = mongoose.model("GroupCart", groupCartSchema);
export default GroupCart;

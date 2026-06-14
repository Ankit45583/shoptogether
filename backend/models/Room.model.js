import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      minlength: [2, "Room name must be at least 2 characters"],
      maxlength: [50, "Room name cannot exceed 50 characters"],
    },

    code: {
      type: String,
      unique: true,
      required: true,
    },

    type: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    description: {
      type: String,
      default: "",
      maxlength: [200, "Description cannot exceed 200 characters"],
    },

    category: {
      type: String,
      default: "general",
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["host", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    maxMembers: {
      type: Number,
      default: 20,
      max: [50, "Max members cannot exceed 50"],
    },

    inviteLink: {
      type: String,
      default: "",
    },

    sharedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    settings: {
      allowChat: {
        type: Boolean,
        default: true,
      },
      allowVoting: {
        type: Boolean,
        default: true,
      },
      allowProductShare: {
        type: Boolean,
        default: true,
      },
      aiHostEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.index({ code: 1 });
roomSchema.index({ host: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ type: 1, status: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
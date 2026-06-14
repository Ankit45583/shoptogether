import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    type: {
      type: String,
      enum: ["text", "product_share", "system", "ai"],
      default: "text",
    },

    // Product share ke liye
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // Reactions
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: {
          type: String,
        },
      },
    ],

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ─── Basic Info ────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // ─── Profile ───────────────────────────────────────────
    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: [160, "Bio cannot exceed 160 characters"],
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      ],
    },

    // ─── Status ────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ─── Room History ──────────────────────────────────────
    roomsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],

    roomsJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],

    // ─── Saved Products ────────────────────────────────────
    savedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // ─── Preferences ───────────────────────────────────────
    preferences: {
      categories: {
        type: [String],
        default: [],
      },

      priceRange: {
        min: {
          type: Number,
          default: 0,
        },

        max: {
          type: Number,
          default: 10000,
        },
      },

      notifications: {
        roomInvites: {
          type: Boolean,
          default: true,
        },

        voteUpdates: {
          type: Boolean,
          default: true,
        },

        aiSuggestions: {
          type: Boolean,
          default: true,
        },
      },
    },

    // ─── Security / Auth ───────────────────────────────────
    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpiry: {
      type: Date,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Password Hashing ─────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ─── Compare Password ─────────────────────────────────────
userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ─── Safe User Object ─────────────────────────────────────
userSchema.methods.toSafeObject = function () {
  const user = this.toObject();

  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpiry;
  delete user.__v;

  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
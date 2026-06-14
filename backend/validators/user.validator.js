import Joi from "joi";

export const updateProfileValidator = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),

  username: Joi.string()
    .min(3)
    .max(20)
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 20 characters",
      "string.pattern.base":
        "Username can only contain letters, numbers and underscores",
    }),

  bio: Joi.string().max(160).allow("").messages({
    "string.max": "Bio cannot exceed 160 characters",
  }),

  preferences: Joi.object({
    categories: Joi.array().items(Joi.string()),
    priceRange: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
    }),
    notifications: Joi.object({
      roomInvites: Joi.boolean(),
      voteUpdates: Joi.boolean(),
      aiSuggestions: Joi.boolean(),
    }),
  }),
});

export const changePasswordValidator = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),

  newPassword: Joi.string().min(6).max(100).required().messages({
    "string.min": "New password must be at least 6 characters",
    "any.required": "New password is required",
  }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});
import Joi from "joi";

export const registerValidator = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),

  username: Joi.string()
    .min(3)
    .max(20)
    .trim()
    .lowercase() 
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 20 characters",
      "string.pattern.base":
        "Username can only contain letters, numbers and underscores",
      "any.required": "Username is required",
    }),

  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password cannot exceed 100 characters",
    "any.required": "Password is required",
  }),
});

export const loginValidator = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
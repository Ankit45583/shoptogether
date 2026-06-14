import Joi from "joi";

export const createRoomValidator = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    "string.min": "Room name must be at least 2 characters",
    "string.max": "Room name cannot exceed 50 characters",
    "any.required": "Room name is required",
  }),

  type: Joi.string().valid("public", "private").default("public").messages({
    "any.only": "Room type must be public or private",
  }),

  description: Joi.string().max(200).allow("").messages({
    "string.max": "Description cannot exceed 200 characters",
  }),

  category: Joi.string().max(30).default("general"),

  maxMembers: Joi.number().min(2).max(50).default(20).messages({
    "number.min": "Room must allow at least 2 members",
    "number.max": "Room cannot have more than 50 members",
  }),

  settings: Joi.object({
    allowChat: Joi.boolean().default(true),
    allowVoting: Joi.boolean().default(true),
    allowProductShare: Joi.boolean().default(true),
    aiHostEnabled: Joi.boolean().default(true),
  }),
});

export const updateRoomValidator = Joi.object({
  name: Joi.string().min(2).max(50).trim(),
  description: Joi.string().max(200).allow(""),
  type: Joi.string().valid("public", "private"),
  maxMembers: Joi.number().min(2).max(50),
  settings: Joi.object({
    allowChat: Joi.boolean(),
    allowVoting: Joi.boolean(),
    allowProductShare: Joi.boolean(),
    aiHostEnabled: Joi.boolean(),
  }),
});

export const joinRoomValidator = Joi.object({
  code: Joi.string().length(6).required().messages({
    "string.length": "Room code must be 6 characters",
    "any.required": "Room code is required",
  }),
});
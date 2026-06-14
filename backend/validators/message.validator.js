import Joi from "joi";

export const sendMessageValidator = Joi.object({
  content: Joi.string().max(1000).trim().required().messages({
    "string.max": "Message cannot exceed 1000 characters",
    "any.required": "Message content is required",
  }),

  type: Joi.string()
    .valid("text", "product_share", "system", "ai")
    .default("text"),

  product: Joi.string().allow(null, ""),
});
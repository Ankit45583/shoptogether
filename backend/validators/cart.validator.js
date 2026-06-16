import Joi from "joi";

export const addToCartValidator = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "any.required": "Product ID is required",
    "string.hex": "Invalid product ID",
    "string.length": "Invalid product ID",
  }),
  quantity: Joi.number().integer().min(1).max(10).default(1).messages({
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 10",
  }),
  note: Joi.string().max(100).optional().allow(""),
});

export const updateCartItemValidator = Joi.object({
  quantity: Joi.number().integer().min(1).max(10).optional(),
  note: Joi.string().max(100).optional().allow(""),
});

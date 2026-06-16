import Joi from "joi";
import { PRODUCT_CATEGORIES } from "../config/constants.js";

const categories = Object.values(PRODUCT_CATEGORIES);

export const createProductValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Product name is required",
  }),
  description: Joi.string().max(500).optional().allow(""),
  price: Joi.number().min(0).required().messages({
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  originalPrice: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  category: Joi.string()
    .valid(...categories)
    .optional(),
  brand: Joi.string().optional().allow(""),
  tags: Joi.array().items(Joi.string()).optional(),
  inStock: Joi.boolean().optional(),
});

export const updateProductValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().max(500).optional().allow(""),
  price: Joi.number().min(0).optional(),
  originalPrice: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  category: Joi.string()
    .valid(...categories)
    .optional(),
  brand: Joi.string().optional().allow(""),
  tags: Joi.array().items(Joi.string()).optional(),
  inStock: Joi.boolean().optional(),
});

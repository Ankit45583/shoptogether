import Joi from "joi";
import { VOTE_TYPES } from "../config/constants.js";

export const castVoteValidator = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "any.required": "Product ID is required",
    "string.hex": "Invalid product ID",
    "string.length": "Invalid product ID",
  }),
  roomId: Joi.string().hex().length(24).required().messages({
    "any.required": "Room ID is required",
    "string.hex": "Invalid room ID",
    "string.length": "Invalid room ID",
  }),
  type: Joi.string()
    .valid(...Object.values(VOTE_TYPES))
    .required()
    .messages({
      "any.only": "Vote type must be upvote or downvote",
      "any.required": "Vote type is required",
    }),
});

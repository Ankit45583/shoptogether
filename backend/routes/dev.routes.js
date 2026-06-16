import express from "express";
import { seedDatabase } from "../utils/seedData.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = express.Router();

// GET /api/dev/seed
router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const result = await seedDatabase();
    return res.status(200).json(new ApiResponse(200, result, "Database seeded successfully"));
  })
);

export default router;

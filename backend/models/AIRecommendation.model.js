import mongoose from "mongoose";

const aiRecommendationSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    generatedBy: {
      type: String,
      default: "gpt-3.5-turbo",
    },
    type: {
      type: String,
      enum: ["product_recommendation", "mood_analysis", "budget_summary", "preference_summary"],
      required: [true, "Type is required"],
    },
    input: {
      messages: [String],
      votes: mongoose.Schema.Types.Mixed,
      preferences: mongoose.Schema.Types.Mixed,
    },
    output: {
      summary: String,
      recommendations: [
        {
          productName: String,
          reason: String,
          estimatedPrice: String,
          category: String,
        },
      ],
      detectedMood: String,
      budgetRange: {
        min: Number,
        max: Number,
      },
      preferredCategories: [String],
      tags: [String],
    },
    tokensUsed: Number,
    processingTime: Number,
  },
  { timestamps: true }
);

aiRecommendationSchema.index({ room: 1 });
aiRecommendationSchema.index({ type: 1 });

const AIRecommendation = mongoose.model("AIRecommendation", aiRecommendationSchema);
export default AIRecommendation;

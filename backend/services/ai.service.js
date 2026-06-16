import openai from "../config/openai.js";
import logger from "../utils/logger.js";

/**
 * Analyzes group chat messages for mood, preferences, and budget.
 * @param {string[]} messages - Array of message strings
 * @returns {Promise<{mood, categories, budgetRange, preferences}>}
 */
export const analyzeGroupChat = async (messages) => {
  const startTime = Date.now();

  const fallback = {
    mood: "enthusiastic",
    categories: ["electronics", "fashion"],
    budgetRange: { min: 500, max: 5000, currency: "INR" },
    preferences: { style: "casual", brand: "any" },
    tokensUsed: 0,
    processingTime: Date.now() - startTime,
  };

  if (!messages || messages.length === 0) return fallback;

  try {
    const chatText = messages.slice(0, 30).join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content:
            'You are a shopping assistant AI. Analyze this group chat and extract: mood, preferred categories, budget range (in INR), and key preferences. Return ONLY valid JSON with keys: mood (string), categories (array of strings), budgetRange ({min: number, max: number, currency: "INR"}), preferences (object with any relevant keys).',
        },
        {
          role: "user",
          content: `Group chat messages:\n${chatText}`,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    logger.info(`analyzeGroupChat tokens used: ${response.usage?.total_tokens}`);

    return {
      ...parsed,
      tokensUsed: response.usage?.total_tokens || 0,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    logger.error("OpenAI analyzeGroupChat error:", error.message);
    return fallback;
  }
};

/**
 * Generates product recommendations based on group data.
 * @param {Object} groupData - { messages, votes, preferences, budget }
 * @returns {Promise<Array>}
 */
export const generateRecommendations = async ({ messages = [], votes = {}, preferences = {}, budget = {} }) => {
  const startTime = Date.now();

  const fallback = {
    recommendations: [
      {
        productName: "boAt Rockerz 450",
        reason: "Popular wireless headphones with great bass, fits group budget",
        estimatedPrice: "₹1,499",
        category: "electronics",
      },
      {
        productName: "Nike Sports T-Shirt",
        reason: "Versatile fashion pick trending in your group",
        estimatedPrice: "₹1,299",
        category: "fashion",
      },
      {
        productName: "Noise ColorFit Pro 4",
        reason: "Feature-rich smartwatch at an affordable price",
        estimatedPrice: "₹3,499",
        category: "electronics",
      },
    ],
    tokensUsed: 0,
    processingTime: Date.now() - startTime,
  };

  try {
    const chatText = messages.slice(0, 50).join("\n");
    const votesSummary = JSON.stringify(votes).slice(0, 500);
    const prefSummary = JSON.stringify(preferences).slice(0, 300);
    const budgetSummary = JSON.stringify(budget);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content:
            'You are an AI shopping assistant for a group of Indian shoppers. Based on the group chat, votes, and preferences, recommend 3-5 products available in India. Return ONLY valid JSON array where each item has: productName (string), reason (string), estimatedPrice (string with ₹ symbol), category (string from: fashion, electronics, beauty, home, sports, books, toys, grocery, health, automotive).',
        },
        {
          role: "user",
          content: `Group chat:\n${chatText}\n\nVotes summary: ${votesSummary}\nPreferences: ${prefSummary}\nBudget: ${budgetSummary}`,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    logger.info(`generateRecommendations tokens used: ${response.usage?.total_tokens}`);

    return {
      recommendations: Array.isArray(parsed) ? parsed : parsed.recommendations || fallback.recommendations,
      tokensUsed: response.usage?.total_tokens || 0,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    logger.error("OpenAI generateRecommendations error:", error.message);
    return fallback;
  }
};

/**
 * Generates a human-readable summary of the room's shopping session.
 * @param {Object} roomData - { roomName, messages, votes, cartItems, members }
 * @returns {Promise<string>}
 */
export const generateGroupSummary = async ({ roomName, messages = [], votes = {}, cartItems = [], members = [] }) => {
  const startTime = Date.now();

  const fallback = {
    summary: `The group "${roomName}" with ${members.length} member(s) is actively shopping together. They have been discussing products and voting on their favourites.`,
    tokensUsed: 0,
    processingTime: Date.now() - startTime,
  };

  try {
    const chatText = messages.slice(0, 30).join("\n");
    const cartSummary = cartItems
      .slice(0, 5)
      .map((i) => i.product?.name || "item")
      .join(", ");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are a shopping session summarizer. Write a single human-readable paragraph (2-3 sentences) summarizing the group shopping session. Mention the number of members, what they're shopping for, popular items, and estimated budget if detectable. Keep it conversational and friendly.",
        },
        {
          role: "user",
          content: `Room: "${roomName}"\nMembers: ${members.length}\nCart items: ${cartSummary || "none yet"}\nChat:\n${chatText}\nVotes: ${JSON.stringify(votes).slice(0, 400)}`,
        },
      ],
    });

    const summary = response.choices[0]?.message?.content?.trim() || fallback.summary;
    logger.info(`generateGroupSummary tokens used: ${response.usage?.total_tokens}`);

    return {
      summary,
      tokensUsed: response.usage?.total_tokens || 0,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    logger.error("OpenAI generateGroupSummary error:", error.message);
    return fallback;
  }
};

/**
 * Detects budget range from messages.
 * @param {string[]} messages
 * @returns {Promise<{min: number, max: number, currency: string}>}
 */
export const detectBudget = async (messages) => {
  const fallback = { min: 500, max: 5000, currency: "INR" };

  if (!messages || messages.length === 0) return fallback;

  try {
    const chatText = messages.slice(0, 20).join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content:
            'Extract the budget range from the group chat. Return ONLY valid JSON: { "min": number, "max": number, "currency": "INR" }. If no budget is mentioned, estimate from context.',
        },
        {
          role: "user",
          content: chatText,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    logger.error("OpenAI detectBudget error:", error.message);
    return fallback;
  }
};

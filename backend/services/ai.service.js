import ai from "../config/gemini.js";
import logger from "../utils/logger.js";

/* ==========================================
   HELPER: Clean JSON from Gemini response
========================================== */
const cleanJSON = (raw) => {
  return raw.replace(/```json/g, "").replace(/```/g, "").trim();
};

/* ==========================================
   HELPER: Call Gemini
========================================== */
const callGemini = async (prompt) => {
  const response = await ai.generateContent(prompt);
  return response.text;
};

/* ==========================================
   1. ANALYZE GROUP CHAT
========================================== */
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
    const prompt = `You are a shopping assistant AI. Analyze this group chat and extract: mood, preferred categories, budget range (in INR), and key preferences. Return ONLY valid JSON with keys: mood (string), categories (array of strings), budgetRange ({min: number, max: number, currency: "INR"}), preferences (object). No markdown.

Chat:
${chatText}`;

    const raw = await callGemini(prompt);
    const parsed = JSON.parse(cleanJSON(raw));

    logger.info(`✅ analyzeGroupChat success`);
    return { ...parsed, tokensUsed: 0, processingTime: Date.now() - startTime };
  } catch (error) {
    logger.error("Gemini analyzeGroupChat error:", error.message || error);
    console.error("🔴 FULL ERROR:", error);
    return fallback;
  }
};

/* ==========================================
   2. GENERATE PRODUCT RECOMMENDATIONS
========================================== */
export const generateRecommendations = async ({
  messages = [],
  votes = {},
  preferences = {},
  budget = {},
}) => {
  const startTime = Date.now();

  const fallback = {
    recommendations: [
      {
        productName: "boAt Rockerz 450",
        reason: "Popular wireless headphones with great bass",
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

    const prompt = `You are an AI shopping assistant for Indian shoppers. Based on the group chat, votes, and preferences, recommend 3-5 products available in India. Return ONLY a valid JSON array (no markdown, no explanation) where each item has: productName (string), reason (string), estimatedPrice (string with ₹), category (string from: fashion, electronics, beauty, home, sports, books, toys, grocery, health, automotive).

Group chat:
${chatText}

Votes: ${votesSummary}
Preferences: ${prefSummary}
Budget: ${budgetSummary}

Return ONLY JSON array:`;

    const raw = await callGemini(prompt);
    const parsed = JSON.parse(cleanJSON(raw));

    logger.info(`✅ generateRecommendations success`);
    return {
      recommendations: Array.isArray(parsed)
        ? parsed
        : parsed.recommendations || fallback.recommendations,
      tokensUsed: 0,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    logger.error("Gemini generateRecommendations error:", error.message || error);
    console.error("🔴 FULL ERROR:", error);
    return fallback;
  }
};

/* ==========================================
   3. GENERATE GROUP SUMMARY
========================================== */
export const generateGroupSummary = async ({
  roomName,
  messages = [],
  votes = {},
  cartItems = [],
  members = [],
}) => {
  const startTime = Date.now();

  const fallback = {
    summary: `The group "${roomName}" with ${members.length} member(s) is actively shopping together.`,
    tokensUsed: 0,
    processingTime: Date.now() - startTime,
  };

  try {
    const chatText = messages.slice(0, 30).join("\n");
    const cartSummary = cartItems
      .slice(0, 5)
      .map((i) => i.product?.name || "item")
      .join(", ");

    const prompt = `You are a shopping session summarizer. Write a single human-readable paragraph (2-3 sentences) summarizing the group shopping session. Mention members count, what they're shopping for, popular items, and budget if detectable. Keep it conversational. No markdown.

Room: "${roomName}"
Members: ${members.length}
Cart items: ${cartSummary || "none yet"}
Chat:
${chatText}
Votes: ${JSON.stringify(votes).slice(0, 400)}`;

    const summary = (await callGemini(prompt))?.trim() || fallback.summary;

    logger.info(`✅ generateGroupSummary success`);
    return { summary, tokensUsed: 0, processingTime: Date.now() - startTime };
  } catch (error) {
    logger.error("Gemini generateGroupSummary error:", error.message || error);
    console.error("🔴 FULL ERROR:", error);
    return fallback;
  }
};

/* ==========================================
   4. DETECT BUDGET
========================================== */
export const detectBudget = async (messages) => {
  const fallback = { min: 500, max: 5000, currency: "INR" };

  if (!messages || messages.length === 0) return fallback;

  try {
    const chatText = messages.slice(0, 20).join("\n");
    const prompt = `Extract the budget range from the group chat. Return ONLY valid JSON (no markdown): { "min": number, "max": number, "currency": "INR" }. If no budget mentioned, estimate from context.

Chat:
${chatText}`;

    const raw = await callGemini(prompt);
    return JSON.parse(cleanJSON(raw));
  } catch (error) {
    logger.error("Gemini detectBudget error:", error.message || error);
    return fallback;
  }
};

/* ==========================================
   5. AI CHAT REPLY (For @ai mentions)
========================================== */
export const generateChatReply = async ({ userMessage, roomContext = [] }) => {
  const startTime = Date.now();

  try {
    const context = roomContext.slice(-10).join("\n");

    const prompt = `You are a helpful AI shopping assistant in a group chat. Be friendly, concise (2-3 sentences max). No markdown, plain text only.

Recent chat:
${context}

User asks: ${userMessage}

Your reply:`;

    const reply = (await callGemini(prompt))?.trim();

    logger.info(`✅ generateChatReply success`);
    return { reply, tokensUsed: 0, processingTime: Date.now() - startTime };
  } catch (error) {
    logger.error("Gemini generateChatReply error:", error.message || error);
    return {
      reply: "Sorry, I'm having trouble right now. Please try again! 🤖",
      tokensUsed: 0,
      processingTime: Date.now() - startTime,
    };
  }
};
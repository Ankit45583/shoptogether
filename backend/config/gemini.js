import axios from "axios";

const GEMINI_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const ai = {
  async generateContent(prompt) {
    try {
      const response = await axios.post(
        `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return {
        text: response.data.candidates[0].content.parts[0].text,
      };
    } catch (error) {
      console.error("Gemini REST API error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default ai;
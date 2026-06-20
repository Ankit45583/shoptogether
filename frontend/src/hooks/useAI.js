import { useState } from "react";
import toast from "react-hot-toast";
import {
  getAIRecommendations,
  analyzeRoomMood,
  getRoomSummary,
} from "../api/ai.api";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [mood, setMood] = useState(null);
  const [summary, setSummary] = useState("");

  /* ==========================================
     Fetch AI Recommendations
  ========================================== */
  const fetchRecommendations = async (roomId) => {
    try {
      setLoading(true);
      const res = await getAIRecommendations(roomId);
      setRecommendations(res.data.recommendations || []);
      toast.success("🤖 AI recommendations ready!");
      return res.data.recommendations;
    } catch (error) {
      toast.error("AI failed to generate recommendations");
      console.error("AI Recommendations error:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     Fetch Room Mood
  ========================================== */
  const fetchMood = async (roomId) => {
    try {
      setLoading(true);
      const res = await analyzeRoomMood(roomId);
      setMood(res.data);
      return res.data;
    } catch (error) {
      toast.error("Failed to analyze mood");
      console.error("AI Mood error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     Fetch Room Summary
  ========================================== */
  const fetchSummary = async (roomId) => {
    try {
      setLoading(true);
      const res = await getRoomSummary(roomId);
      setSummary(res.data.summary || "");
      return res.data.summary;
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error("AI Summary error:", error);
      return "";
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    recommendations,
    mood,
    summary,
    fetchRecommendations,
    fetchMood,
    fetchSummary,
  };
};
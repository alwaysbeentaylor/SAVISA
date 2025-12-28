
import { GoogleGenAI } from "@google/genai";
import { FormData, AIReviewResult } from "../types";

// Initialize GoogleGenAI with a named parameter using process.env.API_KEY
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const reviewApplicationWithAI = async (data: FormData): Promise<AIReviewResult> => {
  try {
    if (!ai) {
      throw new Error("AI service is not initialized (missing API key)");
    }

    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a professional immigration assistant for the South African Department of Home Affairs. Analyze the form data for consistency (e.g., passport expiry date vs travel dates) and common errors. Return a JSON object with 'status' (valid, warning, or error), 'summary', and 'suggestions' (an array of strings).",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(`Review this South African e-Visa application for potential issues or missing information: ${JSON.stringify(data)}`);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Review failed:", error);
    return {
      status: 'warning',
      summary: 'Automated review is temporarily unavailable.',
      suggestions: ['Please double-check all dates manually before submission.']
    };
  }
};

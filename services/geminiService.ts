
import { GoogleGenAI, Type } from "@google/genai";
import { FormData, AIReviewResult } from "../types.ts";

// Initialize GoogleGenAI with a named parameter using process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const reviewApplicationWithAI = async (data: FormData): Promise<AIReviewResult> => {
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex reasoning tasks like evaluating form consistency.
      model: "gemini-3-pro-preview",
      contents: `Review this South African e-Visa application for potential issues or missing information: ${JSON.stringify(data)}`,
      config: {
        systemInstruction: "You are a professional immigration assistant for the South African Department of Home Affairs. Analyze the form data for consistency (e.g., passport expiry date vs travel dates) and common errors. Return a JSON object with 'status' (valid, warning, or error), 'summary', and 'suggestions' (an array of strings).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Final assessment status" },
            summary: { type: Type.STRING, description: "Brief summary of the review" },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable advice for the applicant"
            }
          },
          required: ["status", "summary", "suggestions"]
        }
      }
    });

    // Directly access the .text property from the GenerateContentResponse object.
    const text = response.text || "{}";
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

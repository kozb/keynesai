import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAtEC71APLKp-jgStyUCIyzeomRkDsPIAY";

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateChatResponse = async (
  message: string,
  context?: {
    materials?: string[];
    analysisResults?: Record<string, any>;
  }
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    let prompt = `You are KeynesAI, a professional finance analyst assistant. Your role is to help users with financial analysis, data interpretation, and insights.

`;

    if (context?.materials && context.materials.length > 0) {
      prompt += `The user has attached the following materials: ${context.materials.join(", ")}.\n\n`;
    }

    if (context?.analysisResults && Object.keys(context.analysisResults).length > 0) {
      prompt += `Available analysis results:\n`;
      Object.entries(context.analysisResults).forEach(([key, result]) => {
        prompt += `- ${result.action}: ${JSON.stringify(result.data, null, 2)}\n`;
      });
      prompt += `\n`;
    }

    prompt += `User question: ${message}\n\n`;
    prompt += `Please provide a helpful, professional response. If the user is asking about analysis results, reference the specific data. If they're asking about materials, provide insights based on financial analysis best practices.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate response. Please try again.");
  }
};


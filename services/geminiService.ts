import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";

// Helper to get client. Note: We create a new instance per call to ensure fresh API key.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select an API Key first.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAppIcon = async (
  prompt: string,
  size: ImageSize
): Promise<{ base64: string; mimeType: string }> => {
  const client = getClient();

  // Enhance prompt for icon generation best practices
  const enhancedPrompt = `Create a professional, high-quality app icon. 
  Style: Modern, vector-like, clean, suitable for a mobile application.
  Subject: ${prompt}. 
  Ensure the main subject is centered with some padding from the edges. 
  Avoid text if possible unless explicitly requested. Solid or subtle gradient background preferred.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1", 
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (part && part.inlineData) {
      return {
        base64: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      };
    }

    throw new Error("No image data generated.");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

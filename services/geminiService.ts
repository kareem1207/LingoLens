import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const VISION_MODEL = "gemini-3-pro-preview";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

export const analyzeImage = async (base64Data: string, mimeType: string, targetLanguage: string = "English"): Promise<AnalysisResult> => {
  try {
    const prompt = `
      You are a friendly, knowledgeable local guide for a traveler. 
      Analyze the provided image. It could be a menu, a street sign, a cultural object, or food.
      
      The user wants the results in this language: ${targetLanguage}.
      
      Provide the following in JSON format:
      1. 'translation': A literal translation of any text found into ${targetLanguage}. If no text, describe the object in ${targetLanguage}.
      2. 'vibeCheck': A 2-sentence cultural context explanation in ${targetLanguage}. Explain why this exists, the history, or the 'vibe' of the place/item.
      3. 'proTip': A specific, actionable tip for the user (e.g., how to eat it, etiquette, best time to visit) in ${targetLanguage}.
      4. 'flavorProfile': If food is detected, estimate the flavor profile (e.g., "Spicy, Umami", "Sweet, Tart") in ${targetLanguage}. If not food, leave this field empty or null.
      
      Keep the tone fun, helpful, and insightful.
    `;

    const response = await ai.models.generateContent({
      model: VISION_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: {
              type: Type.STRING,
              description: "Literal translation of text or description of object",
            },
            vibeCheck: {
              type: Type.STRING,
              description: "Cultural context and history",
            },
            proTip: {
              type: Type.STRING,
              description: "Actionable advice for the user",
            },
            flavorProfile: {
              type: Type.STRING,
              description: "Estimated flavor profile if food, otherwise null",
              nullable: true,
            },
          },
          required: ["translation", "vibeCheck", "proTip"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: {
        parts: [{ text }],
      },
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      throw new Error("No audio data generated");
    }
    return audioData;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};
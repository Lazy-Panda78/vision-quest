
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export async function analyzeAnnotatedImage(imageBase64: string): Promise<string> {
  if (!API_KEY) return "AI insights are unavailable without an API key.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    This is an image that has been processed by a YOLO object detection model. 
    You can see bounding boxes and labels for the detected objects. 
    Please identify what was detected based on the labels in the image, 
    provide a brief summary of the scene, and explain if the detection looks accurate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64.split(',')[1],
            },
          },
          { text: prompt }
        ]
      },
    });

    return response.text || "Unable to generate AI analysis.";
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    return "The AI assistant encountered an error while analyzing the detection results.";
  }
}

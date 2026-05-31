import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing. Please check your .env.local file." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { productName, category, imagesBase64 } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const hasImages = imagesBase64 && Array.isArray(imagesBase64) && imagesBase64.length > 0;

    const promptText = `
You are an expert luxury furniture copywriter for 'Sabhe Furniture'.
The user has provided a basic product name: "${productName || 'Unknown Furniture'}"
And its category is: "${category || 'General Furniture'}"

${hasImages ? `I have provided ${imagesBase64.length} different angles of the furniture. Please analyze them carefully. Focus on its construction, textures, exact colors, and the overall "soul" of the piece from all angles shown.` : ""}

Generate two things:
1. headline: A short, catchy 3-word title suitable for a luxury store catalog.
2. description: A 2-sentence elegant, high-end description. Mention specific details you see in the photos to prove you analyzed all angles.

Return the response as a JSON object with keys "headline" and "description".
`;

    const contentParts: any[] = [promptText];

    if (hasImages) {
      imagesBase64.forEach((base64: string) => {
        const matches = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches) {
          contentParts.push({
            inlineData: {
              data: matches[2],
              mimeType: matches[1]
            }
          });
        }
      });
    }

    const result = await model.generateContent(contentParts);
    const text = result.response.text();
    
    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    const jsonResult = JSON.parse(text);
    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate text using AI: ${errorMessage}` },
      { status: 500 }
    );
  }
}

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
    const { productName, category, imageBase64 } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    // Switch to gemini-1.5-flash for the standard free-tier quota (typically 1,500 RPD)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const promptText = `
You are an expert luxury furniture copywriter for 'Sabhe Furniture'.
The user has provided a basic product name: "${productName || 'Unknown Furniture'}"
And its category is: "${category || 'General Furniture'}"

${imageBase64 ? "I have also provided an image of the furniture. Please analyze the image carefully. Focus on its type, material, colors, style, and unique features." : ""}

Generate two things:
1. headline: A short, catchy 3-word title (e.g., 'Modern Kitchen Elegance', 'Velvet Royal Sofa') suitable for a store catalog.
2. description: A 2-sentence elegant and luxurious description for this furniture catalog item. If an image is provided, ensure the description accurately describes the materials, colors, and design of the furniture shown.

Return the response as a JSON object with keys "headline" and "description".
`;

    const contentParts: any[] = [promptText];

    if (imageBase64) {
      const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches) {
        contentParts.push({
          inlineData: {
            data: matches[2],
            mimeType: matches[1]
          }
        });
      }
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

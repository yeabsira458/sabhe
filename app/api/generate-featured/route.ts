import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure Cloudinary — note: env vars have some unusual naming in this project
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_Cloud_name,
  api_key: process.env.NEXT_PUBLIC__API_KEY,
  api_secret: process.env.NEXT_PUBLIC__API_SECRET,
});

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey as string);

export async function POST(req: Request) {
  try {
    const { imageUrl, title, category } = await req.json();
    console.log("Generating AI graphic for:", title);

    // 1. Use Gemini to decide a DRAMATICALLY different style and Headline
    // Switch to gemini-2.5-flash for the standard free-tier quota
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const promptText = `
      You are a world-class creative director.
      Product: "${title}" (${category}).
      1. Pick ONE unique, distinct interior style (e.g., Cyberpunk, Victorian, Tropical, Industrial, Brutalist, Zen, Retro, Mediterranean, Dark Academia).
      2. Write a short, punchy 3-word headline for a poster (e.g., "FUURE OF COMFORT", "ROYAL ELEGANCE", "URBAN RAWNESS").
      3. Pick ONE hex color code that represents this style (e.g., #ff00ff for cyberpunk, #d4af37 for victorian, #10b981 for tropical).

      Return a JSON object with keys: "style", "headline", "color".
    `;
    const result = await model.generateContent(promptText);
    const aiData = JSON.parse(result.response.text());
    const bgPrompt = aiData.style;
    const headline = aiData.headline;
    const accentColor = aiData.color;

    console.log("AI Data:", aiData);

    // 2. Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const uploadRes = await cloudinary.uploader.upload(imageUrl, {
      folder: "sabhe_featured",
      overwrite: true,
      resource_type: "image",
    });

    // 3. Construct the Cloudinary Generative AI URL
    const cleanPrompt = bgPrompt.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const cloudName = process.env.NEXT_PUBLIC_Cloud_name || "dfdxbbhqr";
    const aiGraphicUrl = `https://res.cloudinary.com/${cloudName}/image/upload/e_gen_background_replace:prompt_${cleanPrompt}/v${uploadRes.version}/${uploadRes.public_id}`;

    return NextResponse.json({
      success: true,
      aiGraphicUrl,
      bgPrompt,
      headline,
      accentColor
    });

  } catch (error: any) {
    console.error("AI Generation Error Detail:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI graphic" },
      { status: 500 }
    );
  }
}

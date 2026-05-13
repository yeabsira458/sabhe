import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey as string);

export async function POST(req: Request) {
  let step = "initialization";
  try {
    const body = await req.json();
    const { imageUrl, title, category } = body;
    console.log("Generating AI graphic for:", title);

    if (!imageUrl) throw new Error("Missing imageUrl");

    // 1. Use Gemini
    step = "gemini-generation";
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const promptText = `
      You are a world-class creative director for "SABHE FURNITURE".
      Product: "${title}" (${category}).
      
      Task:
      1. Pick ONE unique, distinct interior style from: Cyberpunk Neon, Victorian Royal, Tropical Oasis, Industrial Loft, Zen Minimalist, Retro 70s, Mediterranean Coastal, Dark Academia, Scandinavian Hygge, Desert Modern, Art Deco, Brutalist Concrete, Mid-Century Modern.
      2. Write a short, punchy 3-word headline for a premium lifestyle poster.
      3. Pick ONE vibrant hex color code for UI accents.
      4. Create a 10-word background description for AI generation.

      Return JSON: {"style": "...", "headline": "...", "color": "...", "bgPrompt": "..."}
    `;

    const result = await model.generateContent(promptText);
    const responseText = result.response.text();
    
    step = "json-parsing";
    let aiData;
    try {
      aiData = JSON.parse(responseText);
    } catch (e) {
      aiData = {
        style: "Modern",
        headline: "PURE COMFORT",
        color: "#eab308",
        bgPrompt: "luxurious modern living room"
      };
    }

    // 2. Upload to Cloudinary
    step = "cloudinary-upload";
    console.log("Uploading to Cloudinary:", imageUrl);
    const uploadRes = await cloudinary.uploader.upload(imageUrl, {
      folder: "sabhe_featured",
      overwrite: true,
      resource_type: "image",
    });

    // 3. Construct URL
    step = "url-construction";
    const cleanPrompt = (aiData.bgPrompt || "interior").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) throw new Error("CLOUDINARY_CLOUD_NAME is not defined");
    const aiGraphicUrl = `https://res.cloudinary.com/${cloudName}/image/upload/e_gen_background_replace:prompt_${cleanPrompt}/v${uploadRes.version}/${uploadRes.public_id}`;

    return NextResponse.json({
      success: true,
      aiGraphicUrl,
      bgPrompt: aiData.bgPrompt,
      headline: aiData.headline,
      accentColor: aiData.color
    });

  } catch (error: any) {
    console.error(`Error at step [${step}]:`, error);
    return NextResponse.json(
      { 
        error: error.message || "Unknown error", 
        step,
        success: false 
      },
      { status: 500 }
    );
  }
}

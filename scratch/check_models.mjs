import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // There isn't a direct listModels in the SDK usually, 
    // it's often through the client or just trying a model.
    // Actually, in @google/generative-ai it might be different.
    
    // Let's just try to generate something with gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("test");
    console.log("gemini-2.5-flash works!");
  } catch (err) {
    console.error("gemini-2.5-flash failed:", err.message);
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("gemini-1.5-flash works!");
    } catch (err2) {
        console.error("gemini-1.5-flash failed:", err2.message);
    }
  }
}

listModels();

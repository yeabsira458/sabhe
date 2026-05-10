import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCkYNcUJV3LeY9Hff_jlxaDaqxL-zGxq34";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

async function main() {
  try {
    console.log("Testing gemini-2.5-flash-lite...");
    const result = await model.generateContent("Say hello in one word.");
    console.log("✅ Success:", result.response.text());
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
}

main();

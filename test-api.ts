import { generateAnswer } from "./src/lib/ask.server";

async function testAPI() {
  try {
    console.log("Testing API...");
    console.log("UMMAH_API_KEY:", process.env.UMMAH_API_KEY?.substring(0, 10) + "...");
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.substring(0, 10) + "...");
    
    const answer = await generateAnswer(
      "What is the best time to pray Fajr?",
      "Prayer",
      "English"
    );
    
    console.log("✅ API Response received:");
    console.log(JSON.stringify(answer, null, 2));
  } catch (error) {
    console.error("❌ API Error:", error);
  }
}

testAPI();

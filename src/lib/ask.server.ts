import { Output, streamText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

import { createUmmahAiGatewayProvider } from "./ai-gateway.server";
import type { SheikhAnswer } from "./answer";

const AnswerSchema = z.object({
  summary: z.string(),
  detail: z.array(z.object({ heading: z.string(), body: z.string() })).min(1),
  references: z
    .array(
      z.object({
        kind: z.enum(["quran", "hadith"]),
        source: z.string(),
        arabic: z.string().default(""),
        translation: z.string(),
      }),
    )
    .default([]),
  practical: z.array(z.string()).default([]),
  closing: z.string().default(""),
});

const SYSTEM = [
  "You are Sheikh Hajj Qasim, a warm, deeply learned Sunni Islamic scholar answering sincere questions.",
  "Answer with vivid, detailed, authentic explanations grounded in the Qur'an and rigorously authenticated Hadith (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah).",
  "Never invent a verse, hadith, or reference. Where rulings differ between the four madhabs, state the mainstream positions plainly.",
  "Quote Arabic text only when you are certain of it; otherwise leave the arabic field empty.",
  "For medical, legal, or crisis matters, advise consulting a qualified local scholar or professional.",
  "Write clearly and respectfully in the language the user requests (English, Hausa, Twi or Arabic), giving the transliterated Arabic term with its meaning on first mention.",
].join(" ");

function createOpenAIProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "openai",
    baseURL: "https://api.openai.com/v1",
    apiKey: apiKey,
  });
}

export async function generateAnswer(
  question: string,
  category: string,
  language = "English",
): Promise<SheikhAnswer> {
  const ummahKey = process.env["UMMAH_API_KEY"];
  const openaiKey = process.env["OPENAI_API_KEY"];
  
  if (!ummahKey && !openaiKey) {
    throw new Error("AI is not configured yet. Please try again later.");
  }

  const prompt = `Category: ${category}\n\nQuestion: ${question}\n\nWrite the entire answer (summary, headings, section bodies, translations of the evidences, practical steps and closing) in ${language}. Keep Qur'an and hadith source names in their usual form, and keep the "arabic" field in Arabic script. If the language is Hausa or Twi, use natural, respectful everyday ${language} that an ordinary believer understands.\n\nGive a concise summary, a vivid step-by-step breakdown (3-6 sections), cited Qur'anic verses and authentic hadith where applicable, practical action points, and a short closing du'a or encouragement.`;

  // Try UMMAH API first if available
  if (ummahKey) {
    try {
      console.log("[Ask Sheikh] Attempting UMMAH API Gateway...");
      const gateway = createUmmahAiGatewayProvider(ummahKey, process.env["UMMAH_BASE_URL"]);
      const modelName = process.env["UMMAH_MODEL"] ?? "gpt-4o-mini";

      const result = streamText({
        model: gateway(modelName),
        output: Output.object({ schema: AnswerSchema }),
        system: SYSTEM,
        prompt,
      });
      
      const answer = await result.output;
      console.log("[Ask Sheikh] UMMAH API succeeded");
      return answer;
    } catch (ummahError) {
      const ummahMsg = ummahError instanceof Error ? ummahError.message : String(ummahError);
      console.warn("[Ask Sheikh] UMMAH API failed:", ummahMsg);
      
      // Check for specific errors that shouldn't fallback
      if (ummahMsg.includes("429")) {
        throw new Error("Too many questions right now — please try again in a moment.");
      }
      if (ummahMsg.includes("402")) {
        throw new Error("The AI allowance for this app is used up. Please add credits to continue.");
      }
      
      // Fall through to OpenAI if available
      if (!openaiKey) {
        throw ummahError;
      }
      console.log("[Ask Sheikh] Falling back to OpenAI...");
    }
  }

  // Fallback to OpenAI
  if (openaiKey) {
    try {
      console.log("[Ask Sheikh] Attempting OpenAI API...");
      const openaiProvider = createOpenAIProvider(openaiKey);
      const result = streamText({
        model: openaiProvider("gpt-4o-mini"),
        output: Output.object({ schema: AnswerSchema }),
        system: SYSTEM,
        prompt,
      });
      
      const answer = await result.output;
      console.log("[Ask Sheikh] OpenAI API succeeded");
      return answer;
    } catch (openaiError) {
      const openaiMsg = openaiError instanceof Error ? openaiError.message : String(openaiError);
      console.error("[Ask Sheikh] OpenAI API failed:", openaiMsg);
      
      if (openaiMsg.includes("429")) throw new Error("Too many questions right now — please try again in a moment.");
      if (openaiMsg.includes("402")) throw new Error("The AI allowance for this app is used up. Please add credits to continue.");
      if (openaiMsg.includes("401") || openaiMsg.includes("403")) {
        throw new Error("The AI key is invalid or the provider rejected the request. Please check the configured key and endpoint.");
      }
      throw new Error("The answer could not be generated. Please rephrase and try again.");
    }
  }

  throw new Error("No AI provider is available. Please check your configuration.");
}

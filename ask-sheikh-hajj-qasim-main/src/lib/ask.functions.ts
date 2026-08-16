import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const askSheikh = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const schema = z.object({
      question: z.string().trim().min(8).max(1200),
      category: z.enum(["Fasting", "Prayer", "Hadith", "Quran", "General Islamic Guidance"]),
      language: z.enum(["English", "Hausa", "Twi", "Arabic"]).default("English"),
    });
    return schema.parse(input);
  })
  .handler(async ({ data }) => {
    const { generateAnswer } = await import("./ask.server");
    return await generateAnswer(data.question, data.category, data.language);
  });

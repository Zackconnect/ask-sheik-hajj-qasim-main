import { createServerFn } from "@tanstack/react-start";

export const checkApiConfig = createServerFn({ method: "GET" }).handler(async () => {
  return {
    ummahKey: process.env["UMMAH_API_KEY"] ? "✅ Set (length: " + process.env["UMMAH_API_KEY"].length + ")" : "❌ Missing",
    ummahBaseUrl: process.env["UMMAH_BASE_URL"] || "❌ Missing",
    ummahModel: process.env["UMMAH_MODEL"] || "❌ Missing",
    openaiKey: process.env["OPENAI_API_KEY"] ? "✅ Set (length: " + process.env["OPENAI_API_KEY"].length + ")" : "❌ Missing",
  };
});

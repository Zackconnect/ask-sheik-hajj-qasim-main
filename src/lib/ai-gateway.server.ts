import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createUmmahAiGatewayProvider(apiKey: string, baseURL?: string) {
  return createOpenAICompatible({
    name: "ummah-ai-gateway",
    baseURL: baseURL ?? process.env["UMMAH_BASE_URL"] ?? "https://api.ummahapi.com/v1",
    headers: {
      "X-API-Key": apiKey,
    },
    supportsStructuredOutputs: true,
  });
}

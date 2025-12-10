import { ModelProvider } from "../../types";
import { LLMClient } from "./types";
import { GoogleClient } from "./google";
import { GroqClient } from "./groq";
import { OpenRouterClient } from "./openrouter";

export const getLLMClient = (provider: ModelProvider): LLMClient => {
    let apiKey = "";
    switch (provider) {
        case ModelProvider.GOOGLE:
            apiKey = process.env.GEMINI_API_KEY || "";
            if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
            return new GoogleClient(apiKey);
        case ModelProvider.GROQ:
            apiKey = process.env.GROQ_API_KEY || "";
            if (!apiKey) throw new Error("Missing GROQ_API_KEY");
            return new GroqClient(apiKey);
        case ModelProvider.OPENROUTER:
            apiKey = process.env.OPENROUTER_API_KEY || "";
            if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY");
            return new OpenRouterClient(apiKey);
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
};

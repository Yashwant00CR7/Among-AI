import { GoogleGenAI, Content } from "@google/genai";
import { LLMClient, GenerationConfig } from "./types";

export class GoogleClient implements LLMClient {
    private client: GoogleGenAI;

    constructor(apiKey: string) {
        this.client = new GoogleGenAI({ apiKey });
    }

    async generateContent(
        model: string,
        contents: Content[],
        config: GenerationConfig
    ): Promise<string> {
        try {
            const response = await this.client.models.generateContent({
                model: model,
                contents: contents,
                config: {
                    systemInstruction: config.systemInstruction,
                    temperature: config.temperature,
                    maxOutputTokens: config.maxOutputTokens,
                    responseMimeType: config.responseMimeType,
                }
            });
            return response.text || "";
        } catch (error) {
            console.error("Google API Error:", error);
            throw error;
        }
    }
}

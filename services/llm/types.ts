import { Content } from "@google/genai";

export interface GenerationConfig {
    systemInstruction: string;
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
}

export interface LLMClient {
    generateContent(
        model: string,
        contents: Content[],
        config: GenerationConfig
    ): Promise<string>;
}

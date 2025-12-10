import OpenAI from "openai";
import { Content } from "@google/genai";
import { LLMClient, GenerationConfig } from "./types";

export class OpenRouterClient implements LLMClient {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            defaultHeaders: {
                "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
                "X-Title": "Turing Traitor Game"
            },
            dangerouslyAllowBrowser: true
        });
    }

    private convertContents(contents: Content[]): any[] {
        return contents.map(c => {
            const role = c.role === 'model' ? 'assistant' : 'user';
            const content = c.parts?.map(p => p.text).join('\n') || '';
            return { role, content };
        });
    }

    async generateContent(
        model: string,
        contents: Content[],
        config: GenerationConfig
    ): Promise<string> {
        try {
            const messages = [
                { role: "system", content: config.systemInstruction },
                ...this.convertContents(contents)
            ];

            const completion = await this.client.chat.completions.create({
                messages: messages as any,
                model: model,
                temperature: config.temperature,
                max_tokens: config.maxOutputTokens,
                // OpenRouter doesn't always support response_format for all models, so we skip it or handle carefully
                // For now, we'll rely on the prompt for JSON
            });

            return completion.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("OpenRouter API Error:", error);
            throw error;
        }
    }
}

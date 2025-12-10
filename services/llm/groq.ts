import Groq from "groq-sdk";
import { Content } from "@google/genai";
import { LLMClient, GenerationConfig } from "./types";

export class GroqClient implements LLMClient {
    private client: Groq;

    constructor(apiKey: string) {
        this.client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    }

    private convertContents(contents: Content[]): any[] {
        return contents.map(c => {
            const role = c.role === 'model' ? 'assistant' : 'user';
            // Handle parts array from Google format
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
                response_format: config.responseMimeType === 'application/json' ? { type: 'json_object' } : undefined
            });

            return completion.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("Groq API Error:", error);
            throw error;
        }
    }
}

import { AIClient } from "../ai-client";
import { getOpenAIApiKey } from "../../storage";
import OpenAI from "openai";

export class OpenAIClient implements AIClient {
    private openai: OpenAI;

    private constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    static async create(): Promise<OpenAIClient> {
        const apiKey = await getOpenAIApiKey();
        if(!apiKey) {
            throw new Error("OpenAI API key not found. Please set it in the extension settings.");
        }

        return new OpenAIClient(apiKey);
    }

    async generate_comment(post_content: string, reply_to: string | null): Promise<string> {
        const response = await this.openai.responses.create({
            model: "gpt-5-nano-2025-08-07",
            input: "Write a one-sentence bedtime story about a unicorn."
        });

        return response.output_text;
    }

}


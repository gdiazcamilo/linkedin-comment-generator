import { AIClient } from "../ai-client";
import { getOpenAIApiKey } from "../../storage";
import OpenAI from "openai";
import { ConversationTone } from "../../enums";
import { build as build_prompt } from "../openai/prompts/reply-prompt"

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

    async generate_comment(post_content: string, reply_to: string | null, tone: ConversationTone| null): Promise<string> {
        const responseParams = build_prompt(post_content, reply_to, tone);
        return "Lorem ipsum..... do not waste prompts while testing";
        console.log(responseParams);

        const response = await this.openai.responses.create({
            model: "gpt-5-nano-2025-08-07",
            ...responseParams
        });

        console.log(response);

        return response.output_text;
    }

}


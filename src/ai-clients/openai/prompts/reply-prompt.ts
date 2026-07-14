import { ConversationTone } from "../../../enums";
import { specify_tone, SYSTEM_INSTRUCTIONS } from "../../prompts/prompts";

export interface ReplyPrompt {
    instructions: string;
    input: string;
}

export function build(post: string, comment: string | null, tone: ConversationTone | null): ReplyPrompt {

    let prompt = `Write a comment in response to the following post`;
    if(comment) {
        prompt += ` and post's reply`
    }
    prompt += ' below'

    prompt += `
    # Post
    \`\`\`${post}\`\`\``

    if(comment) {
        prompt += `
        # Post's reply
        \`\`\`${comment}\`\`\``
    }
    console.log("build tone ", tone);
    const tone_prompt = specify_tone(tone || ConversationTone.Professional);
    console.log("tone prompt ", tone_prompt);

    prompt += `
    ${tone_prompt}`

    return {
        instructions: SYSTEM_INSTRUCTIONS,
        input: prompt
    };

}


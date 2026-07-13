import { ConversationTone } from "../../enums";
import { specify_tone } from "../prompts/prompts";

export function build(post: string, comment: string | null, tone: ConversationTone | null): string {

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

    const tone_prompt = specify_tone(tone || ConversationTone.Professional);

    prompt += `
    ${tone_prompt}`

    return prompt;
}


import { ConversationTone } from "../../../enums";

export const instructions =
  "You will generate comments in response to a LinkedIn post, a reply to the post, or both. " +
  "You will receive the intention and/or tone, as well as the post content text and the reply " +
  "(if any) for which you will generate the comment. The comment must be relevant to the discussion " +
  "in the provided post or reply context. Reason internally as needed, but output only the final comment. " +
  "Only reply with the exact comment and do not add anything else. The comment must be plain text only, " +
  "with no markdown, labels, or surrounding explanation. Quotation marks are allowed only when citing " +
  "examples of quotes from someone else. Keep comments short, brief; up to 4 sentences max. " +
  "Avoid sounding generic or impersonal. Also avoid common comment patterns or clichés most of the time, " +
  "such as starting with \"spot on,\" \"solid reflection,\" or similar stock phrases. If the user explicitly " +
  "requests a critical, sarcastic, rude, bold, or otherwise negative, unprofessional or inappropriate tone, " +
  "use that tone.";



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

    const tone_prompt = specify_tone(tone || ConversationTone.Professional);

    prompt += `
    ${tone_prompt}`

    return {
        instructions: instructions,
        input: prompt
    };

    //TODO: experiment adding prompt_cache_key (tone)
}

function specify_tone(tone: ConversationTone): string {
    switch(tone) {
        case ConversationTone.Honest:
            return "Use an honest tone: direct, sincere, and grounded. Be candid without being harsh.";
        case ConversationTone.Professional:
            return "Use a professional tone: clear, respectful, and thoughtful."
        case ConversationTone.Empathetic:
            return "Use an empathetic tone: warm, understanding, respectful, and human.";
        case ConversationTone.Humorous:
            return "Use a humorous tone: light, clever, and natural. Add a small touch of wit without becoming sarcastic.";
        case ConversationTone.Sarcastic:
            return "Use a sarcastic tone: dry, sharp, and witty. Keep it controlled and avoid personal attacks.";
        case ConversationTone.Confident:
            return "Use a confident tone: assured, clear, and decisive without sounding arrogant.";
        case ConversationTone.Curious:
            return "Use a curious tone: open-minded, thoughtful, and question-driven.";
        case ConversationTone.Polite:
            return "Use a polite tone: courteous, considerate, and respectful.";
        case ConversationTone.Informal:
            return "Use an informal tone: relaxed, conversational, and natural.";
        case ConversationTone.Skeptical:
            return "Use a skeptical tone: questioning, analytical, and measured without dismissing the idea outright.";
        case ConversationTone.Storytelling:
            return "Use a storytelling tone: personal, vivid, and narrative-driven while staying concise.";
        case ConversationTone.Vulnerable:
            return "Use a vulnerable tone: open, humble, and honest without oversharing.";
        case ConversationTone.Critical:
            return "Use a critical tone: clear, analytical, and direct. Challenge the idea while staying focused on the substance.";
        case ConversationTone.Bold:
            return "Use a bold tone: strong, memorable, and decisive without becoming reckless or rude.";
        default:
            return "Use a professional tone: clear, respectful, and thoughtful."
    }

}

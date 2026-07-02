import { ConversationTone } from "./enums";

function pick_tone(): ConversationTone {
    const enumLength = Object.keys(ConversationTone).filter(k => isNaN(Number(k))).length;
    const tone = Math.ceil(Math.random() * enumLength) as ConversationTone;
    return tone;
}

export async function generateComment(postContentText: string, referencedCommentText: string | null): Promise<string> {
    // TODO: the input will be send ultimately to openai api. validate the it is not malicious.
    const generatedComment = await chrome.runtime.sendMessage({
        type: "SUGGEST_COMMENT",
        postContentText,
        referencedCommentText,
        tone: pick_tone()
    });
    return generatedComment;
}


import { ChromeBuiltInClient } from "./ai-clients/chrome-built-in/chrome-built-in-client";
import { ConversationTone } from "./enums";

export async function generateComment(postContentText: string, referencedCommentText: string | null, tone: ConversationTone): Promise<string> {
    // TODO: the input will be send ultimately to openai api or another model. validate the it is not malicious.
    const generatedComment = await chrome.runtime.sendMessage({
        type: "SUGGEST_COMMENT",
        postContentText,
        referencedCommentText,
        tone
    });
    return generatedComment;
}

export async function generateCommentStream(postContentText: string, referencedCommentText: string | null, tone: ConversationTone): Promise<ReadableStream<string>> {
    const aiClient = await ChromeBuiltInClient.create();
    return aiClient.generate_comment_stream(postContentText, referencedCommentText, tone);
}
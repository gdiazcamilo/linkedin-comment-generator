

export async function generateComment(postContentText: string, referencedCommentText: string | null): Promise<string> {
    // TODO: the input will be send ultimately to openai api. validate the it is not malicious.
    const generatedComment = await chrome.runtime.sendMessage({
        type: "SUGGEST_COMMENT",
        postContentText,
        referencedCommentText
    });
    return generatedComment;
}


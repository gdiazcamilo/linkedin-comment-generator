import { AIClient } from "./ai-clients/ai-client";
import { OpenAIClient } from "./ai-clients/openai/openai-client";

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage();
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});


async function generateComment(_postContent: string, _referencedCommentText: string | null): Promise<string> {
  const aiClient = await getAIClient();
  return await aiClient.generate_comment(_postContent, _referencedCommentText);
}


async function getAIClient(): Promise<AIClient> {
  // In the future, we can add logic here to return different AI clients based on user settings (e.g. OpenAI, Claude, Gemini, etc.).
  return await OpenAIClient.create();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type !== "SUGGEST_COMMENT") return;

  //TODO: handle error when generating message.
  generateComment(message.postContentText, message.referencedCommentText).then(generatedComment => {
    sendResponse(generatedComment)
  });

  return true;
  
});
import { AIClient } from "./ai-clients/ai-client";
import { OpenAIClient } from "./ai-clients/openai/openai-client";
import { ChromeBuiltInClient, createLanguageModel } from "./ai-clients/chrome-built-in/chrome-built-in-client";
import { AIProvider, ConversationTone } from "./enums";
import { getAIProvider } from "./storage";

let DOWNLOAD_REQUESTED = false;

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage();
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});


async function generateComment(_postContent: string, _referencedCommentText: string | null, tone: ConversationTone | null): Promise<string> {
  const aiClient = await getAIClient();
  console.debug("Using model", aiClient);
  return await aiClient.generate_comment(_postContent, _referencedCommentText, tone);
}

async function generateCommentStream(_postContent: string, _referencedCommentText: string | null, tone: ConversationTone | null): Promise<ReadableStream<string>> {
  const aiClient = await getAIClient();
  console.debug("Using model", aiClient);
  return aiClient.generate_comment_stream(_postContent, _referencedCommentText, tone);
}


async function getAIClient(): Promise<AIClient> {
  return await getAIProvider() === AIProvider.ChromeBuiltIn
    ? ChromeBuiltInClient.create()
    : OpenAIClient.create();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type !== "SUGGEST_COMMENT_STREAM") return;
  
  const uid = message.uid;
  generateCommentStream(message.postContentText, message.referencedCommentText, message.tone).then(async (stream) => {
    for await(const chunk of stream) {
      console.log(chunk);
      chrome.runtime.sendMessage({
        type: "SUGGEST_COMMENT_CHUNK_RECEIVED",
        chunk,
        uid,
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type !== "SUGGEST_COMMENT") return;

  //TODO: handle error when generating message.
  generateComment(message.postContentText, message.referencedCommentText, message.tone).then(generatedComment => {
    sendResponse(generatedComment)
  });

  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type !== "START_DOWNLOAD") return;
  if(DOWNLOAD_REQUESTED) return;

  DOWNLOAD_REQUESTED = true;

  const watchDownloadStart = setInterval(() => {
    chrome.runtime.sendMessage({
        type: "DOWNLOAD_REQUESTED",
    });
  }, 1000);

  
  // trigger model download
  createLanguageModel((e: ProgressEvent<EventTarget>) => {
    clearInterval(watchDownloadStart);
    chrome.runtime.sendMessage({
      type: "DOWNLOAD_PROGRESSED",
      loaded: e.loaded
    });
  }).catch((e) => { 
    console.error(e);
    DOWNLOAD_REQUESTED = false;
    clearInterval(watchDownloadStart);
   });

});
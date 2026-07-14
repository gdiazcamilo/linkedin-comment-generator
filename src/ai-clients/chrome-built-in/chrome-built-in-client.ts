import { getAcceptedTwoLetterLanguages } from '../../accepted-languages';
import { ConversationTone } from '../../enums';
import { AIClient } from '../ai-client';

import { SYSTEM_INSTRUCTIONS } from '../prompts/prompts';
import { build } from './reply-prompts';

export type OnLanguageModelDownload = ((e: ProgressEvent<EventTarget>) => void)

const ACCEPTED_LANGS = new Set(["en", "es", "de", "fr", "ja"]);

export class ChromeBuiltInClient implements AIClient {

  private constructor(
    private readonly model: LanguageModel,
    private readonly controller: AbortController,
  ) {}

  static async create(onDownloadProgress: OnLanguageModelDownload | null = null): Promise<ChromeBuiltInClient> {
    if(await getModelAvailability() !== 'available') {
      throw new Error('Chrome Built-in AI is not available at the moment. Go to the extension\'s options for more details');
    }
    
    const controller = new AbortController();
    const model = await createLanguageModel(onDownloadProgress, controller.signal);
    return new ChromeBuiltInClient(model, controller);
  }

  async generate_comment(postContent: string, replyTo: string | null, tone: ConversationTone | null): Promise<string> {
    const prompt = build(postContent, replyTo, tone);
    const response = await this.model.prompt(prompt);
    await this.model.destroy();
    // this.controller.abort();
    return response;
  }

  generate_comment_stream(postContent: string, replyTo: string | null, tone: ConversationTone | null): ReadableStream<string> {
    const prompt = build(postContent, replyTo, tone);
    const stream = this.model.promptStreaming(prompt);
    // await this.model.destroy();
    return stream;
  }
}


export async function getModelLanguageOptions(onDownloadProgress: OnLanguageModelDownload | null = null, 
                                              signal: AbortSignal | undefined = undefined): Promise<LanguageModelCreateOptions> {
  const languages = await getAcceptedTwoLetterLanguages();
  const langOptions = new Set([...languages, 'en'].filter(l => ACCEPTED_LANGS.has(l)));
  const options : LanguageModelCreateOptions = {
    expectedInputs: [ {type: 'text', languages: [...langOptions]} ],
    expectedOutputs: [ {type: 'text', languages: [...langOptions]} ],
    signal: signal,
    monitor: (m) => {
      m.addEventListener('downloadprogress', (e) => {
        console.debug(e);
        if (typeof(onDownloadProgress) === 'function') {
          onDownloadProgress(e);
        }
      });
    },
    initialPrompts: [
      {
        role: 'system',
        content: SYSTEM_INSTRUCTIONS
      }
    ]
  }
  
  return options;
}

export async function getModelAvailability() : Promise<string> {
if (typeof LanguageModel === 'undefined') {
    throw new Error('Chrome Built-in AI is not available in this browser.');
  }

  const modelOptions = await getModelLanguageOptions();
  const availability = await LanguageModel.availability(modelOptions);
  return availability;
}

export async function createLanguageModel(onDownloadProgress: OnLanguageModelDownload | null = null, 
                                          signal: AbortSignal | undefined = undefined) : Promise<LanguageModel> {
  const availability = await getModelAvailability();
  if (availability === 'unavailable') {
    throw new Error('Chrome Built-in AI is not available at the moment. Go to the extension\'s options for more details.');
  }

  const options = getModelLanguageOptions(onDownloadProgress, signal);

  return await LanguageModel.create(await options);
}
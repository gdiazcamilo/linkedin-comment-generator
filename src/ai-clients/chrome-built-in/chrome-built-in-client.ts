import { getAcceptedTwoLetterLanguages } from '../../accepted-languages';
import { ConversationTone } from '../../enums';
import { AIClient } from '../ai-client';
import { build } from '../openai/prompts/reply-prompt';

export type OnLanguageModelDownload = ((e: ProgressEvent<EventTarget>) => void)

export class ChromeBuiltInClient implements AIClient {
  private constructor(
    private readonly model: LanguageModel,
  ) {}

  static async create(onDownloadProgress: OnLanguageModelDownload | null = null): Promise<ChromeBuiltInClient> {
    if(await getModelAvailability() !== 'available') {
      throw new Error('Chrome Built-in AI is not available at the moment. Go to the extension\'s options for more details');
    }
    const model = await createLanguageModel(onDownloadProgress);
    return new ChromeBuiltInClient(model);
  }

  async generate_comment(postContent: string, replyTo: string | null, tone: ConversationTone | null): Promise<string> {
    const prompt = build(postContent, replyTo, tone);
    return this.model.prompt(`${prompt.instructions}\n\n${prompt.input}`);
  }
}


export async function getModelLanguageOptions(onDownloadProgress: OnLanguageModelDownload | null = null): Promise<LanguageModelCreateOptions> {
  const languages = await getAcceptedTwoLetterLanguages();
  const langOptions = new Set([...languages, 'en'])
  const options : LanguageModelCreateOptions = {
    expectedInputs: [ {type: 'text', languages: [...langOptions]} ],
    expectedOutputs: [ {type: 'text', languages: [...langOptions]} ],
    monitor: (m) => {
      m.addEventListener('downloadprogress', (e) => {
        console.debug(e);
        if (typeof(onDownloadProgress) === 'function') {
          onDownloadProgress(e);
        }
      });
    },
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

export async function createLanguageModel(onDownloadProgress: OnLanguageModelDownload | null = null) : Promise<LanguageModel> {
  const availability = await getModelAvailability();
  if (availability === 'unavailable') {
    throw new Error('Chrome Built-in AI is not available at the moment. Go to the extension\'s options for more details.');
  }

  const options = getModelLanguageOptions(onDownloadProgress);

  return await LanguageModel.create(await options);
}
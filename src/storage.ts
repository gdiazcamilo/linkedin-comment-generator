import { RuntimeLastError } from "../src/errors"
import { AIProvider } from './enums';

const OPEN_AI_API_KEY_NAME = 'openaiApiKey';
const AI_PROVIDER_NAME = 'aiProvider';

function saveSetting(key: string, value: any, callback?: (isSuccess: boolean, error: RuntimeLastError | null) => void): void {
    chrome.storage.local.set({ [key]: value }, () => {
        const success = !chrome.runtime.lastError;
        const error = success ? null : new RuntimeLastError(chrome.runtime.lastError);
        if (callback) {
            callback(success, error);
        }
    });
}

export function saveOpenAIApiKey(apiKey: string, callback?: (success: boolean, error: RuntimeLastError | null) => void): void {
    saveSetting(OPEN_AI_API_KEY_NAME, apiKey, callback);
}

export async function getOpenAIApiKey(): Promise<string | null> {
    const result = await chrome.storage.local.get(OPEN_AI_API_KEY_NAME);
    return result ? result.openaiApiKey : null;
}

export function removeOpenAIApiKey(callback?: (success: boolean, error: RuntimeLastError | null) => void): void {
    chrome.storage.local.remove(OPEN_AI_API_KEY_NAME, () => {
        const success = !chrome.runtime.lastError;
        const error = success ? null : new RuntimeLastError(chrome.runtime.lastError);
        if (callback) {
            callback(success, error);
        }
    });
}

export function saveAIProvider(provider: AIProvider, callback?: (success: boolean, error: RuntimeLastError | null) => void): void {
    saveSetting(AI_PROVIDER_NAME, provider, callback);
}

export async function getAIProvider(): Promise<AIProvider> {
    const result = await chrome.storage.local.get(AI_PROVIDER_NAME);
    return result?.aiProvider === AIProvider.ChromeBuiltIn ? AIProvider.ChromeBuiltIn : AIProvider.OpenAI;
}

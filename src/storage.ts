import { RuntimeLastError } from "../src/errors"

const OPEN_AI_API_KEY_NAME = 'openaiApiKey';

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
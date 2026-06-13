import { saveOpenAIApiKey } from '../../src/storage';

const form = document.getElementById('settings-form') as HTMLFormElement | null;
const saveButton = document.getElementById('save-button');

saveButton?.addEventListener('click', () => {
  if (!form) {
    return;
  }

  const apiKey = form.querySelector<HTMLInputElement>('#openai-api-key')?.value;
  if (!apiKey) {
    return;
  }

  saveOpenAIApiKey(apiKey, (isSuccess) => {
    if (isSuccess) {
      alert('API key saved successfully!');
    } else {
      alert('Failed to save API key. Please try again.');
    }
  });
});
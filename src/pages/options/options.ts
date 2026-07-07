import { getOpenAIApiKey, removeOpenAIApiKey, saveOpenAIApiKey } from '../../storage';

const form = document.getElementById('settings-form') as HTMLFormElement | null;
const saveButton = document.getElementById('save-button');
const removeButton = document.getElementById('remove-key-button') as HTMLButtonElement | null;
const keyStatus = document.getElementById('key-status');
const keyIndicator = document.getElementById('key-indicator');
const apiKeyInput = document.getElementById('openai-api-key') as HTMLInputElement | null;

function formatKeyIndicator(apiKey: string): string {
  const trimmedKey = apiKey.trim();

  if (!trimmedKey) {
    return 'No key saved';
  }

  if (trimmedKey.length === 1) {
    return `${trimmedKey[0]}...${trimmedKey[0]}`;
  }

  return `${trimmedKey[0]}...${trimmedKey[trimmedKey.length - 1]}`;
}

async function renderCurrentKey(): Promise<void> {
  const apiKey = await getOpenAIApiKey();
  const hasApiKey = Boolean(apiKey);

  keyStatus?.classList.toggle('has-key', hasApiKey);

  if (keyIndicator) {
    keyIndicator.textContent = apiKey ? formatKeyIndicator(apiKey) : 'No key saved';
  }

  if (removeButton) {
    removeButton.hidden = !hasApiKey;
  }
}

saveButton?.addEventListener('click', () => {
  if (!form) {
    return;
  }

  const apiKey = apiKeyInput?.value.trim();
  if (!apiKey) {
    return;
  }

  saveOpenAIApiKey(apiKey, (isSuccess) => {
    if (isSuccess) {
      if (apiKeyInput) {
        apiKeyInput.value = '';
      }
      void renderCurrentKey();
      alert('API key saved successfully!');
    } else {
      alert('Failed to save API key. Please try again.');
    }
  });
});

removeButton?.addEventListener('click', () => {
  removeOpenAIApiKey((isSuccess) => {
    if (isSuccess) {
      void renderCurrentKey();
      alert('API key removed successfully!');
    } else {
      alert('Failed to remove API key. Please try again.');
    }
  });
});

void renderCurrentKey();

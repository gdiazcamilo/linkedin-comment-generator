import { getAcceptedTwoLetterLanguages } from '../../accepted-languages';
import { createLanguageModel, getModelAvailability } from '../../ai-clients/chrome-built-in/chrome-built-in-client';
import { AIProvider } from '../../enums';
import { getAIProvider, getOpenAIApiKey, removeOpenAIApiKey, saveAIProvider, saveOpenAIApiKey } from '../../storage';

const form = document.getElementById('settings-form') as HTMLFormElement | null;
const saveButton = document.getElementById('save-button');
const removeButton = document.getElementById('remove-key-button') as HTMLButtonElement | null;
const keyStatus = document.getElementById('key-status');
const keyIndicator = document.getElementById('key-indicator');
const apiKeyInput = document.getElementById('openai-api-key') as HTMLInputElement | null;
const openAISettings = document.getElementById('openai-settings') as HTMLElement;
const builtInSettings = document.getElementById('chrome-built-in-settings') as HTMLElement;
const builtInOption = document.getElementById('chrome-built-in-option');
const providerInputs = document.querySelectorAll<HTMLInputElement>('input[name="ai-provider"]');
const openAIProviderInput = document.getElementById('openai-provider') as HTMLInputElement | null;
const chromeBuiltInProviderInput = document.getElementById('chrome-built-in-provider') as HTMLInputElement | null;

if (openAIProviderInput) openAIProviderInput.value = AIProvider.OpenAI;
if (chromeBuiltInProviderInput) chromeBuiltInProviderInput.value = AIProvider.ChromeBuiltIn;

function selectedProvider(): AIProvider {
  return document.querySelector<HTMLInputElement>('input[name="ai-provider"]:checked')?.value === AIProvider.ChromeBuiltIn
    ? AIProvider.ChromeBuiltIn
    : AIProvider.OpenAI;
}

function renderProviderSettings(): void {
  if (selectedProvider() == AIProvider.OpenAI) {
    openAISettings.hidden = false;
    builtInSettings.hidden = true;
  }
  else if(selectedProvider() == AIProvider.ChromeBuiltIn) {
    openAISettings.hidden = true;
    builtInSettings.hidden = false;
    getModelAvailability().then(availability => updateModelAvailability(availability));
  }
}

async function initializeProviders(): Promise<void> {
  const savedProvider = await getAIProvider();
  let builtInAvailable = false;

  try {
    const modelAvailability = await getModelAvailability();
    builtInAvailable = modelAvailability !== 'unavailable';
  } catch (error) {
    console.warn('Could not check Chrome Built-in AI availability.', error);
  }

  if (builtInOption) {
    builtInOption.hidden = !builtInAvailable;
  }

  const provider = savedProvider === AIProvider.ChromeBuiltIn && builtInAvailable ? savedProvider : AIProvider.OpenAI;
  const input = document.querySelector<HTMLInputElement>(`input[name="ai-provider"][value="${provider}"]`);
  if (input) input.checked = true;
  renderProviderSettings();
}

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

saveButton?.addEventListener('click', async () => {
  if (!form) {
    return;
  }

  const provider = selectedProvider();
  const apiKey = apiKeyInput?.value.trim();
  const existingApiKey = await getOpenAIApiKey();
  if (provider === AIProvider.OpenAI && !apiKey && !existingApiKey) {
    alert('Enter an OpenAI API key before enabling OpenAI.');
    return;
  }

  const saveProvider = () => saveAIProvider(provider, (isSuccess) => {
    if (isSuccess) {
      if (apiKeyInput) {
        apiKeyInput.value = '';
      }
      void renderCurrentKey();
      alert('AI provider saved successfully!');
    } else {
      alert('Failed to save the AI provider. Please try again.');
    }
  });

  if (provider === AIProvider.OpenAI && apiKey) {
    saveOpenAIApiKey(apiKey, (isSuccess) => isSuccess ? saveProvider() : alert('Failed to save API key. Please try again.'));
  } else if (provider == AIProvider.ChromeBuiltIn) {
    saveProvider();
    await downloadChromeModel();
  }
});

async function downloadChromeModel() {
  const availability = await getModelAvailability();
  updateModelAvailability(availability);

  if(availability === 'downloadable') {
    console.log('navigator.userActivation.isActive = ', navigator.userActivation.isActive);

    if(navigator.userActivation.isActive) {
      chrome.runtime.sendMessage({
        type: "START_DOWNLOAD",
      });
      updateDownloadInfo("Downloaded request. It might take a minute to start...", {hideProgressPanel: false});
    }
  }
}

function updateModelAvailability(availability: string) {
  // TODO: define an enum for availability statuses and replace the scattered strings.
  if(availability === 'available') {
    updateDownloadInfo("Model is ready", {hideProgressPanel: true});
  }
  else if (availability === 'unavailable') {
    updateDownloadInfo("Model is not available", {hideProgressPanel: true});
  }
  else if (availability === 'downloadable') {
    updateDownloadInfo("Model is available for download", {hideProgressPanel: true});
  }
  else if (availability === 'downloading') {
    updateDownloadInfo("Model is downloading", {hideProgressPanel: false});
  }
}

function updateDownloadInfo(msg: string, {hideProgressPanel = true} = {}) {
  const paragraph = builtInSettings.querySelector("p") as HTMLParagraphElement
  const progressInfoPanel = builtInSettings.querySelector(".progress-container") as HTMLDivElement;
  
  paragraph.textContent = msg;
  progressInfoPanel.hidden = hideProgressPanel
}

function updateBuiltInProgress(progressValue: number) {
  const progress = builtInSettings.querySelector(".progress-container progress") as HTMLProgressElement;
  const progressLabel = builtInSettings.querySelector(".progress-container .current-progress-num") as HTMLSpanElement;
  progress.hidden = false;
  progress.value = progressValue;
  progressLabel.textContent = (progressValue * 100).toFixed(2).toString() + "%";

  if(progressValue === 1) {
    getModelAvailability().then(availability => updateModelAvailability(availability));
  }
}

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

providerInputs.forEach((input) => input.addEventListener('change', renderProviderSettings));

void Promise.all([renderCurrentKey(), initializeProviders()]);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(["DOWNLOAD_REQUESTED", "DOWNLOAD_PROGRESSED"].includes(message.type) === false) return;

  if(message.type === "DOWNLOAD_REQUESTED") {
    for(let i=1; i<=5; i++) {
      setTimeout(() => {
        const dots = ".".padEnd(i, ".");
        updateDownloadInfo("Waiting for download to start." + dots, {hideProgressPanel: false});
      }, 200 + (100 * i));
    }
  }
  else if(message.type === "DOWNLOAD_PROGRESSED") {
    updateModelAvailability('downloading')
    updateBuiltInProgress(message.loaded);
  }

  return true;
  
});
import { generateComment } from './comment-generator';
import { extractPostContent, findPostContainerFromChild, insertComment } from './linkedin-dom';

export function insertGenerateCommentButton(buttonsContainer: HTMLElement): void {
  if (buttonsContainer.querySelector('.generate-comment-button')) {
    return;
  }

  // Replicate the same style and structure as the LinkedIn Emoji or Image buttons.
  const linkedInButton = buttonsContainer.querySelector<HTMLButtonElement>('button[type="button"]');
  const span = linkedInButton?.querySelector<HTMLSpanElement>('span');

  if (!linkedInButton || !span) {
    return;
  }

  const button = `<button class="generate-comment-button ${linkedInButton.className}" type="button">
                      <span class="${span.className}">
                          <svg xmlns="http://www.w3.org/2000/svg" id="ai-comment-medium" fill="currentColor" aria-hidden="true" data-supported-dps="24x24" viewBox="0 0 24 24" width="24" height="24">
                              <path d="M19 4H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h1v3l4-3h9a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 11a1 1 0 0 1-1 1h-9.67L8 17v-1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z"></path>
                              <path d="m13 8 .55 1.45L15 10l-1.45.55L13 12l-.55-1.45L11 10l1.45-.55zm4 3 .4 1.1 1.1.4-1.1.4L17 14l-.4-1.1-1.1-.4 1.1-.4zM8.5 8.5 9 10l1.5.5L9 11l-.5 1.5L8 11l-1.5-.5L8 10z"></path>
                          </svg>
                      </span>
                  </button>`;

  buttonsContainer.insertAdjacentHTML('beforeend', button);
  buttonsContainer.querySelector('.generate-comment-button')?.addEventListener('click', generateCommentClickHandler);
}

function generateCommentClickHandler(event: Event): void {
  const postContainer = findPostContainerFromChild(event.target);

  if (!postContainer) {
    return;
  }

  const postContentText = extractPostContent(postContainer);

  if (!postContentText) {
    return;
  }

  generateComment(postContentText).then((comment) => {
    insertComment(postContainer, comment);
  });
}

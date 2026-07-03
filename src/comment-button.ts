
import { generateComment } from './comment-generator';
import { findPostContentElementFromChild, getReferencedCommentContentElement, getEditableCommentParagraph } from './linkedin-dom';
import { AIGenBox } from './ai-gen-box'
import { computePosition, autoUpdate, shift, hide } from '@floating-ui/dom';

function extractTextContent(postContentElement: HTMLElement): string | null {
  return postContentElement?.innerText ?? null;
}

function insertComment(emojiButton: HTMLElement, commentText: string): boolean {
  const paragraph = getEditableCommentParagraph(emojiButton);

  if (!paragraph) {
    console.warn('Could not find editable comment paragraph for the clicked generate comment button');
    return false;
  }

  paragraph.append(commentText);
  return true;
}

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
  
  const buttonDOMElem = buttonsContainer.querySelector('.generate-comment-button') as HTMLButtonElement;
  buttonDOMElem.addEventListener('click', generateCommentClickHandler);

}

function generateCommentClickHandler(event: Event): void {
  const emojiButton = event.currentTarget as HTMLElement;
  const aiGenBox = AIGenBox.getInstance();
  if(Object.hasOwn(aiGenBox, "floatingUiCleanup")) {
    const temp = (aiGenBox as any);
    if(typeof(temp.floatingUiCleanup) === "function") {
      temp.floatingUiCleanup();
    }

    
  }

  aiGenBox.show();
  
  const cleanup = autoUpdate(emojiButton, aiGenBox.getDOMElement(), () => {
    computePosition(emojiButton, aiGenBox.getDOMElement(), {
      middleware: [shift(), hide()]
    }).then(({x, y, middlewareData: {hide}}) => {
      Object.assign(aiGenBox.getDOMElement().style, {
        left: `${x}px`,
        top: `${y}px`
      });

      if(hide?.referenceHidden) {
        aiGenBox.hide();
      }
    });
  });
  
  //TODO: maybe is cleaner to pass the cleanup function to the hideAIGenBox function
  Object.assign(aiGenBox, {
    floatingUiCleanup: cleanup
  });

  document.addEventListener('click', hideAIGenBox);

  const postContentElement = findPostContentElementFromChild(emojiButton);

  if (!postContentElement) {
    console.warn('Could not find post content element for the clicked generate comment button');
    return;
  }

  const referencedCommentContentElement = getReferencedCommentContentElement(emojiButton);
  const referencedCommentText = referencedCommentContentElement ? extractTextContent(referencedCommentContentElement) : null;
  const postContentText = extractTextContent(postContentElement);
  if (!postContentText) {
    console.warn('Couldn\'t find text content from the post content element');
    return;
  }

  // console.log("POST: ", postContentText);
  // console.log("REF COMMENT: ", referencedCommentText);

  //TODO: put an loading indicator while comment is being generated
  // generateComment(postContentText, referencedCommentText).then((comment) => {
  //   insertComment(emojiButton, comment);
  // });
}


const hideAIGenBox = (event: Event) => {
  console.log("trigger hideAIGenBox");
  const isHtmlElement = event.target instanceof HTMLElement;
  if (!isHtmlElement)
    return;
  
  // Don't hide if clicking inside the box itself or in the button that will display the box.
  const target = event.target as HTMLElement
  if (target.closest('div.ai-gen-box-container'))
    return;

  if (target.classList.contains("generate-comment-button"))
    return;

  if (target.closest(".generate-comment-button"))
    return;

  AIGenBox.getInstance().hide();

  document.removeEventListener('click', hideAIGenBox);

}
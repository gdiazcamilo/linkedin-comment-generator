import { insertGenerateCommentButton } from './comment-button';

console.log('LinkedIn Comment Generator content script loaded.');

const newPostsObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) {
        return;
      }

      if (node.matches('#emoji-medium')) {
        const buttonContainer = node.closest<HTMLElement>('div');

        if (buttonContainer) {
          insertGenerateCommentButton(buttonContainer);
        }
      }
    });
  }
});

newPostsObserver.observe(document, {
  childList: true,
  subtree: true,
});

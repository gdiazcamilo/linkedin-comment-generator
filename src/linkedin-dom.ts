export const COMMENT_BOX_SELECTOR = 'div[contenteditable="true"][role="textbox"][componentkey].ProseMirror';

export function findPostContainerFromChild(child: EventTarget | null): HTMLElement | null {
  if (!(child instanceof Element)) {
    return null;
  }

  return child.closest<HTMLElement>('div[data-lazy-mount-id]');
}

export function extractPostContent(postContainer: HTMLElement): string | null {
  return postContainer.querySelector<HTMLElement>('p[componentkey^="feed-commentary"]')?.innerText ?? null;
}

export function insertComment(postContainer: HTMLElement, commentText: string): boolean {
  const commentBox = postContainer.querySelector<HTMLElement>(COMMENT_BOX_SELECTOR);
  const paragraph = commentBox?.querySelector<HTMLParagraphElement>('p');

  if (!paragraph) {
    return false;
  }

  paragraph.innerText = commentText;
  return true;
}

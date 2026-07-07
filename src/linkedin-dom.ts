const COMMENT_PARAGRAPH_SELECTOR = 'div[contenteditable="true"][role="textbox"][componentkey].ProseMirror p';
const COMMENT_CONTAINER_SELECTOR = 'div[componentkey^="replaceableComment_urn:li:comment"][viewtrackingspecs]';

function findPostContainerFromChild(child: HTMLElement): HTMLElement | null {
  return child.closest<HTMLElement>('div[data-lazy-mount-id]');
}

function findPostContentElement(postContainer: HTMLElement): HTMLElement | null {
  return postContainer.querySelector<HTMLElement>('p[componentkey^="feed-commentary"]');
}

function findPostContentElementFromChild(child: HTMLElement): HTMLElement | null {
  const postContainer = findPostContainerFromChild(child);
  if (!postContainer) {
    console.warn('Could not find post container from child element');
    return null;
  }

  return findPostContentElement(postContainer);
}


function findParentCommentBoxContainer(emojiButton: HTMLElement): HTMLElement | null {
  
  let sentinel = 100;
  let parent = emojiButton.parentElement;
  while (parent && (parent.tagName !== 'DIV' || !parent.querySelector('div[componentkey^="commentBox"]'))) {
    parent = parent.parentElement;
    sentinel--;
    if (sentinel <= 0) {
      return null;
    }
  }
  

  return parent;
}

function getEditableCommentParagraph(emojiButton: HTMLElement): HTMLParagraphElement | null {
  const commentBoxContainer = findParentCommentBoxContainer(emojiButton);

  if (!commentBoxContainer) {
    return null;
  }

  return commentBoxContainer.querySelector<HTMLParagraphElement>(COMMENT_PARAGRAPH_SELECTOR);
}

function findMentionsInCurrentCommentBox(emojiButton: HTMLElement): NodeListOf<HTMLElement> | null {
  const commentBoxContainer = findParentCommentBoxContainer(emojiButton);
  
  if (!commentBoxContainer) {
    console.warn('Could not find comment box container for emoji button');
    return null;
  }

  return commentBoxContainer.querySelectorAll<HTMLSpanElement>('span[data-type="mention"]');

}

function findReferencedCommentElement(emojiButton: HTMLElement): HTMLElement | null {
  const mentions = findMentionsInCurrentCommentBox(emojiButton);
  if (!mentions || mentions.length === 0) {
    console.debug('Didn\'t find any mention in the comment box');
    return null;
  }
  
  const postContainer = findPostContainerFromChild(emojiButton);
  if (!postContainer) {
    console.warn('Could not find post container for emoji button');
    return null;
  }

  const mentionName = mentions[0].innerText.trim();
  const potentialCommentAuthorContainers = postContainer.querySelectorAll<HTMLDivElement>(`${COMMENT_CONTAINER_SELECTOR} a[href^="https://www.linkedin.com/in"] p > span`);
  for (const authorContainer of potentialCommentAuthorContainers) {
    const authorName = authorContainer.innerText.trim();
    // Use includes instead of exact match because sometimes the mention name can be a substring of the actual author name (e.g. mention is "John D." but author name is "John Doe").
    if (authorName.includes(mentionName)) {
      return authorContainer.closest<HTMLElement>(COMMENT_CONTAINER_SELECTOR);
    }
  }
  
  return null;
}

function getReferencedCommentContentElement(emojiButton: HTMLElement): HTMLElement | null {
  const referencedCommentElement = findReferencedCommentElement(emojiButton);
  if (!referencedCommentElement) {
    console.debug('Couldn\'t find the referenced comment element for the mention in the comment box');
    return null;
  }

  const contentElement = referencedCommentElement.querySelector<HTMLElement>('p:is([componentkey^="comment-commentary"], [componentkey^="comment-reply-commentary"])');
  return contentElement;
}

export { findPostContentElement, getEditableCommentParagraph, getReferencedCommentContentElement, findPostContentElementFromChild };
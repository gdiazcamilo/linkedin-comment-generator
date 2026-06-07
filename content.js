console.log("LinkedIn Comment Generator content script loaded.");


const BUTTON_INSERTION_STRATEGY_TYPE = {
    WHEN_TYPING_COMMENT: 'when_typing_comment'
};
const BUTTON_INSERTION_STRATEGY = BUTTON_INSERTION_STRATEGY_TYPE.WHEN_TYPING_COMMENT;

const MAIN_FEED_SELECTOR = 'div[role="list"][data-testid="mainFeed"][componentkey="container-update-list_mainFeed-lazy-container"]';
const COMMENT_BOX_SELECTOR = 'div[contenteditable="true"][role="textbox"][componentkey].ProseMirror';


function findPostContainerFromChild(child) {
    return child.closest('div[data-lazy-mount-id]');
}

function findButtonsContainer(postContainer) {
    return postContainer.querySelector('div[componentkey^="commentBoxLinkPreview"] + div div');
}


function insertGenerateCommentButton(buttonsContainer) {
    // Replicate the same style and structure as the LinkedIn Emoji or Image buttons.
    const linkedInButton = buttonsContainer.querySelector('button[type="button"]');
    const span = linkedInButton.querySelector('span');

    const button = `<button class="generate-comment-button ${linkedInButton.className}" type="button">
                        <span class="${span.className}">
                            <svg xmlns="http://www.w3.org/2000/svg" id="ai-comment-medium" fill="currentColor" aria-hidden="true" data-supported-dps="24x24" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M19 4H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h1v3l4-3h9a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 11a1 1 0 0 1-1 1h-9.67L8 17v-1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z"></path>
                                <path d="m13 8 .55 1.45L15 10l-1.45.55L13 12l-.55-1.45L11 10l1.45-.55zm4 3 .4 1.1 1.1.4-1.1.4L17 14l-.4-1.1-1.1-.4 1.1-.4zM8.5 8.5 9 10l1.5.5L9 11l-.5 1.5L8 11l-1.5-.5L8 10z"></path>
                            </svg>
                        </span>
                    </button>`;
    
    if (!buttonsContainer.querySelector('.generate-comment-button')) {
        buttonsContainer.insertAdjacentHTML('beforeend', button);
        buttonsContainer.querySelector('.generate-comment-button').addEventListener('click', generateCommentClickHandler);
    }
}

function generateCommentClickHandler(event) {
    const postContainer = findPostContainerFromChild(event.target);
    const postContentText = extractPostContent(postContainer);
    generateComment(postContentText).then(comment => {
        insertComment(postContainer, comment);
    });
}

function extractPostContent(postContainer) {
    return postContainer.querySelector('p[componentkey^="feed-commentary"]').innerText;
}



async function generateComment(postContent) {
    const FAKE_COMMENT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(FAKE_COMMENT);
        }, 1000);
    });
    
}

function insertComment(postContainer, commentText) {
    const commentBox = postContainer.querySelector(COMMENT_BOX_SELECTOR);
    const paragraph = commentBox.querySelector('p');
    paragraph.innerText = commentText;
}


const newPostsObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('#emoji-medium')) {
                        const buttonContainer = node.closest('div');
                        insertGenerateCommentButton(buttonContainer);
                    }
                }
            });
        }
    }
});


newPostsObserver.observe(document, {
    childList: true,
    subtree: true
});
console.log("LinkedIn Comment Generator content script loaded.");


const BUTTON_INSERTION_STRATEGY_TYPE = {
    WHEN_TYPING_COMMENT: 'when_typing_comment'
};
const BUTTON_INSERTION_STRATEGY = BUTTON_INSERTION_STRATEGY_TYPE.WHEN_TYPING_COMMENT;

const MAIN_FEED_SELECTOR = 'div[role="list"][data-testid="mainFeed"][componentkey="container-update-list_mainFeed-lazy-container"]';
const COMMENT_BOX_SELECTOR = 'div[contenteditable="true"][role="textbox"][componentkey].ProseMirror';

document.addEventListener('input', (event) => {
    console.log('Input event detected. Target:', event.target);
    if (BUTTON_INSERTION_STRATEGY === BUTTON_INSERTION_STRATEGY_TYPE.WHEN_TYPING_COMMENT) {
        if(event.target.matches(COMMENT_BOX_SELECTOR)) {
            const postContainer = findPostContainer(event.target);
            const buttonsContainer = findButtonsContainer(postContainer);
            // insertGenerateCommentButton(buttonsContainer);
        }
    }
});

function findPostContainer(commentBox) {
    return commentBox.closest('div[data-lazy-mount-id]');
}

function findButtonsContainer(postContainer) {
    return postContainer.querySelector('div[componentkey^="commentBoxLinkPreview"] + div div');
}


function insertGenerateCommentButton(buttonsContainer) {
    const button = `<button class="generate-comment-button" 
                            style="margin-left: 8px; padding: 4px 8px; font-size: 14px; cursor: pointer;">
                        Gen
                    </button>`;
    if (!buttonsContainer.querySelector('.generate-comment-button')) {
        buttonsContainer.insertAdjacentHTML('beforeend', button);
        buttonsContainer.querySelector('.generate-comment-button').addEventListener('click', () => {
            console.log('Generate Comment button clicked.');
        });
    }
}

function extractPostContent(postElement) {
}



function generateComment(postContent) {

}

function insertComment(postContainer, commentText) {
}


const newPostsObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('div[data-lazy-mount-id]')) {
                        console.log('New post detected:', node);
                    }
                    if (node.matches('#emoji-medium')) {
                        const buttonContainer = node.closest('div');
                        console.log('Button container found from emoji:', buttonContainer);
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
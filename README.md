# LinkedIn Comment Generator

A Chrome extension that adds a comment suggestion button to LinkedIn feed posts.

When you open the LinkedIn feed and start interacting with a comment box, the extension injects a button alongside LinkedIn's native comment tools. Clicking the button reads the post text, generates a suggested comment, and inserts it into the comment editor.

## Current Status

This project is an early prototype. The extension UI is wired into LinkedIn, but comment generation currently returns a placeholder response from `content.js`.

## Features

- Runs as a Manifest V3 Chrome extension.
- Loads only on `www.linkedin.com/feed/*`.
- Detects LinkedIn comment toolbars as they appear in the feed.
- Adds a custom generate-comment button styled to match LinkedIn's native buttons.
- Extracts the post text from the LinkedIn post container.
- Inserts the generated suggestion into the active comment editor.

## Project Structure

```text
.
├── manifest.json
├── content.js
└── images/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    ├── icon-128.png
    └── ai-comment-medium.svg
```

## Installation

1. Open Chrome and go to `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project directory.
5. Open `https://www.linkedin.com/feed/`.

## Usage

1. Open a LinkedIn post in your feed.
2. Click into the comment box.
3. Click the generated comment button added by the extension.
4. Review and edit the inserted suggestion before posting.

## Development

After editing the extension:

1. Go back to `chrome://extensions`.
2. Click the reload button for `LinkedIn Comment Generator`.
3. Refresh the LinkedIn feed tab.

The main extension logic lives in `content.js`.

## Important Notes

- The extension depends on LinkedIn's current DOM structure. LinkedIn UI changes may require selector updates in `content.js`.
- The current `generateComment` implementation returns a fake placeholder comment.
- No external API key or backend is configured yet.
- Suggested comments should always be reviewed before posting.

## Next Steps

- Replace the placeholder generator with a real comment-generation service.
- Add error handling for missing post text or unavailable comment boxes.
- Add configuration for tone, length, or comment style.
- Add tests or a manual QA checklist for LinkedIn DOM changes.

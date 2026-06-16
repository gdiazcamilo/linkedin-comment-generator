# LinkedIn Comment Generator

A Chrome extension that adds a comment suggestion button to LinkedIn feed posts.

When you open the LinkedIn feed and start interacting with a comment box, the extension injects a button alongside LinkedIn's native comment tools. Clicking the button reads the post text, generates a suggested comment, and inserts it into the comment editor.

## Current Status

This project is an early prototype. The extension UI is wired into LinkedIn, but comment generation currently returns a placeholder response from `src/comment-generator.ts`.

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
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── comment-button.ts
│   ├── comment-generator.ts
│   ├── content-main.ts
│   ├── linkedin-dom.ts
│   └── manifest.ts
└── public/
    └── images/
        ├── icon-16.png
        ├── icon-32.png
        ├── icon-48.png
        ├── icon-128.png
        └── ai-comment-medium.svg
```

## Installation

Install dependencies:

```bash
npm install
```

Build the extension:

```bash
npm run build
```

1. Open Chrome and go to `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the generated `dist` directory.
5. Open `https://www.linkedin.com/feed/`.

If Chrome shows an error for `service-worker-loader.js` or `http://localhost:5173/@vite/env`, rebuild with `npm run build` and reload the `dist` directory. Those files are only expected while using the Vite dev server.

## Usage

1. Open a LinkedIn post in your feed.
2. Click into the comment box.
3. Click the generated comment button added by the extension.
4. Review and edit the inserted suggestion before posting.

## Development

Run the Vite dev server:

```bash
npm run dev
```

Keep that terminal process running while the extension is loaded. CRXJS development output references the local Vite server for hot reload, so stopping the dev server can cause Chrome to report localhost or service worker loading errors.

After editing the extension:

1. Go back to `chrome://extensions`.
2. Click the reload button for `LinkedIn Comment Generator`.
3. Refresh the LinkedIn feed tab.

The extension is built with TypeScript, Vite, and CRXJS. The typed manifest lives in `src/manifest.ts`, and the content script entry point is `src/content-main.ts`.

## Important Notes

- The extension depends on LinkedIn's current DOM structure. LinkedIn UI changes may require selector updates in `src/linkedin-dom.ts` or `src/content-main.ts`.
- The current `generateComment` implementation returns a fake placeholder comment.
- No external API key or backend is configured yet.
- Suggested comments should always be reviewed before posting.

## Next Steps

- Replace the placeholder generator with a real comment-generation service.
- Add error handling for missing post text or unavailable comment boxes.
- Add configuration for tone, length, or comment style.
- Add tests or a manual QA checklist for LinkedIn DOM changes.


## Limitations
- Only the text in posts is supported.
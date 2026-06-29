import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  version: '1.0',
  manifest_version: 3,
  name: 'LinkedIn Comment Generator',
  description: 'Generates a comment for a LinkedIn post based on the content of the post.',
  icons: {
    16: 'images/icon-16.png',
    32: 'images/icon-32.png',
    48: 'images/icon-48.png',
    128: 'images/icon-128.png',
  },
  action: {},
  background: {
    service_worker: 'src/service-worker.ts',
  },
  content_scripts: [
    {
      matches: ['*://www.linkedin.com/*'],
      js: ['src/content-main.ts'],
    },
  ],
  options_ui: {
    page: "pages/options.html",
    open_in_tab: true,
  },
  permissions: ['storage'],
  content_security_policy: { 
    // CSP manage what this extension is allowed to execute. 
    // The default for manifest V3 are good enough, but I make it explicit here and harden it a bit
    extension_pages: "script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none';"
  }
});

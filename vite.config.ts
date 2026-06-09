import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';

import manifest from './src/manifest';

export default defineConfig({
  plugins: [crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    cors: {
      origin: [/^chrome-extension:\/\/.+$/],
    },
  },
});

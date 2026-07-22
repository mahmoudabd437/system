const { defineConfig } = require('vite');
const path = require('node:path');

module.exports = defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

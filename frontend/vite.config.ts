import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.REACT_APP_DB_URL': JSON.stringify(env.REACT_APP_DB_URL)
    },
    plugins: [
      react(),
      commonjs() // Added to handle CommonJS modules
    ],
    optimizeDeps: {
      include: ['react-quilljs', 'quill'], // Ensure these libraries are optimized by Vite
    },
    build: {
      commonjsOptions: {
        include: [/react-quilljs/, /node_modules/], // Include react-quilljs in the commonjs handling
      },
    },
  };
});


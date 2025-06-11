import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Route } from 'react-router-dom';
import Home from './src/pages/Home';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexões externas
    port: 5173,
    strictPort: true,
    https: false, // Codespaces já faz proxy HTTPS
    hmr: process.env.CODESPACE_NAME
      ? {
          host: `${process.env.CODESPACE_NAME}-5173.app.github.dev`,
          protocol: 'wss',
        }
      : undefined,
  },
});

<Route path="/" element={<Home />} />

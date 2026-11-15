/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages sert l'appli sous /sparring-echecs/
const base = process.env.BASE_PATH ?? '/sparring-echecs/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-180.png'],
      manifest: {
        name: 'Sparring Échecs',
        short_name: 'Sparring',
        description: 'Entraînement aux échecs contre Maia, analyse Stockfish et révision espacée.',
        lang: 'fr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'any',
        background_color: '#f4f1ea',
        theme_color: '#3c7a3c',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Tout est précaché, y compris le modèle Maia (~22 Mo) et les .wasm → hors ligne complet.
        globPatterns: ['**/*.{js,mjs,css,html,svg,png,wasm,onnx,webmanifest}'],
        maximumFileSizeToCacheInBytes: 40 * 1024 * 1024,
        navigateFallback: 'index.html',
      },
    }),
  ],
  worker: { format: 'es' },
  resolve: {
    // Runtime ONNX « wasm » seul (sans WebGPU/JSEP) : plus léger.
    alias: { 'onnxruntime-web': 'onnxruntime-web/wasm' },
  },
  optimizeDeps: { exclude: ['onnxruntime-web'] },
  test: { include: ['src/**/*.test.ts'] },
});

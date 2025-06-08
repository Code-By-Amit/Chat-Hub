import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      strategies: 'injectManifest',
      srcDir: "src",
      filename: "my-sw.js",
      injectManifest: { rollupFormat: 'es' },
      manifest: {
        name: 'ChatHub',
        short_name: 'ChatHub',
        description: 'A full-stack chat app',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
    })
  ],
  build: { rollupOptions: { external: ['workbox-precaching'] } },
  server: {
    port: 5173,
    host: '0.0.0.0',
  }
})

// optimizeDeps: {
//     include: ['react/jsx-runtime'],
//     exclude: ['react-dom','workbox-precaching']
//   },
//   build: {
//     commonjsOptions: {
//       exclude: ['react-dom', 'react']  // avoid transforming these packages
//     }
//   }

// VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
//       // strategies: "injectManifest",
//       // injectManifest: { swSrc: 'src/service-worker/serviceWorker.js' },
//       manifest: {
//         name: 'ChatHub',
//         short_name: 'ChatHub',
//         description: 'A full-stack chat app',
//         theme_color: '#ffffff',
//         background_color: '#ffffff',
//         display: 'standalone',
//         icons: [
//           {
//             src: 'pwa-192x192.png',
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: 'pwa-512x512.png',
//             sizes: '512x512',
//             type: 'image/png'
//           }
//         ]
//       }
//     })
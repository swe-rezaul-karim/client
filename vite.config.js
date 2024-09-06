import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {server_url} from "./src/utils/connection.js";

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    cors: {
      origin: '*',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
    proxy: {
      '/socket.io': {
        target: server_url,
        changeOrigin: true,
        ws: true,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    global: 'window'
  },
  // build: {
  //   rollupOptions: {
  //     external: ['crypto']
  //   }
  // },
  // resolve: {
  //   alias: {
  //     src: "/src"
  //   }
  // }
});

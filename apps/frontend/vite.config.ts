import { join, resolve } from 'path';

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const envDir = join('..', '..');
  const env = loadEnv(mode, envDir, ['PROXY_API', 'VITE', 'FRONTEND_HOST', 'FRONTEND_PORT', 'API_HOST', 'API_PORT']);

  const HOST = env.FRONTEND_HOST;
  const PORT = parseInt(env.FRONTEND_PORT, 10);

  const PROXY_API = env.PROXY_API || `http://${env.API_HOST}:${env.API_PORT}`;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    envDir,
    server: {
      host: HOST,
      port: PORT,
      proxy: {
        '/api': {
          target: PROXY_API,
          changeOrigin: true,
          rewrite: path => {
            if (path.toLowerCase() === '/api/healthz') {
              return '/healthz';
            }

            return path;
          },
        },
      },
    },
  };
});

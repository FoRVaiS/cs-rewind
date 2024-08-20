import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './components/theme-provider.tsx';

import App from './pages/App/App.tsx';
import './index.scss';

const container = document.getElementById('_react_root')!;
const root = ReactDOM.createRoot(container);

const queryClient = new QueryClient();

root.render(<>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >
      <React.StrictMode>
        <App />
      </React.StrictMode>
      <ReactQueryDevtools />
    </ThemeProvider>
  </QueryClientProvider>
</>);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './components/theme-provider.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Landing from './pages/Landing/Landing.tsx';
import NotFound from './pages/404.tsx';

import './index.scss';

const container = document.getElementById('_react_root')!;
const root = ReactDOM.createRoot(container);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

root.render(<>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
      <ReactQueryDevtools />
    </ThemeProvider>
  </QueryClientProvider>
</>);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './components/theme-provider.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Header from './pages/Header.tsx';
import Landing from './pages/Landing/Landing.tsx';
import Registration from './pages/Registration/Registration.tsx';
import NotFound from './pages/404.tsx';

import './index.scss';

const container = document.getElementById('_react_root')!;
const root = ReactDOM.createRoot(container);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Header><Landing /></Header>,
  },
  {
    path: '/register',
    element: <Header><Registration /></Header>,
  },
  {
    path: '*',
    element: <Header><NotFound /></Header>,
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

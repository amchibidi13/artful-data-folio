
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import pages
import Index from './pages/Index';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import SearchResults from './pages/SearchResults';

// Import providers and context
import { Toaster } from '@/components/ui/toaster';

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Create the router with routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/search',
    element: <SearchResults />,
  },
  {
    path: '/home',
    element: <Index initialPage="home" />,
  },
  {
    path: '/about',
    element: <Index initialPage="about" />,
  },
  {
    path: '/projects',
    element: <Index initialPage="projects" />,
  },
  {
    path: '/contact',
    element: <Index initialPage="contact" />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

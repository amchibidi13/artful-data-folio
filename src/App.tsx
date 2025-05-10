
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { usePages } from "./hooks/useSiteData";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Fetch available pages
  const { data: pages, isLoading } = usePages();
  
  if (isLoading) {
    return null; // Or a loading indicator
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<Admin />} />
      
      {/* Dynamic routes for all pages based on page_link */}
      {pages && pages.map(page => {
        if (!page.page_link || page.page_link === 'home') return null; // Skip home as it's already handled
        return (
          <Route 
            key={page.id}
            path={`/${page.page_link}`} 
            element={<Index initialPage={page.page_name} />} 
          />
        );
      })}
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

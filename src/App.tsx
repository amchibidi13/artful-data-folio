
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useSiteConfig } from "./hooks/useSiteData";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Fetch available pages
  const { data: siteConfig, isLoading } = useSiteConfig();
  
  // Extract unique page names
  const pages = React.useMemo(() => {
    if (!siteConfig) return ['home'];
    
    const uniquePages = new Set<string>();
    siteConfig.forEach(config => {
      if (config.page && config.page !== 'admin') {
        uniquePages.add(config.page);
      }
    });
    
    return Array.from(uniquePages);
  }, [siteConfig]);

  if (isLoading) {
    return null; // Or a loading indicator
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<Admin />} />
      
      {/* Dynamic routes for all pages */}
      {pages.map(pageName => {
        if (pageName === 'home') return null; // Home is already handled
        return <Route key={pageName} path={`/${pageName.toLowerCase()}`} element={<Index initialPage={pageName} />} />;
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

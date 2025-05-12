import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteConfig, useSiteContent } from '@/hooks/useSiteData';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import ArticlesSection from '@/components/ArticlesSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import GenericSection from '@/components/GenericSection';

interface IndexProps {
  initialPage?: string;
}

interface SectionComponentProps {
  sectionName: string;
}

const Index: React.FC<IndexProps> = ({ initialPage }) => {
  const { data: allSiteConfig, isLoading } = useSiteConfig();
  const location = useLocation();
  
  // Determine which page to show based on path or initialPage
  const currentPageName = React.useMemo(() => {
    if (initialPage) {
      return initialPage;
    }
    
    // Default to home when on root path
    return 'home';
  }, [initialPage]);
  
  // Filter site config for current page
  const siteConfig = React.useMemo(() => {
    if (!allSiteConfig) return [];
    return allSiteConfig.filter(config => config.page === currentPageName);
  }, [allSiteConfig, currentPageName]);

  // Map section names to components
  const sectionComponents: Record<string, React.FC<SectionComponentProps>> = {
    'hero': HeroSection,
    'about': AboutSection,
    'projects': ProjectsSection,
    'articles': ArticlesSection,
    'contact': ContactSection
  };

  // Loading skeleton for sections
  const SectionSkeleton = () => (
    <div className="py-20">
      <div className="container">
        <Skeleton className="h-12 w-64 mx-auto mb-6" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-12" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );

  // Filter visible sections and order them
  const orderedSections = siteConfig
    ?.filter(section => section.is_visible)
    .sort((a, b) => a.display_order - b.display_order)
    .map(section => section.section_name);

  useEffect(() => {
    if (siteConfig && orderedSections) {
      console.log(`Available sections for page ${currentPageName}:`, orderedSections);
    }
  }, [siteConfig, orderedSections, currentPageName]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {isLoading ? (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        ) : orderedSections && orderedSections.length > 0 ? (
          orderedSections.map(sectionName => {
            // Convert sectionName to lowercase for component lookup
            const lowerSectionName = sectionName.toLowerCase();
            if (sectionComponents[lowerSectionName]) {
              // If we have a predefined component for this section, use it
              const SectionComponent = sectionComponents[lowerSectionName];
              return <SectionComponent key={sectionName} sectionName={sectionName} />;
            } else {
              // Otherwise use a generic section component
              return <GenericSection key={sectionName} sectionName={sectionName} />;
            }
          })
        ) : (
          // Fallback if no configuration is available for this page
          <>
            <div className="py-20">
              <div className="container text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to {currentPageName}</h1>
                <p className="text-lg text-muted-foreground">
                  This page has no sections configured yet. Add sections in the admin dashboard.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;

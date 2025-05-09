import React, { useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const { data: siteConfig, isLoading } = useSiteConfig();
  const { toast } = useToast();

  // Map section names to components
  const sectionComponents: Record<string, (props: { sectionName: string }) => React.ReactNode> = {
    'hero': ({ sectionName }) => <HeroSection key={sectionName} />,
    'about': ({ sectionName }) => <AboutSection key={sectionName} />,
    'projects': ({ sectionName }) => <ProjectsSection key={sectionName} />,
    'articles': ({ sectionName }) => <ArticlesSection key={sectionName} />,
    'contact': ({ sectionName }) => <ContactSection key={sectionName} />
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
      console.log("Available sections:", orderedSections);
    }
  }, [siteConfig, orderedSections]);

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
            if (sectionComponents[sectionName.toLowerCase()]) {
              // If we have a predefined component for this section, use it
              const SectionComponent = sectionComponents[sectionName.toLowerCase()];
              return <SectionComponent key={sectionName} sectionName={sectionName} />;
            } else {
              // Otherwise use a generic section component
              return <GenericSection key={sectionName} sectionName={sectionName} />;
            }
          })
        ) : (
          // Fallback if no configuration is available
          <>
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <ArticlesSection />
            <ContactSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;

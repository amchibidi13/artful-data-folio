
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSiteContent, getContentByType } from '@/hooks/useSiteData';
import { Skeleton } from '@/components/ui/skeleton';

const HeroSection: React.FC = () => {
  const { data: heroContent, isLoading } = useSiteContent('hero');

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading skeleton for hero section
  const HeroSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-12 w-4/5" />
      <Skeleton className="h-12 w-3/5" />
      <Skeleton className="h-5 w-full max-w-md" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  );

  // Get content from database 
  const title = getContentByType(heroContent, 'title');
  const subtitle = getContentByType(heroContent, 'subtitle');
  const description = getContentByType(heroContent, 'description');
  const buttonText = getContentByType(heroContent, 'button_text');

  return (
    <section className="min-h-[90vh] flex items-center pt-20">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            {isLoading ? (
              <HeroSkeleton />
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {title ? (
                    <>
                      {subtitle ? (
                        <>
                          <span className="text-data-purple">{title}</span>
                          <span className="block">
                            <span className="text-data-indigo">{subtitle}</span>
                          </span>
                        </>
                      ) : (
                        <span className="text-data-purple">{title}</span>
                      )}
                    </>
                  ) : (
                    <>
                      Turning <span className="text-data-purple">Data</span> into 
                      <span className="block">Meaningful <span className="text-data-indigo">Insights</span></span>
                    </>
                  )}
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  {description || 'Data science portfolio showcasing projects and articles on machine learning, data analysis, and visualization.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-data-purple hover:bg-data-indigo text-white font-medium px-8 py-6"
                    onClick={scrollToProjects}
                  >
                    {buttonText || 'View Projects'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-data-purple text-data-purple hover:text-data-indigo hover:border-data-indigo px-8 py-6"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get in Touch
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-data-purple/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-data-blue/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                alt="Data visualization" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

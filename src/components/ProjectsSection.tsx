
import React from 'react';
import ProjectCard from './ProjectCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/supabase-types';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectsSection: React.FC = () => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });

  // Placeholder for loading state
  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            A collection of data science projects showcasing my skills in machine learning, data analysis, and visualization.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="md:col-span-2 lg:col-span-3 text-center text-red-500">
              Error loading projects. Please try again later.
            </div>
          ) : projects && projects.length > 0 ? (
            <>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.image_url}
                  tags={project.tags}
                  link={project.link || '#'}
                />
              ))}
            </>
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center">
              No projects found.
            </div>
          )}
          
          <div className="md:col-span-2 lg:col-span-3 flex justify-center mt-8">
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-data-purple hover:text-data-indigo underline underline-offset-4"
            >
              View more projects on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

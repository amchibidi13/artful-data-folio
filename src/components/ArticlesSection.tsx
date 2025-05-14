
import React from 'react';
import ArticleCard from './ArticleCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/supabase-types';
import { Skeleton } from '@/components/ui/skeleton';

const ArticlesSection: React.FC = () => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('date', { ascending: false }); // Newest first for display
      
      if (error) throw error;
      return data as Article[];
    },
  });

  // Placeholder for loading state
  const LoadingSkeleton = () => (
    <>
      {[1, 2].map((i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-7 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <section id="articles" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Latest Articles</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about data science, machine learning, and analytics.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="md:col-span-2 lg:col-span-2 text-center text-red-500">
              Error loading articles. Please try again later.
            </div>
          ) : articles && articles.length > 0 ? (
            <>
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  date={new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  readTime={article.read_time.toString()}
                  category={article.category}
                  link={article.link || '#'}
                />
              ))}
            </>
          ) : (
            <div className="md:col-span-2 lg:col-span-2 text-center">
              No articles found.
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-12">
          <a 
            href="#" 
            className="text-data-purple hover:text-data-indigo underline underline-offset-4"
          >
            View all articles
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;

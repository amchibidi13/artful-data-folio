import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResult {
  id: string;
  content_id: string;
  section: string;
  page: string;
  field_type: string;
  content: string;
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      // First approach: Direct search in site_content table
      const { data, error } = await supabase
        .from('site_content')
        .select('id, section, content, field_type, content_type')
        .filter('include_in_global_search', 'eq', true)
        .textSearch('content', searchTerm, {
          type: 'plain',
          config: 'english'
        });
      
      if (error) throw error;
      
      if (data) {
        // Get section details to determine the page
        const sectionsData = await Promise.all(data.map(async (item) => {
          const { data: sectionData } = await supabase
            .from('site_config')
            .select('page')
            .eq('section_name', item.section)
            .single();
          
          return {
            id: item.id,
            content_id: item.id,
            section: item.section,
            page: sectionData?.page || 'unknown',
            field_type: item.field_type || item.content_type,
            content: item.content,
          };
        }));
        
        setResults(sectionsData);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial search on component mount
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== query) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };
  
  const highlightText = (text: string, query: string): JSX.Element => {
    if (!query.trim()) return <>{text}</>;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? 
          <mark key={i} className="bg-yellow-200">{part}</mark> : part
        )}
      </>
    );
  };
  
  // Function to truncate long content and keep the search term visible
  const truncateContent = (text: string, query: string, maxLength: number = 200): string => {
    if (text.length <= maxLength) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) {
      return text.substring(0, maxLength) + '...';
    }
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    
    return (start > 0 ? '...' : '') + 
           text.substring(start, end) + 
           (end < text.length ? '...' : '');
  };
  
  return (
    <div className="container py-8 min-h-screen">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search again..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-muted-foreground mb-4">Found {results.length} results for "{query}"</p>
          
          {results.map((result) => (
            <Card key={result.id}>
              <CardHeader className="pb-2">
                <CardDescription>
                  {result.page} / {result.section} / {result.field_type}
                </CardDescription>
                <CardTitle className="text-lg">
                  {highlightText(result.field_type.replace(/_/g, ' '), query)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {highlightText(truncateContent(result.content, query), query)}
                </p>
                <Button variant="link" size="sm" asChild className="mt-2 p-0">
                  <Link to={`/${result.page}`}>
                    View on {result.page} page
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-xl mb-2">No results found for "{query}"</p>
          <p className="text-muted-foreground">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl mb-2">Enter a search term to find content</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

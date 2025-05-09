
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteConfig, SiteContent, NavigationItem } from '@/types/database-types';

export const useSiteConfig = (page?: string) => {
  return useQuery({
    queryKey: ['site-config', page],
    queryFn: async () => {
      let query = supabase
        .from('site_config')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (page) {
        query = query.eq('page', page);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SiteConfig[];
    },
  });
};

export const useSiteContent = (section?: string) => {
  return useQuery({
    queryKey: ['site-content', section],
    queryFn: async () => {
      let query = supabase
        .from('site_content')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (section) {
        query = query.eq('section', section);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SiteContent[];
    },
  });
};

export const useNavigationItems = () => {
  return useQuery({
    queryKey: ['navigation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as NavigationItem[];
    },
  });
};

// Helper function to get content by type
export const getContentByType = (
  contents: SiteContent[] | undefined, 
  type: string
): string => {
  if (!contents) return '';
  const content = contents.find(item => item.content_type === type);
  return content ? content.content : '';
};

// Helper function to get list content
export const getListContent = (
  contents: SiteContent[] | undefined, 
  type: string
): string[] => {
  const content = getContentByType(contents, type);
  return content ? content.split(',').map(item => item.trim()) : [];
};

// Define a concrete type for style objects to prevent recursive type definitions
type StyleObject = {
  [key: string]: string | number | boolean | null;
};

// Helper function to get styled content
export const getStyledContent = (
  contents: SiteContent[] | undefined,
  type: string
): { content: string, style: StyleObject } => {
  const content = getContentByType(contents, type);
  let style: StyleObject = {};
  
  const styleContent = contents?.find(item => item.content_type === `${type}_style`)?.content;
  if (styleContent) {
    try {
      style = JSON.parse(styleContent) as StyleObject;
    } catch (e) {
      console.error('Could not parse style:', e);
    }
  }
  
  return { content, style };
};

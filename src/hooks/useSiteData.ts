
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteConfig, SiteContent, NavigationItem } from '@/types/database-types';

export const useSiteConfig = () => {
  return useQuery({
    queryKey: ['site-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .order('display_order', { ascending: true }) as any;
      
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
      
      const { data, error } = await query as any;
      
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
        .order('display_order', { ascending: true }) as any;
      
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
  return content ? content.split(',') : [];
};


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Field type mappings object to help with form rendering based on field types
export const fieldTypeMappings = {
  hero_section: [
    'title',
    'subtitle',
    'description',
    'button_text',
    'background_image',
  ],
  about_section: [
    'title',
    'paragraph_1',
    'paragraph_2',
    'skills_title',
    'skills_list',
    'education_title',
    'education_list',
    'button_text',
  ],
  projects_section: [
    'title',
    'description',
  ],
  articles_section: [
    'title',
    'description',
  ],
  contact_section: [
    'title',
    'description',
    'form_name_label',
    'form_email_label',
    'form_message_label',
    'form_button_text',
  ],
  testimonial_section: [
    'title',
    'testimonials',
  ],
  feature_section: [
    'title',
    'subtitle',
    'features',
  ],
  pricing_section: [
    'title',
    'description',
    'plans',
  ],
  faq_section: [
    'title',
    'description',
    'faqs',
  ],
  cta_section: [
    'title',
    'description',
    'button_text',
    'button_url',
  ],
  generic_section: [
    'title',
    'subtitle',
    'content',
    'background_style',
    'title_style',
    'subtitle_style',
    'content_style',
  ],
};

// Helper function to determine the input type based on field type
export const getFieldInputType = (fieldName: string) => {
  if (fieldName.includes('image') || fieldName.includes('photo') || fieldName.includes('avatar')) {
    return 'image';
  } else if (fieldName.includes('url') || fieldName.includes('link')) {
    return 'url';
  } else if (fieldName.includes('email')) {
    return 'email';
  } else if (fieldName.includes('password')) {
    return 'password';
  } else if (fieldName.includes('date')) {
    return 'date';
  } else if (fieldName.includes('color')) {
    return 'color';
  } else if (fieldName.includes('paragraph') || fieldName.includes('description') || fieldName.includes('content')) {
    return 'textarea';
  } else if (fieldName.includes('list')) {
    return 'list';
  } else if (fieldName.includes('style')) {
    return 'json';
  } else {
    return 'text';
  }
};

// Get content by type from content data
export const getContentByType = (contentData: any[] | null | undefined, type: string): string => {
  if (!contentData) return '';
  const content = contentData.find(item => item.content_type === type);
  return content ? content.content : '';
};

// Get list content from content data
export const getListContent = (contentData: any[] | null | undefined, type: string): string[] => {
  if (!contentData) return [];
  const content = contentData.find(item => item.content_type === type);
  if (!content) return [];

  try {
    if (content.content.includes('[') && content.content.includes(']')) {
      return JSON.parse(content.content);
    } else {
      return content.content.split(',').map((item: string) => item.trim());
    }
  } catch (error) {
    console.error(`Error parsing list content for ${type}:`, error);
    return [];
  }
};

// Fetch pages
export const usePages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch page by link
export const usePageByLink = (pageLink: string) => {
  return useQuery({
    queryKey: ['page', pageLink],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_link', pageLink)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!pageLink,
  });
};

// Fetch site configuration
export const useSiteConfig = () => {
  return useQuery({
    queryKey: ['site_config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch site content for a specific section
export const useSiteContent = (sectionName?: string) => {
  return useQuery({
    queryKey: ['site_content', sectionName],
    queryFn: async () => {
      const query = supabase.from('site_content').select('*');
      
      if (sectionName) {
        query.eq('section', sectionName);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: true, // Always enabled, even without sectionName
  });
};

// Fetch navigation items
export const useNavigationItems = () => {
  return useQuery({
    queryKey: ['navigation_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation') // Changed from 'navigation_items' to 'navigation'
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch field type mappings
export const useFieldTypesMapping = () => {
  return useQuery({
    queryKey: ['field_type_mappings'],
    queryFn: () => {
      return fieldTypeMappings;
    }
  });
};

// Fetch site structure for the site map
export const useSiteStructure = () => {
  return useQuery({
    queryKey: ['site_structure'],
    queryFn: async () => {
      // First get all pages
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (pagesError) throw pagesError;

      // For each page, get its sections
      const pagesWithSections = await Promise.all(pages.map(async (page) => {
        const { data: sections, error: sectionsError } = await supabase
          .from('site_config')
          .select('*')
          .eq('page', page.page_name)
          .order('display_order', { ascending: true });
        
        if (sectionsError) throw sectionsError;

        // For each section, get its content
        const sectionsWithContent = await Promise.all(sections.map(async (section) => {
          const { data: content, error: contentError } = await supabase
            .from('site_content')
            .select('*')
            .eq('section', section.section_name);
          
          if (contentError) throw contentError;

          // Return section with its content that we'll use as "fields"
          return {
            ...section,
            content,
            // Add fields property to fix the type error in SiteMapTab
            fields: content
          };
        }));

        return {
          ...page,
          sections: sectionsWithContent
        };
      }));

      return pagesWithSections;
    },
  });
};

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
  hero: [
    'title',
    'subtitle',
    'description',
    'button_text',
    'button_url',
    'background_image',
    'primary_image',
  ],
  cta: [
    'title',
    'description',
    'button_text',
    'button_url',
  ],
  intro: [
    'title',
    'subtitle',
    'content',
    'image_url',
  ],
  features: [
    'title',
    'subtitle',
    'features_list',
    'description',
  ],
  alternating: [
    'title',
    'features',
    'description',
  ],
  benefits: [
    'title',
    'subtitle',
    'benefits_list',
  ],
  comparison: [
    'title',
    'description',
    'comparison_items',
  ],
  testimonials: [
    'title',
    'subtitle',
    'testimonials_list',
  ],
  clients: [
    'title',
    'subtitle',
    'logos',
  ],
  cases: [
    'title',
    'subtitle',
    'case_studies',
  ],
  header: [
    'site_title',
    'logo_image',
    'navigation_style',
    'search_placeholder'
  ],
  footer: [
    'company_name',
    'company_description',
    'copyright_text',
    'contact_email',
    'social_media_links',
    'quick_links'
  ],
  // Add additional field type mappings as needed
};

// Font style options for text formatting
export const fontStyleOptions = {
  fonts: [
    { label: 'System Default', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' },
    { label: 'Sans Serif', value: 'sans-serif' },
    { label: 'Serif', value: 'serif' },
    { label: 'Monospace', value: 'monospace' },
    { label: 'Cursive', value: 'cursive' },
  ],
  fontSizes: [
    { label: 'XS', value: 'text-xs' },
    { label: 'SM', value: 'text-sm' },
    { label: 'Base', value: 'text-base' },
    { label: 'LG', value: 'text-lg' },
    { label: 'XL', value: 'text-xl' },
    { label: '2XL', value: 'text-2xl' },
    { label: '3XL', value: 'text-3xl' },
    { label: '4XL', value: 'text-4xl' },
    { label: '5XL', value: 'text-5xl' },
    { label: '6XL', value: 'text-6xl' },
  ],
  fontWeights: [
    { label: 'Thin', value: 'font-thin' },
    { label: 'Light', value: 'font-light' },
    { label: 'Normal', value: 'font-normal' },
    { label: 'Medium', value: 'font-medium' },
    { label: 'SemiBold', value: 'font-semibold' },
    { label: 'Bold', value: 'font-bold' },
    { label: 'ExtraBold', value: 'font-extrabold' },
  ],
  textAlignment: [
    { label: 'Left', value: 'text-left' },
    { label: 'Center', value: 'text-center' },
    { label: 'Right', value: 'text-right' },
    { label: 'Justify', value: 'text-justify' },
  ],
  textDecorations: [
    { label: 'Underline', value: 'underline' },
    { label: 'Line-through', value: 'line-through' },
    { label: 'None', value: 'no-underline' },
  ],
  textTransforms: [
    { label: 'Uppercase', value: 'uppercase' },
    { label: 'Lowercase', value: 'lowercase' },
    { label: 'Capitalize', value: 'capitalize' },
    { label: 'Normal', value: 'normal-case' },
  ],
  colors: [
    { label: 'Default', value: 'text-foreground' },
    { label: 'Primary', value: 'text-primary' },
    { label: 'Secondary', value: 'text-secondary' },
    { label: 'Muted', value: 'text-muted-foreground' },
    { label: 'Accent', value: 'text-accent-foreground' },
    { label: 'Gray', value: 'text-gray-500' },
    { label: 'Red', value: 'text-red-500' },
    { label: 'Orange', value: 'text-orange-500' },
    { label: 'Amber', value: 'text-amber-500' },
    { label: 'Yellow', value: 'text-yellow-500' },
    { label: 'Lime', value: 'text-lime-500' },
    { label: 'Green', value: 'text-green-500' },
    { label: 'Emerald', value: 'text-emerald-500' },
    { label: 'Teal', value: 'text-teal-500' },
    { label: 'Cyan', value: 'text-cyan-500' },
    { label: 'Sky', value: 'text-sky-500' },
    { label: 'Blue', value: 'text-blue-500' },
    { label: 'Indigo', value: 'text-indigo-500' },
    { label: 'Violet', value: 'text-violet-500' },
    { label: 'Purple', value: 'text-purple-500' },
    { label: 'Fuchsia', value: 'text-fuchsia-500' },
    { label: 'Pink', value: 'text-pink-500' },
    { label: 'Rose', value: 'text-rose-500' },
  ],
  spacings: [
    { label: '0', value: 'leading-none' },
    { label: 'Tight', value: 'leading-tight' },
    { label: 'Snug', value: 'leading-snug' },
    { label: 'Normal', value: 'leading-normal' },
    { label: 'Relaxed', value: 'leading-relaxed' },
    { label: 'Loose', value: 'leading-loose' },
  ],
};

// Helper function to determine the input type based on field type
export const getFieldInputType = (fieldName: string) => {
  if (!fieldName) return 'text';
  
  if (fieldName.includes('image') || fieldName.includes('photo') || fieldName.includes('avatar') || fieldName.includes('logo')) {
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
  } else if (fieldName.includes('rich_text') || fieldName.includes('richtext') || fieldName.includes('rich-text')) {
    return 'rich_text';
  } else if (fieldName.includes('list')) {
    return 'list';
  } else if (fieldName.includes('style')) {
    return 'json';
  } else if (fieldName.includes('title')) {
    return 'text';
  } else if (fieldName.includes('subtitle')) {
    return 'text';
  } else if (fieldName.includes('name')) {
    return 'text';
  } else if (fieldName.includes('features')) {
    return 'json';
  } else if (fieldName.includes('testimonials')) {
    return 'json';
  } else if (fieldName.includes('copyright')) {
    return 'text';
  } else if (fieldName.includes('social_media')) {
    return 'json';
  } else if (fieldName.includes('quick_links')) {
    return 'json';
  } else {
    return 'text';
  }
};

// Get font style classes from stored styles
export const getFontStyleClasses = (fontStyle: any): string => {
  if (!fontStyle || typeof fontStyle !== 'object') return '';
  
  let classes: string[] = [];
  
  if (fontStyle.fontSize) classes.push(fontStyle.fontSize);
  if (fontStyle.fontWeight) classes.push(fontStyle.fontWeight);
  if (fontStyle.textAlign) classes.push(fontStyle.textAlign);
  if (fontStyle.textDecoration) classes.push(fontStyle.textDecoration);
  if (fontStyle.textTransform) classes.push(fontStyle.textTransform);
  if (fontStyle.textColor) classes.push(fontStyle.textColor);
  if (fontStyle.lineHeight) classes.push(fontStyle.lineHeight);
  
  return classes.join(' ');
};

// Get inline font style from stored styles
export const getInlineFontStyles = (fontStyle: any): React.CSSProperties => {
  if (!fontStyle || typeof fontStyle !== 'object') return {};
  
  let styles: React.CSSProperties = {};
  
  if (fontStyle.fontFamily) styles.fontFamily = fontStyle.fontFamily;
  if (fontStyle.customColor) styles.color = fontStyle.customColor;
  if (fontStyle.letterSpacing) styles.letterSpacing = fontStyle.letterSpacing;
  
  return styles;
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
export const useSiteConfig = (pageName?: string) => {
  return useQuery({
    queryKey: ['site_config', pageName],
    queryFn: async () => {
      const query = supabase.from('site_config').select('*');
      
      if (pageName) {
        query.eq('page', pageName);
      }
      
      const { data, error } = await query.order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: true, // Always enabled, even without pageName
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
        .from('navigation')
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

          // Return section with its content
          return {
            ...section,
            content,
            // Add fields property to reference the content
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

// Add new search function
export const useSearchContent = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      // First search site_content
      const { data: contentData, error: contentError } = await supabase
        .from('site_content')
        .select('*')
        .filter('include_in_global_search', 'eq', true)
        .ilike('content', `%${query}%`)
        .limit(20);
      
      if (contentError) throw contentError;
      
      // Then search articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .limit(20);
      
      if (articlesError) throw articlesError;
      
      // Then search projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20);
      
      if (projectsError) throw projectsError;
      
      // Format article results to match the expected structure
      const formattedArticles = (articlesData || []).map(article => ({
        id: `article-${article.id}`,
        content_id: article.id,
        section: 'articles',
        page: 'articles',
        field_type: 'article',
        content: article.content,
        title: article.title,
        excerpt: article.excerpt,
        is_article: true
      }));
      
      // Format project results to match the expected structure
      const formattedProjects = (projectsData || []).map(project => ({
        id: `project-${project.id}`,
        content_id: project.id,
        section: 'projects',
        page: 'projects',
        field_type: 'project',
        content: project.description,
        title: project.title,
        is_project: true
      }));
      
      return [...(contentData || []), ...formattedArticles, ...formattedProjects];
    },
    enabled: !!query.trim(),
  });
};

// Add a new hook for navigation menu
export const useNavigationMenu = () => {
  return useQuery({
    queryKey: ['navigation_menu'],
    queryFn: async () => {
      // First get pages that are visible and included in navigation
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('is_visible', true)
        .eq('include_in_navigation', true)
        .neq('page_name', 'admin')
        .order('display_order', { ascending: true });
      
      if (pagesError) throw pagesError;
      
      // Map pages to navigation items
      return pages.map(page => ({
        id: page.id,
        label: page.page_name,
        link: page.page_link || page.page_name.toLowerCase(),
        display_order: page.display_order,
        is_visible: page.is_visible,
        page_id: page.id,
        parent_id: null, // Root level items
        children: [] // Will be populated if we implement nested menus
      }));
    },
  });
};

// Add a hook for font style options
export const useFontStyleOptions = () => {
  return useQuery({
    queryKey: ['font_style_options'],
    queryFn: () => {
      return fontStyleOptions;
    }
  });
};

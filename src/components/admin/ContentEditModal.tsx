import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import StyledTextEditor from './StyledTextEditor';
import { useAdmin } from '@/context/AdminContext';

const contentSchema = z.object({
  id: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  content_type: z.string().min(1, "Content type is required"),
  field_type: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true)
});

const contentFieldTypesMap: Record<string, string[]> = {
  'hero_banner': ['hero_title', 'hero_subtitle', 'hero_description', 'hero_image_url', 'cta_button_text', 'cta_button_link'],
  'cta': ['cta_title', 'cta_description', 'cta_button_text', 'cta_button_link'],
  'intro': ['section_title', 'section_subtitle', 'section_description'],
  'feature_grid': ['features_title', 'features_list', 'feature_title', 'feature_description', 'feature_icon'],
  'alternating_feature': ['section_title', 'paragraph_1', 'paragraph_2', 'image_url', 'button_text', 'button_link'],
  'benefits_list': ['section_title', 'features_list'],
  'comparison_table': ['section_title', 'plan_name', 'plan_features', 'plan_price', 'billing_cycle'],
  'testimonial': ['testimonial_text', 'testimonial_author', 'testimonial_role', 'testimonial_company', 'testimonial_avatar_url'],
  'client_logos': ['section_title', 'logo_url'],
  'case_studies': ['section_title', 'post_title', 'post_excerpt', 'post_image_url', 'post_link'],
  'media_mentions': ['section_title', 'logo_url', 'post_link'],
  'product_showcase': ['services_title', 'services_list', 'image_url', 'description', 'button_text'],
  'pricing_table': ['pricing_title', 'plan_name', 'plan_price', 'plan_features', 'plan_cta_text', 'plan_cta_link', 'billing_cycle'],
  'stats': ['stat_title', 'stat_value', 'stat_description'],
  'milestones': ['milestone_name', 'milestone_date', 'milestone_description'],
  'blog_previews': ['post_title', 'post_excerpt', 'post_image_url', 'post_date', 'post_author', 'post_tags', 'post_link'],
  'faq': ['faq_question', 'faq_answer'],
  'contact_form': ['form_title', 'form_subtitle', 'form_name_label', 'form_email_label', 'form_message_label', 'form_submit_text', 'form_success_message', 'form_error_message'],
  'contact_info': ['contact_title', 'contact_description', 'contact_address', 'contact_email', 'contact_phone', 'map_embed_url'],
  'newsletter': ['section_title', 'form_email_label', 'form_submit_text'],
  'resume': ['education_title', 'education_list', 'education_institution', 'education_degree', 'education_year', 'experience_title', 'experience_list', 'job_title', 'company_name', 'job_duration', 'job_description'],
  'login_signup': ['form_title', 'form_name_label', 'form_email_label', 'form_submit_text'],
  'navigation': ['nav_links', 'nav_link_text', 'nav_link_url', 'logo_url'],
  'footer': ['footer_text', 'footer_links', 'sitemap_links', 'social_links'],
  'utility': ['language_options', 'theme_toggle_text'],
  'error_page': ['error_code', 'error_message'],
  'default': ['title', 'subtitle', 'description', 'content', 'image_url', 'button_text', 'button_link']
};

const contentInputTypeMap: Record<string, string> = {
  // Text fields
  'hero_title': 'short_text',
  'hero_subtitle': 'short_text',
  'hero_description': 'long_text',
  'cta_title': 'short_text',
  'cta_description': 'long_text',
  'section_title': 'short_text',
  'section_subtitle': 'short_text',
  'section_description': 'rich_text',
  'title': 'short_text',
  'subtitle': 'short_text', 
  'description': 'long_text',
  'content': 'rich_text',
  'paragraph_1': 'rich_text',
  'paragraph_2': 'rich_text',
  
  // URLs
  'hero_image_url': 'image',
  'image_url': 'image',
  'logo_url': 'image',
  'post_image_url': 'image',
  'testimonial_avatar_url': 'image',
  'map_embed_url': 'url',
  'post_link': 'url',
  'button_link': 'url',
  'cta_button_link': 'url',
  'plan_cta_link': 'url',
  'nav_link_url': 'url',
  
  // Buttons & CTAs
  'button_text': 'short_text',
  'cta_button_text': 'short_text',
  'form_submit_text': 'short_text',
  'plan_cta_text': 'short_text',
  
  // Lists
  'features_list': 'list_of_strings',
  'plan_features': 'list_of_strings',
  'education_list': 'list_of_objects',
  'experience_list': 'list_of_objects',
  'nav_links': 'list_of_objects',
  'footer_links': 'list_of_objects',
  'sitemap_links': 'list_of_objects',
  'social_links': 'list_of_objects',
  
  // Contact & Form fields
  'contact_email': 'email',
  'contact_phone': 'phone_number',
  'contact_address': 'long_text',
  'contact_title': 'short_text',
  'contact_description': 'long_text',
  'form_title': 'short_text',
  'form_subtitle': 'short_text',
  'form_name_label': 'short_text',
  'form_email_label': 'short_text',
  'form_message_label': 'short_text',
  'form_success_message': 'short_text',
  'form_error_message': 'short_text',
  
  // Others
  'testimonial_text': 'long_text',
  'testimonial_author': 'short_text',
  'testimonial_role': 'short_text',
  'testimonial_company': 'short_text',
  'feature_title': 'short_text',
  'feature_description': 'long_text',
  'feature_icon': 'icon_picker',
  'services_title': 'short_text',
  'services_list': 'list_of_objects',
  'plan_name': 'short_text',
  'plan_price': 'short_text',
  'billing_cycle': 'select',
  'pricing_title': 'short_text',
  'stat_title': 'short_text',
  'stat_value': 'short_text',
  'stat_description': 'short_text',
  'milestone_name': 'short_text',
  'milestone_date': 'date',
  'milestone_description': 'long_text',
  'post_title': 'short_text',
  'post_excerpt': 'long_text',
  'post_date': 'date',
  'post_author': 'short_text',
  'post_tags': 'list_of_strings',
  'faq_question': 'short_text',
  'faq_answer': 'rich_text',
  'education_title': 'short_text',
  'education_institution': 'short_text',
  'education_degree': 'short_text',
  'education_year': 'short_text',
  'experience_title': 'short_text',
  'job_title': 'short_text',
  'company_name': 'short_text',
  'job_duration': 'short_text',
  'job_description': 'long_text',
  'language_options': 'list_of_strings',
  'theme_toggle_text': 'short_text',
  'error_code': 'short_text',
  'error_message': 'short_text',
  'nav_link_text': 'short_text',
  'footer_text': 'rich_text'
};

export const ContentEditModal = ({
  isOpen,
  onClose,
  itemData,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  itemData: any | null;
  onSubmit: (data: any) => void;
}) => {
  const { selectedSection } = useAdmin();
  
  const form = useForm<any>({
    resolver: zodResolver(contentSchema),
    defaultValues: itemData || {
      section: selectedSection, // Default to selected section
      content_type: '',
      field_type: '',
      content: '',
      display_order: 0,
      is_visible: true
    },
  });

  const [currentFieldType, setCurrentFieldType] = React.useState<string>('');

  const { data: sections } = useQuery({
    queryKey: ['admin-sections-for-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('section_name, layout_type')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Get field types based on section layout
  const getFieldTypes = (sectionName: string) => {
    if (!sections) return contentFieldTypesMap['default'];
    
    const section = sections.find(s => s.section_name === sectionName);
    if (!section) return contentFieldTypesMap['default'];
    
    const layoutType = section.layout_type.toLowerCase().replace(/\s+/g, '_');
    return contentFieldTypesMap[layoutType] || contentFieldTypesMap['default'];
  };

  // Get input type for field
  const getInputType = (fieldType: string) => {
    return contentInputTypeMap[fieldType] || 'short_text';
  };

  React.useEffect(() => {
    if (isOpen) {
      const defaultData = itemData || {
        section: selectedSection, // Default to selected section
        content_type: '',
        field_type: '',
        content: '',
        display_order: 0,
        is_visible: true
      };
      form.reset(defaultData);
      
      if (itemData?.field_type) {
        setCurrentFieldType(getInputType(itemData.field_type));
      }
    }
  }, [form, itemData, isOpen, selectedSection]);

  const watchSection = form.watch('section');
  const watchFieldType = form.watch('field_type');
  
  React.useEffect(() => {
    if (watchFieldType) {
      const inputType = getInputType(watchFieldType);
      setCurrentFieldType(inputType);
    }
  }, [watchFieldType]);

  const handleSubmit = (data: any) => {
    // If field_type is not set, use content_type
    if (!data.field_type) {
      data.field_type = data.content_type;
    }
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{itemData?.id ? 'Edit Content Field' : 'Add Content Field'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections?.map((section) => (
                          <SelectItem key={section.section_name} value={section.section_name}>
                            {section.section_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="field_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Type</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('content_type', value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        {watchSection && getFieldTypes(watchSection).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the type of field based on section layout
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    {currentFieldType === 'rich_text' ? (
                      <StyledTextEditor 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    ) : currentFieldType === 'long_text' ? (
                      <Textarea 
                        {...field}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <Input {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Visible</FormLabel>
                    <FormDescription>Show this content on the website</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditModal;

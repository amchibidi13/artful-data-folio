
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import StyledTextEditor from './StyledTextEditor';

// Field type options by layout type
const fieldTypesByLayout: Record<string, string[]> = {
  'hero': ['hero_title', 'hero_subtitle', 'hero_description', 'hero_image_url', 'cta_button_text', 'cta_button_link'],
  'cta': ['cta_title', 'cta_description', 'cta_button_text', 'cta_button_link'],
  'intro': ['section_title', 'section_subtitle', 'section_description'],
  'features': ['features_title', 'features_list', 'feature_title', 'feature_description', 'feature_icon'],
  'alternating': ['section_title', 'paragraph_1', 'paragraph_2', 'image_url', 'button_text', 'button_link'],
  'benefits': ['section_title', 'benefits_list'],
  'comparison': ['section_title', 'plan_name', 'plan_features', 'plan_price', 'billing_cycle'],
  'testimonials': ['testimonial_text', 'testimonial_author', 'testimonial_role', 'testimonial_company', 'testimonial_avatar_url'],
  'clients': ['section_title', 'logo_url'],
  'cases': ['section_title', 'post_title', 'post_excerpt', 'post_image_url', 'post_link'],
  'media': ['section_title', 'logo_url', 'post_link'],
  'products': ['services_title', 'services_list', 'image_url', 'description', 'button_text'],
  'pricing': ['pricing_title', 'plan_name', 'plan_price', 'plan_features', 'plan_cta_text', 'plan_cta_link', 'billing_cycle'],
  'stats': ['stat_title', 'stat_value', 'stat_description'],
  'milestones': ['milestone_name', 'milestone_date', 'milestone_description'],
  'blog': ['post_title', 'post_excerpt', 'post_image_url', 'post_date', 'post_author', 'post_tags', 'post_link'],
  'faq': ['faq_question', 'faq_answer'],
  'contact_form': ['form_title', 'form_subtitle', 'form_name_label', 'form_email_label', 'form_message_label', 'form_submit_text', 'form_success_message', 'form_error_message'],
  'contact_info': ['contact_title', 'contact_description', 'contact_address', 'contact_email', 'contact_phone', 'map_embed_url'],
  'newsletter': ['section_title', 'form_email_label', 'form_submit_text'],
  'resume': ['education_title', 'education_list', 'education_institution', 'education_degree', 'education_year', 'experience_title', 'experience_list', 'job_title', 'company_name', 'job_duration', 'job_description'],
  'login': ['form_title', 'form_name_label', 'form_email_label', 'form_submit_text'],
  'navigation': ['nav_links', 'nav_link_text', 'nav_link_url', 'logo_url'],
  'footer': ['footer_text', 'footer_links', 'sitemap_links', 'social_links'],
  'utility': ['language_options', 'theme_toggle_text'],
  'error': ['error_code', 'error_message']
};

// Content format types
const contentFormatTypes = [
  { value: 'short_text', label: 'Short Text (single-line)' },
  { value: 'long_text', label: 'Long Text (multi-line)' },
  { value: 'rich_text', label: 'Rich Text (formatted)' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone_number', label: 'Phone Number' },
  { value: 'image', label: 'Image URL' },
  { value: 'video', label: 'Video URL/Embed' },
  { value: 'icon_picker', label: 'Icon' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date & Time' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean (Yes/No)' },
  { value: 'list_of_strings', label: 'List of Strings' },
  { value: 'list_of_objects', label: 'List of Objects' },
  { value: 'select', label: 'Select (Dropdown)' },
  { value: 'multi_select', label: 'Multi-Select' },
  { value: 'color_picker', label: 'Color Picker' },
  { value: 'map_location', label: 'Map Location' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'reference', label: 'Reference Link' }
];

const contentSchema = z.object({
  id: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  content_type: z.string().min(1, "Content type is required"),
  field_type: z.string().nullable().optional(),
  content: z.string().min(1, "Content is required"),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
  content_format: z.string().optional(),
});

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
  const [contentStyles, setContentStyles] = useState<Record<string, any>>({});
  const [selectedSectionLayout, setSelectedSectionLayout] = useState<string>('');
  
  const { data: sections } = useQuery({
    queryKey: ['all-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .order('section_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<any>({
    resolver: zodResolver(contentSchema),
    defaultValues: itemData || {
      section: '',
      content_type: '',
      field_type: '',
      content: '',
      display_order: 0,
      is_visible: true,
      content_format: 'short_text'
    },
  });

  const selectedSection = form.watch('section');
  const selectedFieldType = form.watch('field_type');
  
  // Update field type options when section changes
  useEffect(() => {
    if (selectedSection && sections) {
      const sectionConfig = sections.find(s => s.section_name === selectedSection);
      if (sectionConfig) {
        setSelectedSectionLayout(sectionConfig.layout_type);
      }
    }
  }, [selectedSection, sections]);
  
  // Reset form when itemData changes
  useEffect(() => {
    if (isOpen) {
      const defaultValues = itemData || {
        section: '',
        content_type: '',
        field_type: '',
        content: '',
        display_order: 0,
        is_visible: true,
        content_format: 'short_text'
      };
      
      form.reset(defaultValues);
      
      // Set the content type based on field type if it's a new item
      if (!itemData?.id && defaultValues.field_type && !defaultValues.content_type) {
        form.setValue('content_type', defaultValues.field_type);
      }
      
      // Reset content styles
      setContentStyles({});
    }
  }, [form, itemData, isOpen]);

  // Handle form submission
  const handleSubmit = (data: any) => {
    // Create a copy of the data without content_format which is just for the UI
    const { content_format, ...submissionData } = data;
    
    // Auto-generate content_type if it's empty
    if (!submissionData.content_type && submissionData.field_type) {
      submissionData.content_type = submissionData.field_type;
    }
    
    onSubmit(submissionData);

    // If we have content styles, also submit a style entry
    if (contentStyles && Object.keys(contentStyles).length > 0) {
      const styleData = {
        ...submissionData,
        content_type: `${submissionData.content_type}_style`,
        content: JSON.stringify(contentStyles),
      };
      onSubmit(styleData);
    }
  };

  // Get appropriate input component based on content format
  const renderContentInput = () => {
    const contentFormat = form.watch('content_format');
    
    switch(contentFormat) {
      case 'long_text':
        return (
          <Textarea 
            rows={5} 
            {...form.register('content')} 
          />
        );
      case 'rich_text':
        return (
          <StyledTextEditor 
            value={form.watch('content')}
            onChange={(value) => form.setValue('content', value)}
            currentStyle={contentStyles}
            onStyleChange={setContentStyles}
            rows={5}
          />
        );
      case 'color_picker':
        return (
          <Input 
            type="color" 
            {...form.register('content')} 
            className="h-10 w-full" 
          />
        );
      case 'date':
        return (
          <Input 
            type="date" 
            {...form.register('content')} 
          />
        );
      case 'datetime':
        return (
          <Input 
            type="datetime-local" 
            {...form.register('content')} 
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="content-boolean" 
              checked={form.watch('content') === 'true'} 
              onCheckedChange={(checked) => 
                form.setValue('content', checked ? 'true' : 'false')
              } 
            />
            <label htmlFor="content-boolean" className="text-sm font-medium">
              {form.watch('content') === 'true' ? 'Yes' : 'No'}
            </label>
          </div>
        );
      case 'number':
        return (
          <Input 
            type="number" 
            {...form.register('content')} 
          />
        );
      case 'list_of_strings':
        return (
          <Textarea 
            rows={3} 
            {...form.register('content')} 
            placeholder="Enter comma-separated values"
          />
        );
      // Add more format-specific inputs as needed
      default:
        return (
          <Input 
            {...form.register('content')} 
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset field_type when section changes
                      form.setValue('field_type', '');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {sections?.map(section => (
                        <SelectItem key={section.id} value={section.section_name}>
                          {section.section_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Auto-set content_type to match field_type for new entries
                      if (!itemData?.id) {
                        form.setValue('content_type', value);
                      }
                    }} 
                    defaultValue={field.value || ''}
                    disabled={!selectedSection}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedSection ? "Select section first" : "Select field type"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {selectedSectionLayout && fieldTypesByLayout[selectedSectionLayout]?.map((fieldType) => (
                        <SelectItem key={fieldType} value={fieldType}>
                          {fieldType}
                        </SelectItem>
                      ))}
                      {(!selectedSectionLayout || !fieldTypesByLayout[selectedSectionLayout]) && (
                        <SelectItem value="custom">custom</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of field based on section layout
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. title, subtitle, content" />
                  </FormControl>
                  <FormDescription>
                    Usually matches field type but can be customized
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'short_text'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {contentFormatTypes.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Determines how the content is edited and displayed
                  </FormDescription>
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
                    {renderContentInput()}
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

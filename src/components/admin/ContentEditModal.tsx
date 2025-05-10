
import React, { useEffect, useState } from 'react';
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
import { getFieldInputType, fieldTypeMappings } from '@/hooks/useSiteData';

// Updated schema with dynamic fields
const contentSchema = z.object({
  id: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  content_type: z.string().min(1, "Content type is required"),
  field_type: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
  // Additional fields based on field type will be validated dynamically
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
  const { selectedSection } = useAdmin();
  const [currentInputType, setCurrentInputType] = useState<string>('short_text');
  
  const form = useForm<any>({
    resolver: zodResolver(contentSchema),
    defaultValues: itemData || {
      section: selectedSection,
      content_type: '',
      field_type: '',
      content: '',
      display_order: 0,
      is_visible: true
    },
  });

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
    if (!sections) return ['title', 'subtitle', 'description'];
    
    const section = sections.find(s => s.section_name === sectionName);
    if (!section) return ['title', 'subtitle', 'description'];
    
    const layoutType = section.layout_type.toLowerCase().replace(/\s+/g, '_');
    return fieldTypeMappings[layoutType] || ['title', 'subtitle', 'description'];
  };

  useEffect(() => {
    if (isOpen) {
      const defaultData = itemData || {
        section: selectedSection,
        content_type: '',
        field_type: '',
        content: '',
        display_order: 0,
        is_visible: true
      };
      form.reset(defaultData);
      
      if (itemData?.field_type) {
        const inputType = getFieldInputType(itemData.field_type);
        setCurrentInputType(inputType);
      }
    }
  }, [form, itemData, isOpen, selectedSection]);

  const watchSection = form.watch('section');
  const watchFieldType = form.watch('field_type');
  
  useEffect(() => {
    if (watchFieldType) {
      const inputType = getFieldInputType(watchFieldType);
      setCurrentInputType(inputType);
    }
  }, [watchFieldType]);

  const renderDynamicField = () => {
    switch (currentInputType) {
      case 'short_text':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'long_text':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Content</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'rich_text':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rich Text Content</FormLabel>
                <FormControl>
                  <StyledTextEditor 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'image':
      case 'url':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{currentInputType === 'image' ? 'Image URL' : 'URL'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {currentInputType === 'image' ? 'Enter the URL to an image' : 'Enter a valid URL'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'list_of_strings':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>List Items</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  Enter items separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'date':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'email':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'phone_number':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'select':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Option</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'icon_picker':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Enter a valid icon name from Lucide icons
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'list_of_objects':
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>JSON Object List</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    className="min-h-[150px] font-mono text-sm"
                  />
                </FormControl>
                <FormDescription>
                  Enter JSON array of objects
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      default:
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

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
            
            {/* Dynamic content field based on field type */}
            {renderDynamicField()}
            
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

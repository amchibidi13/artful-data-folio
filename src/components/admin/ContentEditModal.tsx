
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import StyledTextEditor from './StyledTextEditor';
import { getFieldInputType } from '@/hooks/useSiteData';

const inputTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'rich_text', label: 'Rich Text Editor' },
  { value: 'image', label: 'Image URL' },
  { value: 'url', label: 'URL' },
  { value: 'list', label: 'List' },
  { value: 'json', label: 'JSON' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'color', label: 'Color' },
];

const contentSchema = z.object({
  id: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  content_type: z.string().min(1, "Content type is required"),
  field_type: z.string().nullable().optional(),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
  include_in_global_search: z.boolean().default(false),
  content: z.string().min(1, "Content is required"),
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
  const [inputType, setInputType] = useState('text');
  
  const form = useForm<any>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      section: '',
      content_type: '',
      field_type: '',
      display_order: 0,
      is_visible: true,
      include_in_global_search: false,
      content: '',
    },
  });

  const watchFieldType = form.watch('field_type');
  
  // Update inputType whenever field_type changes
  useEffect(() => {
    if (watchFieldType) {
      const detectedInputType = getFieldInputType(watchFieldType);
      setInputType(detectedInputType);
    }
  }, [watchFieldType]);

  useEffect(() => {
    if (isOpen) {
      const defaultValues = {
        section: '',
        content_type: '',
        field_type: '',
        display_order: 0,
        is_visible: true,
        include_in_global_search: false,
        content: '',
        ...itemData
      };
      
      form.reset(defaultValues);
      
      // Set input type based on field_type or content_type
      const typeToCheck = defaultValues.field_type || defaultValues.content_type;
      if (typeToCheck) {
        const detectedInputType = getFieldInputType(typeToCheck);
        setInputType(detectedInputType);
      }
    }
  }, [form, itemData, isOpen]);

  const handleSubmit = (data: any) => {
    // If field_type is not set but content_type is, use content_type as field_type
    if (!data.field_type && data.content_type) {
      data.field_type = data.content_type;
    }
    
    onSubmit(data);
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
              name="content_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. title, description, image_url" />
                  </FormControl>
                  <FormDescription>
                    Identifier for this content field
                  </FormDescription>
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
                    <Input 
                      {...field} 
                      value={field.value || ''} 
                      placeholder="e.g. title, description, image_url"
                    />
                  </FormControl>
                  <FormDescription>
                    Type of field (leave blank to use Content Type)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="input_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input Type</FormLabel>
                  <Select 
                    value={inputType} 
                    onValueChange={(value) => {
                      setInputType(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select input type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inputTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Type of input field to use for this content
                  </FormDescription>
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    {inputType === 'textarea' ? (
                      <Textarea {...field} className="min-h-[120px]" />
                    ) : inputType === 'rich_text' ? (
                      <StyledTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    ) : inputType === 'color' ? (
                      <Input
                        type="color"
                        {...field}
                        className="h-10 w-full"
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
            
            <FormField
              control={form.control}
              name="include_in_global_search"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include in Global Search</FormLabel>
                    <FormDescription>Make this content searchable in the site-wide search</FormDescription>
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

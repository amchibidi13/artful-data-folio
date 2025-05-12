
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getFieldInputType } from '@/hooks/useSiteData';
import StyledTextEditor from './StyledTextEditor';

const inputTypeOptions = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'rich_text', label: 'Rich Text' },
  { value: 'image', label: 'Image URL' },
  { value: 'url', label: 'URL' },
  { value: 'list', label: 'List of Strings' },
  { value: 'json', label: 'JSON List' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'select', label: 'Select' },
  { value: 'color', label: 'Color' }
];

const contentSchema = z.object({
  id: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  content_type: z.string().min(1, "Content type is required"),
  field_type: z.string().nullable().optional(),
  content: z.string().min(1, "Content is required"),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
  include_in_global_search: z.boolean().default(false),
  input_type: z.string().optional()
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
  const [contentStyles, setContentStyles] = React.useState<Record<string, any>>({});
  
  const form = useForm<any>({
    resolver: zodResolver(contentSchema),
    defaultValues: itemData || {
      section: '',
      content_type: '',
      field_type: '',
      content: '',
      display_order: 0,
      is_visible: true,
      include_in_global_search: false,
      input_type: 'text'
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      let defaultData = itemData || {
        section: '',
        content_type: '',
        field_type: '',
        content: '',
        display_order: 0,
        is_visible: true,
        include_in_global_search: false,
        input_type: 'text'
      };
      
      // If field_type is empty but content_type exists, use content_type as field_type
      if (!defaultData.field_type && defaultData.content_type) {
        defaultData.field_type = defaultData.content_type;
      }
      
      // Set input_type based on field_type if it's not already set
      if (!defaultData.input_type && defaultData.field_type) {
        defaultData.input_type = getFieldInputType(defaultData.field_type);
      }
      
      form.reset(defaultData);
    }
  }, [form, itemData, isOpen]);

  // Watch content_type and update field_type if it's empty
  const watchContentType = form.watch('content_type');
  React.useEffect(() => {
    if (watchContentType && !form.getValues('field_type')) {
      form.setValue('field_type', watchContentType);
      form.setValue('input_type', getFieldInputType(watchContentType));
    }
  }, [watchContentType, form]);

  const handleSubmit = (data: any) => {
    // Remove input_type as it's not stored in the database
    const { input_type, ...submitData } = data;
    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="content_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Type of content (e.g., title, subtitle)
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
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>
                      Type of field (e.g., short_text, long_text)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="input_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
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
                    Type of input field to use in the form
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
                  <Tabs defaultValue="content">
                    <TabsList className="mb-2">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="styling">Styling</TabsTrigger>
                    </TabsList>
                    <TabsContent value="content">
                      <FormControl>
                        {form.getValues('input_type') === 'textarea' || form.getValues('input_type') === 'rich_text' ? (
                          <Textarea 
                            rows={5} 
                            {...field}
                          />
                        ) : form.getValues('input_type') === 'json' ? (
                          <Textarea 
                            rows={10} 
                            {...field}
                          />
                        ) : (
                          <Input {...field} />
                        )}
                      </FormControl>
                    </TabsContent>
                    <TabsContent value="styling">
                      <div className="space-y-4">
                        <div>
                          <FormLabel>Text Styling</FormLabel>
                          <StyledTextEditor 
                            value={field.value}
                            onChange={field.onChange}
                            currentStyle={contentStyles}
                            onStyleChange={setContentStyles}
                            rows={5}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <FormDescription>Make this content searchable</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
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

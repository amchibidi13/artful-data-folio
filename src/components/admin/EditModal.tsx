import React, { useState, useEffect } from 'react';
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
import { EditModalProps } from '@/types/database-types';
import { useSiteConfig, useSiteContent } from '@/hooks/useSiteData';
import StyledTextEditor from './StyledTextEditor';

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, itemType, itemData, onSubmit }) => {
  // Get site config for section selection
  const { data: siteConfig } = useSiteConfig();
  // Get site content for styles
  const { data: siteContentData } = useSiteContent();
  
  // Add state for styles
  const [contentStyles, setContentStyles] = useState<Record<string, any>>({});
  
  // Define schemas for different item types
  const sectionSchema = z.object({
    id: z.string().optional(),
    section_name: z.string().min(1, "Section name is required"),
    display_order: z.coerce.number().default(0),
    is_visible: z.boolean().default(true),
    layout_type: z.string().min(1, "Layout type is required"),
    page: z.string().default('home')
  });

  const contentSchema = z.object({
    id: z.string().optional(),
    section: z.string().min(1, "Section is required"),
    content_type: z.string().min(1, "Content type is required"),
    content: z.string().min(1, "Content is required"),
    display_order: z.coerce.number().default(0),
    is_visible: z.boolean().default(true),
    style: z.string().optional()
  });

  const navigationSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, "Label is required"),
    target_section: z.string().min(1, "Target section is required"),
    display_order: z.coerce.number().default(0),
    button_type: z.string().min(1, "Button type is required"),
    is_visible: z.boolean().default(true)
  });

  const projectSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image_url: z.string().min(1, "Image URL is required"),
    tags: z.string().transform((val) => val.split(',').map(tag => tag.trim())),
    link: z.string().optional().nullable()
  });

  const articleSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().min(1, "Content is required"),
    read_time: z.coerce.number().default(5),
    date: z.string().optional(),
    link: z.string().optional().nullable()
  });

  // Select the appropriate schema based on itemType
  let schema;
  switch (itemType) {
    case 'section':
      schema = sectionSchema;
      break;
    case 'content':
      schema = contentSchema;
      break;
    case 'navigation':
      schema = navigationSchema;
      break;
    case 'project':
      schema = projectSchema;
      break;
    case 'article':
      schema = articleSchema;
      break;
    default:
      schema = sectionSchema;
  }

  // Process itemData to ensure it's in the correct format
  const processedItemData = React.useMemo(() => {
    if (!itemData) return {};
    
    // For projects, convert tags array to comma-separated string for form
    if (itemType === 'project' && Array.isArray(itemData.tags)) {
      return {
        ...itemData,
        tags: itemData.tags.join(', ')
      };
    }
    
    // For content items, extract style if it exists
    if (itemType === 'content' && itemData.content_type && itemData.content_type.endsWith('_style')) {
      try {
        const styleContent = JSON.parse(itemData.content);
        setContentStyles(styleContent);
      } catch (e) {
        console.log('Could not parse style:', e);
      }
    }
    
    return itemData;
  }, [itemData, itemType]);

  // Initialize the form
  const form = useForm<any>({
    resolver: zodResolver(schema as any),
    defaultValues: processedItemData || {},
    mode: 'onChange',
  });

  // Reset form when itemData changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset(processedItemData || {});
      
      // Also reset content styles
      if (itemType === 'content' && itemData?.content_type === 'content') {
        try {
          const sectionName = itemData.section;
          const styleContent = siteContentData?.find(s => 
            s.section === sectionName && s.content_type === 'content_style'
          )?.content;
          
          if (styleContent) {
            setContentStyles(JSON.parse(styleContent));
          } else {
            setContentStyles({});
          }
        } catch (e) {
          console.log('Could not parse style:', e);
          setContentStyles({});
        }
      } else {
        setContentStyles({});
      }
    }
  }, [form, processedItemData, isOpen, itemType, itemData, siteContentData]);

  // Handle form submission
  const handleSubmit = (data: any) => {
    // Ensure required fields are present
    try {
      // Add style information if necessary
      if (itemType === 'content' && contentStyles && Object.keys(contentStyles).length > 0) {
        // If this is a content field and we have styles, create a style entry
        const styleData = {
          ...data,
          content_type: `${data.content_type}_style`,
          content: JSON.stringify(contentStyles)
        };
        
        // Submit both the content and its style
        schema.parse(data);
        onSubmit(data);
        onSubmit(styleData);
      } else {
        // Normal submission
        schema.parse(data);
        onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error("Validation error:", error);
      // Form validation will handle displaying errors
    }
  };

  // Get form title
  const getTitle = () => {
    const actionText = itemData?.id ? "Edit" : "Add New";
    const itemTypeName = itemType.charAt(0).toUpperCase() + itemType.slice(1);
    return `${actionText} ${itemTypeName}`;
  };

  // Render form fields based on itemType
  const renderFormFields = () => {
    switch (itemType) {
      case 'section':
        return (
          <>
            <FormField
              control={form.control}
              name="section_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="layout_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layout Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="cards">Cards</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="page"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'home'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select page" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                      <SelectItem value="custom">Custom Page</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify which page this section belongs to. Use 'home' for the main page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Visible</FormLabel>
                    <FormDescription>Show this section on the website</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </>
        );
      case 'content':
        return (
          <>
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {siteConfig?.map(section => (
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
              name="content_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Examples: title, subtitle, paragraph, list, image_url, etc.
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
                        <StyledTextEditor 
                          value={field.value}
                          onChange={field.onChange}
                          currentStyle={contentStyles}
                          rows={5}
                        />
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
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
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
          </>
        );
        
      case 'navigation':
        return (
          <>
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Section</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {siteConfig?.map(section => (
                        <SelectItem key={section.id} value={section.section_name}>
                          {section.section_name}
                        </SelectItem>
                      ))}
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="external">External Link</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="button_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select button type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="button">Button</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Visible</FormLabel>
                    <FormDescription>Show this navigation item</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </>
        );
      case 'project':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of tags (e.g., React, TypeScript, UI)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>URL to the project</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 'article':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
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
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="read_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Read Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 5)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>URL to the full article</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {renderFormFields()}
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

export default EditModal;

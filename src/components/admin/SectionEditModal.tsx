import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const layoutOptions = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'cta', label: 'Call to Action (CTA)' },
  { value: 'intro', label: 'Intro / Mission Statement' },
  { value: 'features', label: 'Feature Grid' },
  { value: 'alternating', label: 'Alternating Feature Sections' },
  { value: 'benefits', label: 'Benefits List' },
  { value: 'comparison', label: 'Comparison Table / Pricing Comparison' },
  { value: 'testimonials', label: 'Testimonial Section' },
  { value: 'clients', label: 'Client Logos / Trusted By' },
  { value: 'cases', label: 'Case Studies / Success Stories' },
  { value: 'media', label: 'Media Mentions' },
  { value: 'products', label: 'Product Showcase / Service Overview' },
  { value: 'pricing', label: 'Pricing Table' },
  { value: 'stats', label: 'Stats / Metrics' },
  { value: 'milestones', label: 'Milestones / Progress' },
  { value: 'blog', label: 'Blog Previews / Articles' },
  { value: 'faq', label: 'FAQ Section' },
  { value: 'contact_form', label: 'Contact Form' },
  { value: 'contact_info', label: 'Contact Info + Map' },
  { value: 'newsletter', label: 'Newsletter Signup' },
  { value: 'resume', label: 'Resume / Education / Experience' },
  { value: 'login', label: 'Login / Signup' },
  { value: 'navigation', label: 'Navigation Bar' },
  { value: 'footer', label: 'Footer / Sitemap' },
  { value: 'utility', label: 'Utility / Settings' },
  { value: 'error', label: '404 / Error Page' },
  { value: 'gallery', label: 'Image Gallery' },
  { value: 'video', label: 'Video Section' },
  { value: 'portfolio', label: 'Portfolio Showcase' },
  { value: 'team', label: 'Team Members' },
  { value: 'timeline', label: 'Timeline' }
];

const sectionSchema = z.object({
  id: z.string().optional(),
  section_name: z.string().min(1, "Section name is required"),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
  layout_type: z.string().min(1, "Layout type is required"),
  page: z.string().min(1, "Page is required"),
  background_color: z.string().nullable().optional(),
  background_image: z.string().nullable().optional()
});

export const SectionEditModal = ({
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
  const form = useForm<any>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      section_name: '',
      display_order: 0,
      is_visible: true,
      layout_type: 'hero',
      page: 'home',
      background_color: null,
      background_image: null
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      const defaultValues = {
        section_name: '',
        display_order: 0,
        is_visible: true,
        layout_type: 'hero',
        page: 'home',
        background_color: null,
        background_image: null,
        ...itemData
      };
      
      form.reset(defaultValues);
    }
  }, [form, itemData, isOpen]);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{itemData?.id ? 'Edit Section' : 'Add Section'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              name="page"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select page" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the page where this section will appear
                  </FormDescription>
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {layoutOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="background_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="color" 
                      {...field} 
                      value={field.value || '#ffffff'} 
                      onChange={(e) => field.onChange(e.target.value === '#ffffff' ? null : e.target.value)} 
                      className="h-10 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="background_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ''} 
                      onChange={(e) => field.onChange(e.target.value || null)} 
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
                    <FormDescription>Show this section on the website</FormDescription>
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

export default SectionEditModal;

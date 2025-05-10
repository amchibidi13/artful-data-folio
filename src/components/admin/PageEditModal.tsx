
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const pageSchema = z.object({
  id: z.string().optional(),
  page_name: z.string().min(1, "Page name is required"),
  page_link: z.string().min(1, "Page link is required"),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
  is_system_page: z.boolean().default(false)
});

export const PageEditModal = ({
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
    resolver: zodResolver(pageSchema),
    defaultValues: itemData || {
      page_name: '',
      page_link: '',
      display_order: 0,
      is_visible: true,
      is_system_page: false
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      const defaultData = itemData || {
        page_name: '',
        page_link: '',
        display_order: 0,
        is_visible: true,
        is_system_page: false
      };
      
      // If new page or page_link is empty, set it from page_name
      if (!itemData?.id && !defaultData.page_link) {
        defaultData.page_link = defaultData.page_name.toLowerCase();
      }
      
      form.reset(defaultData);
    }
  }, [form, itemData, isOpen]);

  // When page name changes, update the link if it's a new page
  const watchPageName = form.watch('page_name');
  React.useEffect(() => {
    if (!itemData?.id && watchPageName) {
      form.setValue('page_link', watchPageName.toLowerCase().replace(/\s+/g, '-'));
    }
  }, [watchPageName, form, itemData]);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{itemData?.id ? 'Edit Page' : 'Add Page'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="page_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={itemData?.is_system_page} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="page_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Link</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={itemData?.is_system_page} />
                  </FormControl>
                  <FormDescription>
                    This will be used in the URL (e.g., /about)
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
                    <FormDescription>Show this page on the website</FormDescription>
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

export default PageEditModal;

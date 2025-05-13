
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the schema for navigation menu items
const navigationItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  link: z.string().min(1, "Link is required"),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
  page_id: z.string().optional(),
});

const NavigationMenuTab: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // Query for pages
  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .neq('page_name', 'admin')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
  
  // Query for navigation menu items
  const { data: navigationItems, isLoading: navigationItemsLoading } = useQuery({
    queryKey: ['navigation_menu'],
    queryFn: async () => {
      // Get pages that are visible and included in navigation
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
        page_id: page.id
      }));
    },
  });
  
  // Form for editing navigation items
  const form = useForm<any>({
    resolver: zodResolver(navigationItemSchema),
    defaultValues: {
      label: '',
      link: '',
      display_order: 0,
      is_visible: true,
      page_id: '',
    },
  });
  
  // Mutation for updating pages (include_in_navigation)
  const updatePageMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('pages')
        .update({
          include_in_navigation: data.include_in_navigation,
          display_order: data.display_order
        })
        .eq('id', data.id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['navigation_menu'] });
      toast({
        title: "Navigation Updated",
        description: "Navigation menu has been updated",
      });
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update navigation: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle opening edit modal
  const handleEdit = (item: any) => {
    setCurrentItem(item);
    form.reset({
      id: item.id,
      label: item.label,
      link: item.link,
      display_order: item.display_order,
      is_visible: item.is_visible,
      page_id: item.page_id,
    });
    setIsEditModalOpen(true);
  };
  
  // Handle adding new navigation item
  const handleAdd = () => {
    setCurrentItem(null);
    form.reset({
      label: '',
      link: '',
      display_order: navigationItems?.length || 0,
      is_visible: true,
      page_id: '',
    });
    setIsEditModalOpen(true);
  };
  
  // Handle form submission
  const onSubmit = (data: any) => {
    // Find the page associated with the form
    const page = pages?.find(p => p.id === data.page_id);
    
    if (page) {
      updatePageMutation.mutate({
        id: page.id,
        include_in_navigation: true,
        display_order: data.display_order,
      });
    } else {
      toast({
        title: "Error",
        description: "No page selected",
        variant: "destructive",
      });
    }
  };
  
  // Handle removing from navigation
  const handleRemoveFromNavigation = (item: any) => {
    updatePageMutation.mutate({
      id: item.id,
      include_in_navigation: false,
      display_order: item.display_order,
    });
  };
  
  // Handle changing display order
  const handleMoveUp = (index: number) => {
    if (index === 0 || !navigationItems) return;
    
    const currentItem = navigationItems[index];
    const prevItem = navigationItems[index - 1];
    
    updatePageMutation.mutate({
      id: currentItem.id,
      include_in_navigation: true,
      display_order: prevItem.display_order,
    });
    
    updatePageMutation.mutate({
      id: prevItem.id,
      include_in_navigation: true,
      display_order: currentItem.display_order,
    });
  };
  
  const handleMoveDown = (index: number) => {
    if (!navigationItems || index >= navigationItems.length - 1) return;
    
    const currentItem = navigationItems[index];
    const nextItem = navigationItems[index + 1];
    
    updatePageMutation.mutate({
      id: currentItem.id,
      include_in_navigation: true,
      display_order: nextItem.display_order,
    });
    
    updatePageMutation.mutate({
      id: nextItem.id,
      include_in_navigation: true,
      display_order: currentItem.display_order,
    });
  };
  
  // Watching page_id to auto-populate label and link
  const watchPageId = form.watch('page_id');
  React.useEffect(() => {
    if (watchPageId && pages) {
      const selectedPage = pages.find(p => p.id === watchPageId);
      if (selectedPage) {
        form.setValue('label', selectedPage.page_name);
        form.setValue('link', selectedPage.page_link || selectedPage.page_name.toLowerCase());
      }
    }
  }, [watchPageId, pages, form]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Navigation Menu</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add to Navigation
        </Button>
      </div>
      
      <Table>
        <TableCaption>Navigation menu items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Display Order</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {navigationItemsLoading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </TableCell>
            </TableRow>
          ) : navigationItems && navigationItems.length > 0 ? (
            navigationItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.display_order}</TableCell>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell>{item.link}</TableCell>
                <TableCell>{item.is_visible ? 'Visible' : 'Hidden'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFromNavigation(item)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMoveDown(index)}
                      disabled={!navigationItems || index >= navigationItems.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No navigation items found. Add pages to navigation using the "Add to Navigation" button.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentItem ? 'Edit Navigation Item' : 'Add to Navigation'}
            </DialogTitle>
            <DialogDescription>
              Manage which pages appear in the navigation menu
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="page_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a page" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pages?.map((page) => (
                          <SelectItem key={page.id} value={page.id}>
                            {page.page_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select which page to add to navigation
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
                    <FormDescription>
                      Order in which this item appears in the navigation menu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavigationMenuTab;

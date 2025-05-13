
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { SiteContent } from '@/types/database-types';

export const HeaderTab = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    siteTitle: '',
    searchPlaceholder: '',
    adminButtonText: ''
  });

  const { data: headerContent, isLoading } = useQuery({
    queryKey: ['header-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'header');

      if (error) throw error;
      return data as SiteContent[];
    },
  });

  // Initialize form data when content is loaded
  React.useEffect(() => {
    if (headerContent) {
      const siteTitleContent = headerContent.find(item => item.content_type === 'site_title');
      const searchPlaceholderContent = headerContent.find(item => item.content_type === 'search_placeholder');
      const adminButtonContent = headerContent.find(item => item.content_type === 'admin_button_text');

      setFormData({
        siteTitle: siteTitleContent?.content || 'MyWebsite',
        searchPlaceholder: searchPlaceholderContent?.content || 'Search...',
        adminButtonText: adminButtonContent?.content || 'Admin'
      });
    }
  }, [headerContent]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string, content: string }) => {
      const { error } = await supabase
        .from('site_content')
        .update({ content })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast({
        title: 'Header updated',
        description: 'Header content has been successfully updated.'
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update header: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (headerContent) {
      const updates = [];
      const siteTitleContent = headerContent.find(item => item.content_type === 'site_title');
      const searchPlaceholderContent = headerContent.find(item => item.content_type === 'search_placeholder');
      const adminButtonContent = headerContent.find(item => item.content_type === 'admin_button_text');

      // Collect all updates
      if (siteTitleContent && siteTitleContent.content !== formData.siteTitle) {
        updates.push({ id: siteTitleContent.id, content: formData.siteTitle });
      }
      if (searchPlaceholderContent && searchPlaceholderContent.content !== formData.searchPlaceholder) {
        updates.push({ id: searchPlaceholderContent.id, content: formData.searchPlaceholder });
      }
      if (adminButtonContent && adminButtonContent.content !== formData.adminButtonText) {
        updates.push({ id: adminButtonContent.id, content: formData.adminButtonText });
      }

      // Process all updates
      for (const update of updates) {
        await updateMutation.mutateAsync(update);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Header Settings</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? 'Cancel' : 'Edit Header'}
        </Button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Website Title</Label>
            <Input
              id="siteTitle"
              name="siteTitle"
              value={formData.siteTitle}
              onChange={handleChange}
              placeholder="Website Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="searchPlaceholder">Search Box Placeholder</Label>
            <Input
              id="searchPlaceholder"
              name="searchPlaceholder"
              value={formData.searchPlaceholder}
              onChange={handleChange}
              placeholder="Search..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminButtonText">Admin Button Text</Label>
            <Input
              id="adminButtonText"
              name="adminButtonText"
              value={formData.adminButtonText}
              onChange={handleChange}
              placeholder="Admin"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Header Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Website Title:</div>
                <div>{formData.siteTitle}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Search Placeholder:</div>
                <div>{formData.searchPlaceholder}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Admin Button Text:</div>
                <div>{formData.adminButtonText}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HeaderTab;


import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { SiteContent } from '@/types/database-types';

export const FooterTab = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    copyrightText: '',
    contactEmail: ''
  });

  const { data: footerContent, isLoading } = useQuery({
    queryKey: ['footer-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'footer');

      if (error) throw error;
      return data as SiteContent[];
    },
  });

  // Initialize form data when content is loaded
  React.useEffect(() => {
    if (footerContent) {
      const companyNameContent = footerContent.find(item => item.content_type === 'company_name');
      const companyDescContent = footerContent.find(item => item.content_type === 'company_description');
      const copyrightContent = footerContent.find(item => item.content_type === 'copyright_text');
      const emailContent = footerContent.find(item => item.content_type === 'contact_email');

      setFormData({
        companyName: companyNameContent?.content || 'DataFolio',
        companyDescription: companyDescContent?.content || 'A portfolio showcasing data science projects, articles, and insights.',
        copyrightText: copyrightContent?.content || `© ${new Date().getFullYear()} DataFolio. All rights reserved.`,
        contactEmail: emailContent?.content || 'contact@example.com'
      });
    }
  }, [footerContent]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string, content: string }) => {
      const { error } = await supabase
        .from('site_content')
        .update({ content })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast({
        title: 'Footer updated',
        description: 'Footer content has been successfully updated.'
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update footer: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (footerContent) {
      const companyNameContent = footerContent.find(item => item.content_type === 'company_name');
      const companyDescContent = footerContent.find(item => item.content_type === 'company_description');
      const copyrightContent = footerContent.find(item => item.content_type === 'copyright_text');
      const emailContent = footerContent.find(item => item.content_type === 'contact_email');

      // Update company name if it exists and has changed
      if (companyNameContent && companyNameContent.content !== formData.companyName) {
        updateMutation.mutate({ id: companyNameContent.id, content: formData.companyName });
      }

      // Update company description if it exists and has changed
      if (companyDescContent && companyDescContent.content !== formData.companyDescription) {
        updateMutation.mutate({ id: companyDescContent.id, content: formData.companyDescription });
      }

      // Update copyright text if it exists and has changed
      if (copyrightContent && copyrightContent.content !== formData.copyrightText) {
        updateMutation.mutate({ id: copyrightContent.id, content: formData.copyrightText });
      }

      // Update contact email if it exists and has changed
      if (emailContent && emailContent.content !== formData.contactEmail) {
        updateMutation.mutate({ id: emailContent.id, content: formData.contactEmail });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <h2 className="text-xl font-semibold">Footer Settings</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? 'Cancel' : 'Edit Footer'}
        </Button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyDescription">Company Description</Label>
            <Textarea
              id="companyDescription"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              placeholder="Company Description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="copyrightText">Copyright Text</Label>
            <Input
              id="copyrightText"
              name="copyrightText"
              value={formData.copyrightText}
              onChange={handleChange}
              placeholder="© 2025 Company Name. All rights reserved."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contact@example.com"
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
              <CardTitle>Current Footer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Company Name:</div>
                <div>{formData.companyName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Company Description:</div>
                <div>{formData.companyDescription}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Copyright Text:</div>
                <div>{formData.copyrightText}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Contact Email:</div>
                <div>{formData.contactEmail}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FooterTab;

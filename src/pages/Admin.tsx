
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteConfigInsert, SiteContentInsert, NavigationItemInsert } from '@/types/database-types';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { AdminProvider } from '@/context/AdminContext';

// Import our new components
import SiteTab from '@/components/admin/SiteTab';
import PageTab from '@/components/admin/PageTab';
import SectionTab from '@/components/admin/SectionTab';
import SiteMapTab from '@/components/admin/SiteMapTab';
import HelpTab from '@/components/admin/HelpTab';
import PageEditModal from '@/components/admin/PageEditModal';
import SectionEditModal from '@/components/admin/SectionEditModal';
import ContentEditModal from '@/components/admin/ContentEditModal';

// Table name type to ensure we only use valid table names
type TableName = 'site_config' | 'site_content' | 'navigation' | 'projects' | 'articles' | 'pages';
type ItemType = 'page' | 'section' | 'content' | 'navigation' | 'project' | 'article';

// Map item types to table names
const getTableName = (itemType: ItemType): TableName => {
  switch (itemType) {
    case 'page':
      return 'pages';
    case 'section':
      return 'site_config';
    case 'content':
      return 'site_content';
    case 'navigation':
      return 'navigation';
    case 'project':
      return 'projects';
    case 'article':
      return 'articles';
    default:
      throw new Error('Invalid item type');
  }
};

const Admin: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  // Modal state
  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  
  const [currentItemType, setCurrentItemType] = useState<ItemType>('page');
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{itemType: ItemType, id: string} | null>(null);

  // Mutations for deleting items
  const deleteMutation = useMutation({
    mutationFn: async ({ itemType, id }: { itemType: ItemType, id: string }) => {
      const tableName = getTableName(itemType);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries based on the item type
      switch (variables.itemType) {
        case 'page':
          queryClient.invalidateQueries({ queryKey: ['pages'] });
          break;
        case 'section':
          queryClient.invalidateQueries({ queryKey: ['admin-site-config'] });
          queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
          queryClient.invalidateQueries({ queryKey: ['admin-sections-for-dropdown'] });
          queryClient.invalidateQueries({ queryKey: ['site-config'] });
          queryClient.invalidateQueries({ queryKey: ['site-structure'] });
          break;
        case 'content':
          queryClient.invalidateQueries({ queryKey: ['admin-site-content'] });
          queryClient.invalidateQueries({ queryKey: ['admin-content'] });
          queryClient.invalidateQueries({ queryKey: ['site-content'] });
          queryClient.invalidateQueries({ queryKey: ['site-structure'] });
          break;
        case 'navigation':
          queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
          queryClient.invalidateQueries({ queryKey: ['navigation'] });
          break;
        case 'project':
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
          queryClient.invalidateQueries({ queryKey: ['projects'] });
          break;
        case 'article':
          queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
          queryClient.invalidateQueries({ queryKey: ['articles'] });
          break;
      }
      
      toast({
        title: "Item Deleted",
        description: "Successfully deleted item",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete item: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutations for pages
  const pageMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Add new page
        const { error } = await supabase
          .from('pages')
          .insert([data]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['site-structure'] });
      toast({
        title: currentItem?.id ? "Page Updated" : "Page Added",
        description: `Successfully ${currentItem?.id ? "updated" : "added"} page.`,
      });
      setPageModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentItem?.id ? "update" : "add"} page: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutations for sections
  const sectionMutation = useMutation({
    mutationFn: async (data: SiteConfigInsert) => {
      if (data.id) {
        // Update existing section
        const { error } = await supabase
          .from('site_config')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Add new section
        const { error } = await supabase
          .from('site_config')
          .insert([data]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-config'] });
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      queryClient.invalidateQueries({ queryKey: ['admin-sections-for-dropdown'] });
      queryClient.invalidateQueries({ queryKey: ['site-config'] });
      queryClient.invalidateQueries({ queryKey: ['site-structure'] });
      toast({
        title: currentItem?.id ? "Section Updated" : "Section Added",
        description: `Successfully ${currentItem?.id ? "updated" : "added"} section.`,
      });
      setSectionModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentItem?.id ? "update" : "add"} section: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutations for content
  const contentMutation = useMutation({
    mutationFn: async (data: SiteContentInsert) => {
      if (data.id) {
        // Update existing content
        const { error } = await supabase
          .from('site_content')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Add new content
        const { error } = await supabase
          .from('site_content')
          .insert([data]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-content'] });
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-structure'] });
      toast({
        title: currentItem?.id ? "Content Updated" : "Content Added",
        description: `Successfully ${currentItem?.id ? "updated" : "added"} content.`,
      });
      setContentModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentItem?.id ? "update" : "add"} content: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Login form handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For development purposes, hardcode credentials
    // In production, this should be replaced with proper authentication
    if (credentials.username === 'admin' && credentials.password === 'Sam@1504') {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };
  
  // Input handler
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for editing items
  const handleEdit = (itemType: ItemType, item: any) => {
    setCurrentItemType(itemType);
    setCurrentItem(item);
    
    switch (itemType) {
      case 'page':
        setPageModalOpen(true);
        break;
      case 'section':
        setSectionModalOpen(true);
        break;
      case 'content':
        setContentModalOpen(true);
        break;
      // Add more cases as needed
    }
  };
  
  // Open confirmation dialog for deleting an item
  const handleDeleteConfirm = (itemType: ItemType, item: any) => {
    setCurrentItemType(itemType);
    setItemToDelete({ itemType, id: item.id });
    setDeleteDialogOpen(true);
  };
  
  // Execute delete operation
  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
      setDeleteDialogOpen(false);
    }
  };

  // Handle form submission based on type
  const handleSubmit = (data: any) => {
    try {
      switch (currentItemType) {
        case 'page':
          pageMutation.mutate(data);
          break;
        case 'section':
          sectionMutation.mutate(data);
          break;
        case 'content':
          contentMutation.mutate(data);
          break;
        // Add more cases as needed
      }
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error.message || "Please check all required fields",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-20 flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  name="username"
                  value={credentials.username}
                  onChange={handleInput}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleInput}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Return admin dashboard UI
  return (
    <AdminProvider>
      <div className="container py-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsAuthenticated(false);
              toast({
                title: "Logged out",
                description: "Successfully logged out of admin panel",
              });
            }}
          >
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="site" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="site">Site</TabsTrigger>
            <TabsTrigger value="page">Page</TabsTrigger>
            <TabsTrigger value="section">Section</TabsTrigger>
            <TabsTrigger value="sitemap">SiteMap</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          {/* Site Tab - Manage Pages */}
          <TabsContent value="site" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site</CardTitle>
                <CardDescription>
                  Manage website pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SiteTab 
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Page Tab - Manage Sections */}
          <TabsContent value="page" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page</CardTitle>
                <CardDescription>
                  Manage sections for each page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageTab 
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Section Tab - Manage Content */}
          <TabsContent value="section" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Section</CardTitle>
                <CardDescription>
                  Manage content for each section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SectionTab 
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* SiteMap Tab - Site Structure Visualization */}
          <TabsContent value="sitemap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SiteMap</CardTitle>
                <CardDescription>
                  Visual representation of the site structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SiteMapTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Help Tab - Documentation */}
          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Help & Documentation</CardTitle>
                <CardDescription>
                  Information about layouts and field types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HelpTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Modals */}
        <PageEditModal
          isOpen={pageModalOpen}
          onClose={() => setPageModalOpen(false)}
          itemData={currentItem}
          onSubmit={handleSubmit}
        />
        
        <SectionEditModal
          isOpen={sectionModalOpen}
          onClose={() => setSectionModalOpen(false)}
          itemData={currentItem}
          onSubmit={handleSubmit}
        />
        
        <ContentEditModal
          isOpen={contentModalOpen}
          onClose={() => setContentModalOpen(false)}
          itemData={currentItem}
          onSubmit={handleSubmit}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Delete"
          description="Are you sure you want to delete this item? This action cannot be undone."
        />
      </div>
    </AdminProvider>
  );
};

export default Admin;

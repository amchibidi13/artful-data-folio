
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

// Import our components
import SiteTab from '@/components/admin/SiteTab';
import PageTab from '@/components/admin/PageTab';
import SectionTab from '@/components/admin/SectionTab';
import SiteMapTab from '@/components/admin/SiteMapTab';
import HelpTab from '@/components/admin/HelpTab';
import NavigationMenuTab from '@/components/admin/NavigationMenuTab';
import PageEditModal from '@/components/admin/PageEditModal';
import SectionEditModal from '@/components/admin/SectionEditModal';
import ContentEditModal from '@/components/admin/ContentEditModal';
import HeaderTab from '@/components/admin/HeaderTab';
import FooterTab from '@/components/admin/FooterTab';
import ThemesTab from '@/components/admin/ThemesTab';
import ProjectEditModal from '@/components/admin/ProjectEditModal';
import ArticleEditModal from '@/components/admin/ArticleEditModal';

// Table name type to ensure we only use valid table names
type TableName = 'site_config' | 'site_content' | 'navigation' | 'projects' | 'articles' | 'pages';
type ItemType = 'page' | 'section' | 'content' | 'navigation' | 'project' | 'article';

// Map item types to table names
const getTableName = (itemType: ItemType) => {
  switch (itemType) {
    case 'page':
      return 'pages';
    case 'section':
      return 'site_config';
    case 'content':
      return 'site_content';
    case 'project':
      return 'projects';
    case 'article':
      return 'articles';
    default:
      return '';
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
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  
  const [currentItemType, setCurrentItemType] = useState<ItemType>('page');
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{itemType: ItemType, id: string} | null>(null);

  // Tabs state
  const [activeTab, setActiveTab] = useState('site');
  const [activePagesSubTab, setActivePagesSubTab] = useState('pages');

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
      queryClient.invalidateQueries({ queryKey: ['navigation_menu'] });
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

  // Completely rewrite the reorderMutation for projects and articles
  const reorderMutation = useMutation({
    mutationFn: async ({ itemType, id, direction }: { 
      itemType: ItemType, 
      id: string, 
      direction: 'up' | 'down' 
    }) => {
      const tableName = getTableName(itemType);
      
      // For projects and articles, we'll use a different approach
      if (itemType === 'project' || itemType === 'article') {
        // Determine which field to use for ordering
        const orderField = itemType === 'article' ? 'date' : 'created_at';
        
        // Get all items sorted by the order field (newest first - this is how they appear in the UI)
        const { data: allItems, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .order(orderField, { ascending: false });
        
        if (fetchError) throw fetchError;
        if (!allItems || allItems.length === 0) throw new Error('No items found');
        
        // Find the current item's index in the sorted array
        const currentIndex = allItems.findIndex(item => item.id === id);
        if (currentIndex === -1) throw new Error('Item not found');
        
        // Calculate the target index based on the direction
        // For "up", we want to move the item toward the top of the list (lower index)
        // For "down", we want to move the item toward the bottom of the list (higher index)
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        // Check if the move is valid
        if (targetIndex < 0 || targetIndex >= allItems.length) {
          throw new Error(`Cannot move item ${direction}`);
        }
        
        // Get the current and target items
        const currentItem = allItems[currentIndex];
        const targetItem = allItems[targetIndex];
        
        // Swap the timestamps
        const currentTimestamp = currentItem[orderField];
        const targetTimestamp = targetItem[orderField];
        
        // Update the current item with the target's timestamp
        const { error: updateCurrentError } = await supabase
          .from(tableName)
          .update({ [orderField]: targetTimestamp })
          .eq('id', currentItem.id);
        
        if (updateCurrentError) throw updateCurrentError;
        
        // Update the target item with the current's timestamp
        const { error: updateTargetError } = await supabase
          .from(tableName)
          .update({ [orderField]: currentTimestamp })
          .eq('id', targetItem.id);
        
        if (updateTargetError) throw updateTargetError;
        
        return { success: true };
      } else {
        // Original logic for other item types that have display_order
        // Get all items sorted by display_order
        const { data: allItems, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (fetchError) throw fetchError;
        if (!allItems || allItems.length === 0) throw new Error('No items found');
        
        // Find the current item's index
        const currentIndex = allItems.findIndex(item => item.id === id);
        if (currentIndex === -1) throw new Error('Item not found');
        
        // Calculate the target index based on the direction
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        // Check if the move is valid
        if (targetIndex < 0 || targetIndex >= allItems.length) {
          throw new Error(`Cannot move item ${direction}`);
        }
        
        // Get the current and target items
        const currentItem = allItems[currentIndex];
        const targetItem = allItems[targetIndex];
        
        // Swap the display_order values
        const currentOrder = currentItem.display_order;
        const targetOrder = targetItem.display_order;
        
        // Update the current item
        const { error: updateCurrentError } = await supabase
          .from(tableName)
          .update({ display_order: targetOrder })
          .eq('id', currentItem.id);
        
        if (updateCurrentError) throw updateCurrentError;
        
        // Update the target item
        const { error: updateTargetError } = await supabase
          .from(tableName)
          .update({ display_order: currentOrder })
          .eq('id', targetItem.id);
        
        if (updateTargetError) throw updateTargetError;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate queries based on the item type
      switch (variables.itemType) {
        case 'section':
          queryClient.invalidateQueries({ queryKey: ['admin-site-config'] });
          queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
          queryClient.invalidateQueries({ queryKey: ['site-config'] });
          break;
        case 'content':
          queryClient.invalidateQueries({ queryKey: ['admin-site-content'] });
          queryClient.invalidateQueries({ queryKey: ['admin-content'] });
          queryClient.invalidateQueries({ queryKey: ['site-content'] });
          break;
        case 'project':
          queryClient.invalidateQueries({ queryKey: ['projects'] });
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
          break;
        case 'article':
          queryClient.invalidateQueries({ queryKey: ['articles'] });
          queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
          break;
      }
      
      toast({
        title: "Order Updated",
        description: "Successfully updated order",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update order: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Add mutations for projects
  const projectMutation = useMutation({
    mutationFn: async (data: any) => {
      // Create a clean copy of the data, removing fields that don't exist in schema
      const { display_order, include_in_search, is_visible, ...projectData } = data;
      
      // Only include image_url if it's provided
      const cleanData = { ...projectData };
      if (!cleanData.image_url) {
        delete cleanData.image_url;
      }
      
      if (data.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(cleanData)
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Add new project
        const { error } = await supabase
          .from('projects')
          .insert([cleanData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: currentItem?.id ? "Project Updated" : "Project Added",
        description: `Successfully ${currentItem?.id ? "updated" : "added"} project.`,
      });
      setProjectModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentItem?.id ? "update" : "add"} project: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Add mutations for articles
  const articleMutation = useMutation({
    mutationFn: async (data: any) => {
      // Create a clean copy of the data without fields that don't exist in the schema
      const { display_order, include_in_search, is_visible, ...articleData } = data;
      
      // Only include image_url if it's provided
      const cleanData = { ...articleData };
      if (!cleanData.image_url) {
        delete cleanData.image_url;
      }
      
      if (data.id) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update(cleanData)
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Add new article
        const { error } = await supabase
          .from('articles')
          .insert([cleanData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: currentItem?.id ? "Article Updated" : "Article Added",
        description: `Successfully ${currentItem?.id ? "updated" : "added"} article.`,
      });
      setArticleModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentItem?.id ? "update" : "add"} article: ${error.message}`,
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
  const handleEdit = (type: ItemType, item: any) => {
    setCurrentItemType(type);
    setCurrentItem(item);
    
    switch (type) {
      case 'page':
        setPageModalOpen(true);
        break;
      case 'section':
        setSectionModalOpen(true);
        break;
      case 'content':
        setContentModalOpen(true);
        break;
      case 'project':
        setProjectModalOpen(true);
        break;
      case 'article':
        setArticleModalOpen(true);
        break;
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
        case 'project':
          projectMutation.mutate(data);
          break;
        case 'article':
          articleMutation.mutate(data);
          break;
      }
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error.message || "Please check all required fields",
        variant: "destructive",
      });
    }
  };

  // Handle reordering items
  const handleReorder = (itemType: ItemType, id: string, currentOrder: number, direction: 'up' | 'down') => {
    reorderMutation.mutate({ itemType, id, direction });
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

  // Return admin dashboard UI with nested tabs
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="site">Pages</TabsTrigger>
            <TabsTrigger value="page">Sections</TabsTrigger>
            <TabsTrigger value="section">Content</TabsTrigger>
            <TabsTrigger value="sitemap">SiteMap</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          {/* Site Tab - Manage Pages with nested tabs */}
          <TabsContent value="site" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Pages</CardTitle>
                <CardDescription>
                  Manage website pages and navigation
                </CardDescription>
                <Tabs value={activePagesSubTab} onValueChange={setActivePagesSubTab}>
                  <TabsList className="mt-2">
                    <TabsTrigger value="pages">Pages</TabsTrigger>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                    <TabsTrigger value="header">Header</TabsTrigger>
                    <TabsTrigger value="footer">Footer</TabsTrigger>
                    <TabsTrigger value="themes">Themes</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {activePagesSubTab === 'pages' ? (
                  <SiteTab 
                    onEdit={handleEdit}
                    onDelete={handleDeleteConfirm}
                    onReorder={handleReorder}
                  />
                ) : activePagesSubTab === 'navigation' ? (
                  <NavigationMenuTab />
                ) : activePagesSubTab === 'header' ? (
                  <HeaderTab />
                ) : activePagesSubTab === 'footer' ? (
                  <FooterTab />
                ) : (
                  <ThemesTab />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Page Tab - Manage Sections */}
          <TabsContent value="page" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Sections</CardTitle>
                <CardDescription>
                  Manage sections for each page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageTab 
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                  onReorder={handleReorder}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Section Tab - Manage Content */}
          <TabsContent value="section" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Section Content</CardTitle>
                <CardDescription>
                  Manage content for each section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SectionTab 
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                  onReorder={handleReorder}
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

        <ProjectEditModal
          isOpen={projectModalOpen}
          onClose={() => setProjectModalOpen(false)}
          itemData={currentItem}
          onSubmit={handleSubmit}
        />

        <ArticleEditModal
          isOpen={articleModalOpen}
          onClose={() => setArticleModalOpen(false)}
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

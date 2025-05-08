import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, Article } from '@/types/supabase-types';
import { Skeleton } from '@/components/ui/skeleton';
import { SiteConfig, SiteContent, NavigationItem, SiteConfigInsert, SiteContentInsert, NavigationItemInsert } from '@/types/database-types';
import EditModal from '@/components/admin/EditModal';

const Admin: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItemType, setCurrentItemType] = useState<'section' | 'content' | 'navigation' | 'project' | 'article'>('section');
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // Content management queries - These must be at the top level of the component, not inside conditions
  const { data: siteConfig, isLoading: configLoading } = useQuery({
    queryKey: ['admin-site-config'],
    queryFn: async () => {
      if (!isAuthenticated) return [] as SiteConfig[];
      
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SiteConfig[];
    },
    enabled: isAuthenticated, // Only run this query when authenticated
  });

  const { data: siteContent, isLoading: contentLoading } = useQuery({
    queryKey: ['admin-site-content'],
    queryFn: async () => {
      if (!isAuthenticated) return [] as SiteContent[];
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SiteContent[];
    },
    enabled: isAuthenticated, // Only run this query when authenticated
  });

  const { data: navigationItems, isLoading: navLoading } = useQuery({
    queryKey: ['admin-navigation'],
    queryFn: async () => {
      if (!isAuthenticated) return [] as NavigationItem[];
      
      const { data, error } = await supabase
        .from('navigation')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as NavigationItem[];
    },
    enabled: isAuthenticated, // Only run this query when authenticated
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      if (!isAuthenticated) return [] as Project[];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: isAuthenticated, // Only run this query when authenticated
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      if (!isAuthenticated) return [] as Article[];
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
    enabled: isAuthenticated, // Only run this query when authenticated
  });

  // Mutations for adding/updating items
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
        // Add new section - ensure section_name is provided
        if (!data.section_name) {
          throw new Error("Section name is required");
        }
        
        // Insert with explicit typing to ensure required fields are provided
        const { error } = await supabase
          .from('site_config')
          .insert([data as SiteConfigInsert]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-config'] });
      toast({
        title: currentItem ? "Section Updated" : "Section Added",
        description: `Successfully ${currentItem ? "updated" : "added"} section.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentItem ? "update" : "add"} section: ${error.message}`,
        variant: "destructive",
      });
    }
  });

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
        // Add new content - ensure required fields are provided
        if (!data.section || !data.content_type || !data.content) {
          throw new Error("Section, content type, and content are required");
        }
        
        // Insert with explicit typing to ensure required fields are provided
        const { error } = await supabase
          .from('site_content')
          .insert([data as SiteContentInsert]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-content'] });
      toast({
        title: currentItem ? "Content Updated" : "Content Added",
        description: `Successfully ${currentItem ? "updated" : "added"} content.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentItem ? "update" : "add"} content: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const navigationMutation = useMutation({
    mutationFn: async (data: NavigationItemInsert) => {
      if (data.id) {
        // Update existing navigation item
        const { error } = await supabase
          .from('navigation')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Add new navigation item - ensure required fields are provided
        if (!data.label || !data.target_section) {
          throw new Error("Label and target section are required");
        }
        
        // Insert with explicit typing to ensure required fields are provided
        const { error } = await supabase
          .from('navigation')
          .insert([data as NavigationItemInsert]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      toast({
        title: currentItem ? "Navigation Item Updated" : "Navigation Item Added",
        description: `Successfully ${currentItem ? "updated" : "added"} navigation item.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentItem ? "update" : "add"} navigation item: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Login form handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For development purposes, hardcode credentials
    // In production, this should be replaced with proper authentication
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
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

  // Open modal for adding a new item
  const handleAddNew = (itemType: 'section' | 'content' | 'navigation' | 'project' | 'article') => {
    setCurrentItemType(itemType);
    setCurrentItem(null); // No existing item for add new
    
    // Set default values based on item type
    let defaultValues = {};
    switch (itemType) {
      case 'section':
        defaultValues = {
          section_name: '',
          display_order: 0,
          is_visible: true,
          layout_type: 'default'
        };
        break;
      case 'content':
        defaultValues = {
          section: '',
          content_type: '',
          content: '',
          display_order: 0,
          is_visible: true
        };
        break;
      case 'navigation':
        defaultValues = {
          label: '',
          target_section: '',
          display_order: 0,
          button_type: 'link',
          is_visible: true
        };
        break;
      // Add other item types as needed
    }
    
    setCurrentItem(defaultValues);
    setModalOpen(true);
  };

  // Open modal for editing an existing item
  const handleEdit = (itemType: 'section' | 'content' | 'navigation' | 'project' | 'article', item: any) => {
    setCurrentItemType(itemType);
    setCurrentItem(item);
    setModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (data: any) => {
    switch (currentItemType) {
      case 'section':
        sectionMutation.mutate(data as SiteConfigInsert);
        break;
      case 'content':
        contentMutation.mutate(data as SiteContentInsert);
        break;
      case 'navigation':
        navigationMutation.mutate(data as NavigationItemInsert);
        break;
      // Add other item types as needed
    }
    setModalOpen(false);
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
              <Button type="submit" className="w-full bg-data-purple hover:bg-data-indigo">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Return admin dashboard UI
  return (
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
      
      <Tabs defaultValue="site-config" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="site-config">Site Structure</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>
        
        {/* Site Structure Tab */}
        <TabsContent value="site-config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Structure</CardTitle>
              <CardDescription>
                Manage the sections of your website, their order, and visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of site sections and their configuration</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section Name</TableHead>
                    <TableHead>Display Order</TableHead>
                    <TableHead>Layout Type</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : siteConfig && siteConfig.length > 0 ? (
                    siteConfig.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">{section.section_name}</TableCell>
                        <TableCell>{section.display_order}</TableCell>
                        <TableCell>{section.layout_type}</TableCell>
                        <TableCell>{section.is_visible ? 'Visible' : 'Hidden'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleEdit('section', section)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No sections found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button onClick={() => handleAddNew('section')}>Add New Section</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Content</CardTitle>
              <CardDescription>
                Manage the content displayed in each section of your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of site content entries</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableHead>Content Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Display Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : siteContent && siteContent.length > 0 ? (
                    siteContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>{content.section}</TableCell>
                        <TableCell>{content.content_type}</TableCell>
                        <TableCell>
                          {content.content.length > 40
                            ? `${content.content.substring(0, 40)}...`
                            : content.content}
                        </TableCell>
                        <TableCell>{content.display_order}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleEdit('content', content)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No content found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button onClick={() => handleAddNew('content')}>Add New Content</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
              <CardDescription>
                Manage the navigation items displayed in your website header
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of navigation items</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Target Section</TableHead>
                    <TableHead>Display Order</TableHead>
                    <TableHead>Button Type</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {navLoading ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : navigationItems && navigationItems.length > 0 ? (
                    navigationItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.label}</TableCell>
                        <TableCell>{item.target_section}</TableCell>
                        <TableCell>{item.display_order}</TableCell>
                        <TableCell>{item.button_type}</TableCell>
                        <TableCell>{item.is_visible ? 'Visible' : 'Hidden'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleEdit('navigation', item)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No navigation items found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button onClick={() => handleAddNew('navigation')}>Add Navigation Item</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your portfolio projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of all projects</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : projects && projects.length > 0 ? (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.description.substring(0, 50)}...</TableCell>
                        <TableCell>{project.tags.join(', ')}</TableCell>
                        <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleEdit('project', project)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No projects found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button onClick={() => handleAddNew('project')}>Add New Project</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
              <CardDescription>
                Manage your blog articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of all articles</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Read Time</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articlesLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : articles && articles.length > 0 ? (
                    articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>{article.read_time} min</TableCell>
                        <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleEdit('article', article)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No articles found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button onClick={() => handleAddNew('article')}>Add New Article</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemType={currentItemType}
        itemData={currentItem}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Admin;

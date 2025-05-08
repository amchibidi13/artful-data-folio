
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, Article } from '@/types/supabase-types';
import { Skeleton } from '@/components/ui/skeleton';
import { SiteConfig, SiteContent, NavigationItem } from '@/types/database-types';

const Admin: React.FC = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
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

  // If not authenticated, show login form
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

  // Content management queries - IMPORTANT: These are now outside any conditional rendering
  // but inside the component, which is correct React hooks usage
  const { data: siteConfig, isLoading: configLoading } = useQuery({
    queryKey: ['admin-site-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SiteConfig[];
    },
  });

  const { data: siteContent, isLoading: contentLoading } = useQuery({
    queryKey: ['admin-site-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SiteContent[];
    },
  });

  const { data: navigationItems, isLoading: navLoading } = useQuery({
    queryKey: ['admin-navigation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as NavigationItem[];
    },
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
  });

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
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
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
                <Button>Add New Section</Button>
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
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
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
                <Button>Add New Content</Button>
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
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
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
                <Button>Add Navigation Item</Button>
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
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
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
                <Button>Add New Project</Button>
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
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
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
                <Button>Add New Article</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

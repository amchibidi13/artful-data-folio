
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Trash, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Import necessary types
type ItemType = 'content' | 'project' | 'article';

interface SectionTabProps {
  onEdit: (type: ItemType, item: any) => void;
  onDelete: (type: ItemType, item: any) => void;
  onReorder: (type: ItemType, id: string, currentOrder: number, direction: 'up' | 'down') => void;
}

export const SectionTab: React.FC<SectionTabProps> = ({ onEdit, onDelete, onReorder }) => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedSection, setSelectedSection] = useState<string>('');

  // Query for pages
  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Query for sections based on selected page
  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ['sections', selectedPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('page', selectedPage)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedPage,
  });

  // Query for projects when projects section is selected
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first for display
      
      if (error) throw error;
      return data;
    },
    enabled: selectedSection?.toLowerCase() === 'projects',
  });

  // Query for articles when articles section is selected
  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('date', { ascending: false }); // Newest first for display
      
      if (error) throw error;
      return data;
    },
    enabled: selectedSection?.toLowerCase() === 'articles',
  });

  // Query for regular content based on selected section
  const { data: contentItems, isLoading: contentLoading } = useQuery({
    queryKey: ['content', selectedSection],
    queryFn: async () => {
      if (!selectedSection) return [];
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', selectedSection)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching content:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!selectedSection && 
      selectedSection.toLowerCase() !== 'projects' && 
      selectedSection.toLowerCase() !== 'articles',
  });

  // Set initial page when data loads
  useEffect(() => {
    if (pages && pages.length > 0 && !selectedPage) {
      const homePage = pages.find(p => p.page_name.toLowerCase() === 'home');
      if (homePage) {
        setSelectedPage(homePage.page_name);
      } else {
        setSelectedPage(pages[0].page_name);
      }
    }
  }, [pages, selectedPage]);

  // Set initial section when sections load
  useEffect(() => {
    if (sections && sections.length > 0 && !selectedSection) {
      setSelectedSection(sections[0].section_name);
    }
  }, [sections, selectedSection]);

  // Handle page selection
  const handlePageSelect = (pageName: string) => {
    setSelectedPage(pageName);
    setSelectedSection(''); // Reset section when page changes
  };

  // Handle section selection
  const handleSectionSelect = (sectionName: string) => {
    setSelectedSection(sectionName);
  };
  
  // Handle edit based on section type
  const handleEdit = (item: any) => {
    const sectionLower = selectedSection.toLowerCase();
    if (sectionLower === 'projects') {
      onEdit('project', item);
    } else if (sectionLower === 'articles') {
      onEdit('article', item);
    } else {
      onEdit('content', item);
    }
  };
  
  // Handle delete based on section type
  const handleDelete = (item: any) => {
    const sectionLower = selectedSection.toLowerCase();
    if (sectionLower === 'projects') {
      onDelete('project', item);
    } else if (sectionLower === 'articles') {
      onDelete('article', item);
    } else {
      onDelete('content', item);
    }
  };
  
  // Handle add based on section type
  const handleAdd = () => {
    const sectionLower = selectedSection.toLowerCase();
    if (sectionLower === 'projects') {
      onEdit('project', {});
    } else if (sectionLower === 'articles') {
      onEdit('article', {});
    } else {
      onEdit('content', { section: selectedSection });
    }
  };

  // Handle reordering based on section type
  const handleReorder = (item: any, direction: 'up' | 'down') => {
    const sectionLower = selectedSection.toLowerCase();
    onReorder(
      sectionLower === 'projects' ? 'project' : 
      sectionLower === 'articles' ? 'article' : 'content', 
      item.id, 
      item.display_order || 0, // Use 0 as default if display_order is not set
      direction
    );
  };

  // Helper function to get input type label
  const getInputTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      text: 'Text',
      textarea: 'Text Area',
      rich_text: 'Rich Text',
      image: 'Image',
      video: 'Video',
      link: 'Link',
      button: 'Button',
      heading: 'Heading',
      subheading: 'Subheading',
      paragraph: 'Paragraph',
    };
    
    return typeMap[type] || type;
  };
  
  // Process page list to ensure all pages are included
  const pagesList = React.useMemo(() => {
    if (!pages) return [];
    return pages.filter(page => page.page_name !== 'admin');
  }, [pages]);

  // Determine if we're loading content based on the section type
  const isLoadingContent = () => {
    const sectionLower = selectedSection?.toLowerCase();
    if (sectionLower === 'projects') return projectsLoading;
    if (sectionLower === 'articles') return articlesLoading;
    return contentLoading;
  };

  // Get the appropriate content items based on section type
  const getContentItems = () => {
    const sectionLower = selectedSection?.toLowerCase();
    if (sectionLower === 'projects') return projectsData || [];
    if (sectionLower === 'articles') return articlesData || [];
    return contentItems || [];
  };
  
  // Render table rows based on section type
  const renderTableRows = () => {
    const items = getContentItems();
    const loading = isLoadingContent();
    const sectionLower = selectedSection?.toLowerCase();
    
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6}>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </TableCell>
        </TableRow>
      );
    }
    
    if (items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center">
            {selectedSection 
              ? `No items found for ${selectedSection} section` 
              : 'Please select a page and section'}
          </TableCell>
        </TableRow>
      );
    }
    
    if (sectionLower === 'projects') {
      return items.map((project: any, index: number) => (
        <TableRow key={project.id}>
          <TableCell>
            {new Date(project.created_at).toLocaleDateString()}
          </TableCell>
          <TableCell>{project.title}</TableCell>
          <TableCell>Project</TableCell>
          <TableCell>Visible</TableCell>
          <TableCell>Yes</TableCell>
          <TableCell className="space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleReorder(project, 'up')}
              disabled={index === 0} // Disable if it's the first item
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleReorder(project, 'down')}
              disabled={index === items.length - 1} // Disable if it's the last item
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEdit(project)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDelete(project)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ));
    }
    
    if (sectionLower === 'articles') {
      return items.map((article: any, index: number) => (
        <TableRow key={article.id}>
          <TableCell>
            {new Date(article.date).toLocaleDateString()}
          </TableCell>
          <TableCell>{article.title}</TableCell>
          <TableCell>Article</TableCell>
          <TableCell>Visible</TableCell>
          <TableCell>Yes</TableCell>
          <TableCell className="space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleReorder(article, 'up')}
              disabled={index === 0} // Disable if it's the first item
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleReorder(article, 'down')}
              disabled={index === items.length - 1} // Disable if it's the last item
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEdit(article)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDelete(article)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ));
    }
    
    // Regular content items
    return items
      .filter((content: any) => !content.content_type?.endsWith('_style'))
      .map((content: any) => (
        <TableRow key={content.id}>
          <TableCell>{content.display_order}</TableCell>
          <TableCell>{content.content_type}</TableCell>
          <TableCell>
            {getInputTypeLabel(content.field_type || content.content_type)}
          </TableCell>
          <TableCell>{content.is_visible ? 'Visible' : 'Hidden'}</TableCell>
          <TableCell>{content.include_in_global_search ? 'Yes' : 'No'}</TableCell>
          <TableCell className="space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleReorder(content, 'up')}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleReorder(content, 'down')}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEdit(content)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDelete(content)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ));
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Page</label>
          <Select 
            value={selectedPage} 
            onValueChange={handlePageSelect}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {pagesLoading ? (
                <div className="p-2">
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : pagesList.length > 0 ? (
                pagesList.map((page) => (
                  <SelectItem key={page.id} value={page.page_name}>
                    {page.page_name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm">No pages found</div>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Select Section</label>
          <Select 
            value={selectedSection} 
            onValueChange={handleSectionSelect}
            disabled={!selectedPage || sectionsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sectionsLoading ? (
                <div className="p-2">
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : sections && sections.length > 0 ? (
                sections.map((section) => (
                  <SelectItem key={section.id} value={section.section_name}>
                    {section.section_name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm">No sections found for this page</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {selectedSection ? `${selectedSection} Content` : 'Select a page and section'}
        </h3>
        {selectedSection && (
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add {selectedSection?.toLowerCase() === 'projects' ? 'Project' : 
                 selectedSection?.toLowerCase() === 'articles' ? 'Article' : 'Content'}
          </Button>
        )}
      </div>
      
      <Table>
        <TableCaption>
          {selectedSection 
            ? `Content for ${selectedSection} section` 
            : 'Please select a section to view content'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              {selectedSection?.toLowerCase() === 'projects' ? 'Created Date' : 
               selectedSection?.toLowerCase() === 'articles' ? 'Published Date' : 'Order'}
            </TableHead>
            <TableHead>{selectedSection?.toLowerCase() === 'projects' || selectedSection?.toLowerCase() === 'articles' ? 'Title' : 'Content Type'}</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead>{selectedSection?.toLowerCase() === 'articles' ? 'Searchable' : 'In Search'}</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderTableRows()}
        </TableBody>
      </Table>
    </div>
  );
};

export default SectionTab;

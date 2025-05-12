
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash, Plus } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { SiteContent } from '@/types/database-types';
import { getFieldInputType } from '@/hooks/useSiteData';

export const SectionTab = ({
  onEdit,
  onDelete
}: {
  onEdit: (type: 'content', item: any) => void,
  onDelete: (type: 'content', item: any) => void
}) => {
  const { selectedPage, setSelectedPage, selectedSection, setSelectedSection } = useAdmin();
  
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
  
  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ['admin-sections-for-dropdown', selectedPage],
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
  
  const { data: contentItems, isLoading: contentLoading } = useQuery({
    queryKey: ['admin-content', selectedSection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', selectedSection)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SiteContent[];
    },
    enabled: !!selectedSection,
  });

  useEffect(() => {
    // Reset selected section when page changes
    if (selectedPage && sections && sections.length > 0) {
      const firstSection = sections[0].section_name;
      if (firstSection && (!selectedSection || !sections.some(s => s.section_name === selectedSection))) {
        setSelectedSection(firstSection);
      }
    } else {
      setSelectedSection('');
    }
  }, [selectedPage, sections, setSelectedSection, selectedSection]);

  const handleAdd = () => {
    onEdit('content', { section: selectedSection });
  };

  const handleEdit = (content: SiteContent) => {
    onEdit('content', content);
  };

  const handleDelete = (content: SiteContent) => {
    onDelete('content', content);
  };

  const getInputTypeLabel = (fieldType: string) => {
    const inputType = getFieldInputType(fieldType);
    switch (inputType) {
      case 'text':
        return 'Text';
      case 'textarea':
        return 'Long Text';
      case 'rich_text':
        return 'Rich Text';
      case 'image':
        return 'Image URL';
      case 'url':
        return 'URL';
      case 'list':
        return 'List';
      case 'json':
        return 'JSON';
      case 'date':
        return 'Date';
      case 'email':
        return 'Email';
      case 'password':
        return 'Password';
      case 'color':
        return 'Color';
      default:
        return 'Text';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Page</label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {pagesLoading ? (
                <div className="p-2">
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                pages?.map((page) => (
                  <SelectItem key={page.id} value={page.page_name}>
                    {page.page_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Select Section</label>
          <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedPage || sectionsLoading || (sections && sections.length === 0)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={!selectedPage ? "Select page first" : "Select section"} />
            </SelectTrigger>
            <SelectContent>
              {sectionsLoading ? (
                <div className="p-2">
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                sections?.map((section) => (
                  <SelectItem key={section.id} value={section.section_name}>
                    {section.section_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Content Fields</h2>
        <Button onClick={handleAdd} disabled={!selectedSection}>
          <Plus className="mr-2 h-4 w-4" /> Add Field
        </Button>
      </div>
      
      <Table>
        <TableCaption>
          {selectedSection 
            ? `Content fields for ${selectedSection} section` 
            : 'Please select a section to view content fields'
          }
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Display Order</TableHead>
            <TableHead>Field Type</TableHead>
            <TableHead>Input Type</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>In Search</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contentLoading ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </TableCell>
            </TableRow>
          ) : contentItems && contentItems.length > 0 ? (
            contentItems
              .filter(content => !content.content_type.endsWith('_style'))
              .map((content) => (
              <TableRow key={content.id}>
                <TableCell>{content.display_order}</TableCell>
                <TableCell>{content.field_type || content.content_type}</TableCell>
                <TableCell>
                  {getInputTypeLabel(content.field_type || content.content_type)}
                </TableCell>
                <TableCell>{content.is_visible ? 'Visible' : 'Hidden'}</TableCell>
                <TableCell>{content.include_in_global_search ? 'Yes' : 'No'}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(content)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(content)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {selectedSection ? 'No content fields found for this section' : 'Please select a section'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SectionTab;

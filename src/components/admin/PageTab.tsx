
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash, Plus } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { SiteConfig } from '@/types/database-types';

export const PageTab = ({
  onEdit,
  onDelete
}: {
  onEdit: (type: 'section', item: any) => void,
  onDelete: (type: 'section', item: any) => void
}) => {
  const { selectedPage, setSelectedPage } = useAdmin();
  
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
    queryKey: ['admin-sections', selectedPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('page', selectedPage)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SiteConfig[];
    },
    enabled: !!selectedPage,
  });

  const handleAdd = () => {
    onEdit('section', { page: selectedPage });
  };

  const handleEdit = (section: any) => {
    onEdit('section', section);
  };

  const handleDelete = (section: any) => {
    onDelete('section', section);
  };

  const getLayoutTypeName = (layoutType: string) => {
    const layoutMap: {[key: string]: string} = {
      'hero': 'Hero Banner',
      'cta': 'Call to Action',
      'intro': 'Introduction',
      'features': 'Feature Grid',
      'alternating': 'Alternating Features',
      'benefits': 'Benefits List',
      'comparison': 'Comparison Table',
      'testimonials': 'Testimonial',
      'clients': 'Client Logos',
      'cases': 'Case Studies',
      'default': 'Default',
    };
    
    return layoutMap[layoutType] || layoutType;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Select Page</label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full md:w-[200px]">
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
        <Button onClick={handleAdd} className="mt-6" disabled={!selectedPage}>
          <Plus className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </div>
      
      <Table>
        <TableCaption>List of sections for {selectedPage || 'selected'} page</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Display Order</TableHead>
            <TableHead>Section Name</TableHead>
            <TableHead>Layout Type</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Background</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sectionsLoading ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </TableCell>
            </TableRow>
          ) : sections && sections.length > 0 ? (
            sections.map((section) => (
              <TableRow key={section.id}>
                <TableCell>{section.display_order}</TableCell>
                <TableCell className="font-medium">{section.section_name}</TableCell>
                <TableCell>{getLayoutTypeName(section.layout_type)}</TableCell>
                <TableCell>{section.is_visible ? 'Visible' : 'Hidden'}</TableCell>
                <TableCell>
                  {section.background_color && (
                    <div 
                      className="inline-block w-4 h-4 mr-2 border border-gray-300" 
                      style={{ backgroundColor: section.background_color }}
                    />
                  )}
                  {section.background_image && 'Has image'}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(section)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(section)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {selectedPage ? 'No sections found for this page' : 'Please select a page'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PageTab;

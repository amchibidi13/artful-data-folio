
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash, Plus } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export const SiteTab = ({ 
  onEdit,
  onDelete
}: { 
  onEdit: (type: 'page', item: any) => void,
  onDelete: (type: 'page', item: any) => void
}) => {
  const queryClient = useQueryClient();
  const { setSelectedPage } = useAdmin();
  
  const { data: pages, isLoading } = useQuery({
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

  const handleAdd = () => {
    onEdit('page', null);
  };

  const handleEdit = (page: any) => {
    onEdit('page', page);
  };

  const handleDelete = (page: any) => {
    if (page.is_system_page) {
      toast({
        title: "Cannot Delete",
        description: "System pages cannot be deleted",
        variant: "destructive"
      });
      return;
    }
    onDelete('page', page);
  };

  const handleSelectPage = (pageName: string) => {
    setSelectedPage(pageName);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Website Pages</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Page
        </Button>
      </div>
      
      <Table>
        <TableCaption>List of website pages</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Display Order</TableHead>
            <TableHead>Page Name</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </TableCell>
            </TableRow>
          ) : pages && pages.length > 0 ? (
            pages.filter(page => page.page_name !== 'admin').map((page) => (
              <TableRow key={page.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleSelectPage(page.page_name)}>
                <TableCell>{page.display_order}</TableCell>
                <TableCell className="font-medium">{page.page_name}</TableCell>
                <TableCell>{page.is_visible ? 'Visible' : 'Hidden'}</TableCell>
                <TableCell>{page.is_system_page ? 'System Page' : 'Custom Page'}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(page);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(page);
                    }}
                    disabled={page.is_system_page}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No pages found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SiteTab;

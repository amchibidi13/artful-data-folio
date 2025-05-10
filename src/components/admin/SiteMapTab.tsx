
import React, { useState } from 'react';
import { useSiteStructure } from '@/hooks/useSiteData';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronDown, FileText, Layers, Layout } from 'lucide-react';

export const SiteMapTab = () => {
  const { data: siteStructure, isLoading } = useSiteStructure();
  
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const togglePage = (pageId: string) => {
    setExpandedPages(prev => ({
      ...prev,
      [pageId]: !prev[pageId]
    }));
  };
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  const viewDetails = (item: any, type: 'page' | 'section' | 'field') => {
    setSelectedItem({ ...item, type });
    setDetailsOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Site Structure Map</h2>
      
      <div className="border rounded-lg p-4 space-y-2">
        {siteStructure?.map(page => (
          <div key={page.id} className="border-b last:border-b-0 pb-2">
            {/* Page level */}
            <div 
              className="flex items-center py-2 px-2 hover:bg-muted cursor-pointer rounded-lg"
              onClick={() => togglePage(page.id)}
            >
              {page.sections?.length > 0 ? (
                expandedPages[page.id] ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )
              ) : (
                <span className="w-4 mr-2" />
              )}
              
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <span 
                className="font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  viewDetails(page, 'page');
                }}
              >
                Page: {page.page_name}
              </span>
            </div>
            
            {/* Sections under this page */}
            {expandedPages[page.id] && page.sections?.map(section => (
              <div key={section.id} className="ml-8 border-l pl-2 my-1">
                <div 
                  className="flex items-center py-1 px-2 hover:bg-muted cursor-pointer rounded-lg"
                  onClick={() => toggleSection(section.id)}
                >
                  {section.fields?.length > 0 ? (
                    expandedSections[section.id] ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )
                  ) : (
                    <span className="w-4 mr-2" />
                  )}
                  
                  <Layout className="h-5 w-5 mr-2 text-indigo-500" />
                  <span 
                    className="font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewDetails(section, 'section');
                    }}
                  >
                    Section: {section.section_name}
                  </span>
                </div>
                
                {/* Fields under this section */}
                {expandedSections[section.id] && section.fields?.filter(field => !field.content_type.endsWith('_style')).map(field => (
                  <div 
                    key={field.id}
                    className="ml-8 border-l pl-2 py-1 flex items-center hover:bg-muted cursor-pointer rounded-lg"
                    onClick={() => viewDetails(field, 'field')}
                  >
                    <Layers className="h-4 w-4 mr-2 text-green-500" />
                    <span>Field: {field.field_type || field.content_type}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.type === 'page' ? `Page Details: ${selectedItem?.page_name}` : 
               selectedItem?.type === 'section' ? `Section Details: ${selectedItem?.section_name}` : 
               `Field Details: ${selectedItem?.field_type || selectedItem?.content_type}`}
            </DialogTitle>
          </DialogHeader>
          
          <Card>
            <CardContent className="pt-6">
              {selectedItem?.type === 'page' && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                    <dd>{selectedItem.page_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Link</dt>
                    <dd>{selectedItem.page_link || selectedItem.page_name.toLowerCase()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Visible</dt>
                    <dd>{selectedItem.is_visible ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">System Page</dt>
                    <dd>{selectedItem.is_system_page ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Display Order</dt>
                    <dd>{selectedItem.display_order}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                    <dd>{new Date(selectedItem.created_at).toLocaleDateString()}</dd>
                  </div>
                </dl>
              )}
              
              {selectedItem?.type === 'section' && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                    <dd>{selectedItem.section_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Layout Type</dt>
                    <dd>{selectedItem.layout_type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Page</dt>
                    <dd>{selectedItem.page}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Visible</dt>
                    <dd>{selectedItem.is_visible ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Display Order</dt>
                    <dd>{selectedItem.display_order}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Background Color</dt>
                    <dd>{selectedItem.background_color || 'None'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Background Image</dt>
                    <dd>{selectedItem.background_image || 'None'}</dd>
                  </div>
                </dl>
              )}
              
              {selectedItem?.type === 'field' && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                    <dd>{selectedItem.field_type || selectedItem.content_type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Section</dt>
                    <dd>{selectedItem.section}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Visible</dt>
                    <dd>{selectedItem.is_visible ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Display Order</dt>
                    <dd>{selectedItem.display_order}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Content</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-all">
                      <div className="max-h-32 overflow-y-auto border p-2 rounded-md text-sm">
                        {selectedItem.content}
                      </div>
                    </dd>
                  </div>
                </dl>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteMapTab;

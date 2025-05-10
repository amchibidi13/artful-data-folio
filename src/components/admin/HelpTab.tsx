
import React, { useState } from 'react';
import { useFieldTypesMapping } from '@/hooks/useSiteData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const HelpTab = () => {
  const { data: fieldTypeMappings } = useFieldTypesMapping();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMappings = fieldTypeMappings ? 
    Object.entries(fieldTypeMappings).filter(([layout]) => 
      layout.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];
    
  const layouts = [
    { id: 'hero_banner', name: 'Hero Banner', description: 'A full-width banner at the top of a page.' },
    { id: 'cta', name: 'Call to Action', description: 'A section that drives user engagement with buttons.' },
    { id: 'intro', name: 'Introduction', description: 'Introduces the page content to visitors.' },
    { id: 'feature_grid', name: 'Feature Grid', description: 'Grid layout to display features or services.' },
    { id: 'alternating_feature', name: 'Alternating Features', description: 'Features displayed in alternating text/image pattern.' },
    { id: 'benefits_list', name: 'Benefits List', description: 'List of benefits or advantages.' },
    { id: 'comparison_table', name: 'Comparison Table', description: 'Compares different products/services/plans.' },
    { id: 'testimonial', name: 'Testimonial', description: 'Customer reviews and testimonials.' },
    { id: 'client_logos', name: 'Client Logos', description: 'Showcase client logos.' },
    { id: 'case_studies', name: 'Case Studies', description: 'Project case studies or success stories.' },
  ];

  const fieldTypes = [
    { id: 'short_text', name: 'Short Text', description: 'Single line text field (titles, names, etc)' },
    { id: 'long_text', name: 'Long Text', description: 'Multi-line text field for paragraphs' },
    { id: 'rich_text', name: 'Rich Text', description: 'Text with formatting options' },
    { id: 'image', name: 'Image URL', description: 'URL to an image' },
    { id: 'url', name: 'URL', description: 'A link to another page or website' },
    { id: 'list_of_strings', name: 'List of Strings', description: 'Comma-separated list of text items' },
    { id: 'list_of_objects', name: 'JSON List', description: 'List of structured data objects in JSON format' },
    { id: 'date', name: 'Date', description: 'Date picker field' },
    { id: 'email', name: 'Email', description: 'Email address field' },
    { id: 'phone_number', name: 'Phone Number', description: 'Phone number field' },
    { id: 'select', name: 'Select', description: 'Dropdown selection field' },
    { id: 'icon_picker', name: 'Icon Picker', description: 'Pick an icon from a library' },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Help & Documentation</h2>
      
      <Tabs defaultValue="layouts" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="layouts">Section Layouts</TabsTrigger>
          <TabsTrigger value="fields">Field Types</TabsTrigger>
          <TabsTrigger value="mapping">Layout to Field Mapping</TabsTrigger>
        </TabsList>

        {/* Section Layouts tab */}
        <TabsContent value="layouts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {layouts.map(layout => (
              <Card key={layout.id}>
                <CardHeader className="py-4">
                  <CardTitle className="text-md">{layout.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>{layout.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Field Types tab */}
        <TabsContent value="fields" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fieldTypes.map(field => (
              <Card key={field.id}>
                <CardHeader className="py-4">
                  <CardTitle className="text-md">{field.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>{field.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Layout to Field Mapping tab */}
        <TabsContent value="mapping" className="space-y-4">
          <Input 
            placeholder="Search layouts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mb-4"
          />
          
          <Accordion type="single" collapsible className="w-full">
            {filteredMappings.map(([layout, fields]) => (
              <AccordionItem key={layout} value={layout}>
                <AccordionTrigger className="text-md font-medium">
                  {layout.replace(/_/g, ' ')}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 border-l-2 border-muted space-y-2">
                    <p className="mb-2 text-sm text-muted-foreground">Available fields for this layout:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {Array.isArray(fields) && fields.map((field: string) => (
                        <li key={field} className="text-sm">
                          {field.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            
            {filteredMappings.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No layouts found matching your search
              </p>
            )}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpTab;

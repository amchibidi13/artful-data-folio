
import React, { useState } from 'react';
import { useFieldTypesMapping } from '@/hooks/useSiteData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getFieldInputType } from '@/hooks/useSiteData';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const HelpTab = () => {
  const { data: fieldTypeMappings } = useFieldTypesMapping();
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldTypeSearchTerm, setFieldTypeSearchTerm] = useState('');
  
  const filteredMappings = fieldTypeMappings ? 
    Object.entries(fieldTypeMappings).filter(([layout, fields]) => 
      layout.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (Array.isArray(fields) && fields.some((field: string) => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    ) : [];
    
  const layouts = [
    { id: 'hero', name: 'Hero Banner', description: 'A full-width banner at the top of a page.' },
    { id: 'cta', name: 'Call to Action', description: 'A section that drives user engagement with buttons.' },
    { id: 'intro', name: 'Introduction', description: 'Introduces the page content to visitors.' },
    { id: 'feature_grid', name: 'Feature Grid', description: 'Grid layout to display features or services.' },
    { id: 'alternating', name: 'Alternating Features', description: 'Features displayed in alternating text/image pattern.' },
    { id: 'benefits', name: 'Benefits List', description: 'List of benefits or advantages.' },
    { id: 'comparison', name: 'Comparison Table', description: 'Compares different products/services/plans.' },
    { id: 'testimonials', name: 'Testimonial', description: 'Customer reviews and testimonials.' },
    { id: 'clients', name: 'Client Logos', description: 'Showcase client logos.' },
    { id: 'cases', name: 'Case Studies', description: 'Project case studies or success stories.' },
    { id: 'media', name: 'Media Mentions', description: 'Media coverage and press mentions.' },
    { id: 'products', name: 'Product Showcase', description: 'Display products or services details.' },
    { id: 'pricing', name: 'Pricing Table', description: 'Pricing plans comparison.' },
    { id: 'stats', name: 'Stats Section', description: 'Key metrics and statistics.' },
    { id: 'milestones', name: 'Milestones', description: 'Company or project milestones.' },
    { id: 'blog', name: 'Blog Previews', description: 'Preview of blog posts.' },
    { id: 'faq', name: 'FAQ Section', description: 'Frequently asked questions.' },
    { id: 'contact_form', name: 'Contact Form', description: 'Form for user inquiries.' },
    { id: 'contact_info', name: 'Contact Info', description: 'Contact details and map.' },
    { id: 'newsletter', name: 'Newsletter Signup', description: 'Email subscription form.' },
    { id: 'resume', name: 'Resume Section', description: 'Professional experience and education.' },
    { id: 'login', name: 'Login Section', description: 'User authentication form.' },
    { id: 'navigation', name: 'Navigation Bar', description: 'Site navigation menu.' },
    { id: 'footer', name: 'Footer', description: 'Page footer with site information.' },
    { id: 'gallery', name: 'Image Gallery', description: 'Collection of images in grid or carousel.' },
    { id: 'video', name: 'Video Section', description: 'Embedded video content.' },
    { id: 'portfolio', name: 'Portfolio Showcase', description: 'Display of projects or work samples.' },
    { id: 'team', name: 'Team Members', description: 'Team profiles and information.' },
    { id: 'timeline', name: 'Timeline', description: 'Chronological display of events.' },
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
  
  // This will be used for the field type to input type mapping
  const fieldTypeToInputTypeMapping = [
    { fieldType: 'short_text', inputType: 'text', description: 'Single line text input' },
    { fieldType: 'long_text', inputType: 'textarea', description: 'Multi-line text area' },
    { fieldType: 'rich_text', inputType: 'rich_text', description: 'Rich text editor with formatting' },
    { fieldType: 'image', inputType: 'image', description: 'Image URL or upload field' },
    { fieldType: 'url', inputType: 'url', description: 'URL input with validation' },
    { fieldType: 'list_of_strings', inputType: 'list', description: 'Comma-separated list input' },
    { fieldType: 'list_of_objects', inputType: 'json', description: 'JSON editor for structured data' },
    { fieldType: 'date', inputType: 'date', description: 'Date picker calendar' },
    { fieldType: 'email', inputType: 'email', description: 'Email input with validation' },
    { fieldType: 'phone_number', inputType: 'phone', description: 'Phone number input with formatting' },
    { fieldType: 'select', inputType: 'select', description: 'Dropdown selection list' },
    { fieldType: 'icon_picker', inputType: 'select', description: 'Icon selection dropdown' },
    { fieldType: 'title', inputType: 'text', description: 'Title text input' },
    { fieldType: 'subtitle', inputType: 'text', description: 'Subtitle text input' },
    { fieldType: 'description', inputType: 'textarea', description: 'Description text area' },
    { fieldType: 'content', inputType: 'textarea', description: 'Content text area or rich editor' },
    { fieldType: 'button_text', inputType: 'text', description: 'Button label text' },
    { fieldType: 'button_url', inputType: 'url', description: 'Button target URL' },
    { fieldType: 'background_image', inputType: 'image', description: 'Background image URL' },
    { fieldType: 'color', inputType: 'color', description: 'Color picker' },
  ];

  const filteredFieldTypeMapping = fieldTypeToInputTypeMapping.filter(item =>
    item.fieldType.toLowerCase().includes(fieldTypeSearchTerm.toLowerCase()) ||
    item.inputType.toLowerCase().includes(fieldTypeSearchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(fieldTypeSearchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Help & Documentation</h2>
      
      <Tabs defaultValue="layouts" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="layouts">Section Layouts</TabsTrigger>
          <TabsTrigger value="fields">Field Types</TabsTrigger>
          <TabsTrigger value="field-input-mapping">Field to Input Mapping</TabsTrigger>
          <TabsTrigger value="mapping">Section Layout to Field Mapping</TabsTrigger>
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

        {/* Field Type to Input Type Mapping tab */}
        <TabsContent value="field-input-mapping" className="space-y-4">
          <Input 
            placeholder="Search field types or input types..." 
            value={fieldTypeSearchTerm}
            onChange={(e) => setFieldTypeSearchTerm(e.target.value)}
            className="max-w-md mb-4"
          />
          
          <Table>
            <TableCaption>Field Type to Input Type Mapping</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Field Type</TableHead>
                <TableHead>Input Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFieldTypeMapping.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.fieldType}</TableCell>
                  <TableCell>{item.inputType}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
              {filteredFieldTypeMapping.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No mappings found matching your search</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Section Layout to Field Mapping tab */}
        <TabsContent value="mapping" className="space-y-4">
          <Input 
            placeholder="Search layouts or field types..." 
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
                No layouts or fields found matching your search
              </p>
            )}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpTab;

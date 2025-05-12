
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { fieldTypeMappings, getFieldInputType } from '@/hooks/useSiteData';

const HelpTab = () => {
  const [layoutSearchTerm, setLayoutSearchTerm] = useState('');
  const [fieldTypeSearchTerm, setFieldTypeSearchTerm] = useState('');
  
  // Query field type mappings
  const { data: mappings } = useQuery({
    queryKey: ['field_type_mappings'],
    queryFn: () => {
      return fieldTypeMappings;
    }
  });

  // Create a list of all layout types and their field types
  const layoutToFields = React.useMemo(() => {
    if (!mappings) return [];
    
    return Object.entries(mappings).map(([layout, fields]) => ({
      layout,
      fields: fields as string[]
    }));
  }, [mappings]);
  
  // Filter layout to fields based on search term
  const filteredLayoutToFields = React.useMemo(() => {
    if (!layoutToFields) return [];
    if (!layoutSearchTerm) return layoutToFields;
    
    const lowerSearchTerm = layoutSearchTerm.toLowerCase();
    
    return layoutToFields.filter(item => 
      item.layout.toLowerCase().includes(lowerSearchTerm) || 
      item.fields.some(field => field.toLowerCase().includes(lowerSearchTerm))
    );
  }, [layoutToFields, layoutSearchTerm]);

  // Generate list of all field types and their input types
  const fieldTypeToInputType = React.useMemo(() => {
    if (!mappings) return [];
    
    const allFields = new Set<string>();
    
    // Collect all unique field types
    Object.values(mappings).forEach(fields => {
      (fields as string[]).forEach(field => {
        allFields.add(field);
      });
    });
    
    // Map field types to input types
    return Array.from(allFields).map(fieldType => ({
      fieldType,
      inputType: getFieldInputType(fieldType)
    })).sort((a, b) => a.fieldType.localeCompare(b.fieldType));
  }, [mappings]);
  
  // Filter field types to input types based on search term
  const filteredFieldTypeToInputType = React.useMemo(() => {
    if (!fieldTypeToInputType) return [];
    if (!fieldTypeSearchTerm) return fieldTypeToInputType;
    
    const lowerSearchTerm = fieldTypeSearchTerm.toLowerCase();
    
    return fieldTypeToInputType.filter(item => 
      item.fieldType.toLowerCase().includes(lowerSearchTerm) || 
      item.inputType.toLowerCase().includes(lowerSearchTerm)
    );
  }, [fieldTypeToInputType, fieldTypeSearchTerm]);

  // Map input type to display name
  const getInputTypeDisplay = (inputType: string) => {
    switch(inputType) {
      case 'text': return 'Short Text';
      case 'textarea': return 'Long Text';
      case 'rich_text': return 'Rich Text';
      case 'image': return 'Image URL';
      case 'url': return 'URL';
      case 'list': return 'List of Strings';
      case 'json': return 'JSON List';
      case 'date': return 'Date';
      case 'email': return 'Email';
      case 'password': return 'Password';
      case 'color': return 'Color';
      default: return inputType;
    }
  };
  
  return (
    <Tabs defaultValue="section-layouts">
      <TabsList className="mb-4">
        <TabsTrigger value="section-layouts">Section Layouts</TabsTrigger>
        <TabsTrigger value="layout-field-mapping">Section Layout to Field Type Mapping</TabsTrigger>
        <TabsTrigger value="field-input-mapping">Field Type to Input Type Mapping</TabsTrigger>
      </TabsList>
      
      <TabsContent value="section-layouts">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Layout Types</CardTitle>
              <CardDescription>
                Different layout types available for sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Hero Banner</h3>
                  <p className="text-muted-foreground">Large eye-catching banner, typically at the top of the page</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Call to Action (CTA)</h3>
                  <p className="text-muted-foreground">Section designed to prompt user action</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Intro / Mission Statement</h3>
                  <p className="text-muted-foreground">Introduces company, product, or service</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Feature Grid</h3>
                  <p className="text-muted-foreground">Grid layout displaying features or services</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Alternating Feature Sections</h3>
                  <p className="text-muted-foreground">Content and image alternating sides</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Benefits List</h3>
                  <p className="text-muted-foreground">List of benefits or advantages</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Testimonial Section</h3>
                  <p className="text-muted-foreground">Customer testimonials and reviews</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Client Logos</h3>
                  <p className="text-muted-foreground">Showcase trusted clients and partners</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Case Studies</h3>
                  <p className="text-muted-foreground">Success stories and case studies</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Media Mentions</h3>
                  <p className="text-muted-foreground">Press and media coverage</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Product Showcase</h3>
                  <p className="text-muted-foreground">Display products or services</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Pricing Table</h3>
                  <p className="text-muted-foreground">Compare pricing options</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Stats / Metrics</h3>
                  <p className="text-muted-foreground">Key statistics and numbers</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Milestones / Progress</h3>
                  <p className="text-muted-foreground">Timeline or progress indicators</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Blog Previews</h3>
                  <p className="text-muted-foreground">Preview of blog posts or articles</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">FAQ Section</h3>
                  <p className="text-muted-foreground">Frequently asked questions</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Contact Form</h3>
                  <p className="text-muted-foreground">Form for user inquiries</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Contact Info + Map</h3>
                  <p className="text-muted-foreground">Contact information with map</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Newsletter Signup</h3>
                  <p className="text-muted-foreground">Form for newsletter subscriptions</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Resume / Experience</h3>
                  <p className="text-muted-foreground">Professional experience and education</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Team Members</h3>
                  <p className="text-muted-foreground">Team profiles and information</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Image Gallery</h3>
                  <p className="text-muted-foreground">Collection of images or portfolio</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Video Section</h3>
                  <p className="text-muted-foreground">Embedded video content</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Portfolio Showcase</h3>
                  <p className="text-muted-foreground">Portfolio of work or projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="layout-field-mapping">
        <Card>
          <CardHeader>
            <CardTitle>Section Layout to Field Type Mapping</CardTitle>
            <CardDescription>
              Field types that correspond to different section layouts
            </CardDescription>
            <div className="mt-4">
              <Input
                type="search"
                placeholder="Search by layout type or field type..."
                value={layoutSearchTerm}
                onChange={(e) => setLayoutSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredLayoutToFields.map(item => (
                <div key={item.layout} className="border-b pb-4 last:border-0">
                  <h3 className="font-bold text-lg mb-2">{item.layout}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.fields.map(field => (
                      <div key={`${item.layout}-${field}`} className="bg-muted px-3 py-1 rounded-full text-sm">
                        {field}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="field-input-mapping">
        <Card>
          <CardHeader>
            <CardTitle>Field Type to Input Type Mapping</CardTitle>
            <CardDescription>
              How field types map to different input types in forms
            </CardDescription>
            <div className="mt-4">
              <Input
                type="search"
                placeholder="Search by field type or input type..."
                value={fieldTypeSearchTerm}
                onChange={(e) => setFieldTypeSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 border">Field Type</th>
                    <th className="text-left p-2 border">Input Type</th>
                    <th className="text-left p-2 border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFieldTypeToInputType.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border">{item.fieldType}</td>
                      <td className="p-2 border">{getInputTypeDisplay(item.inputType)}</td>
                      <td className="p-2 border">
                        {item.inputType === 'text' && 'Single line text input for short content'}
                        {item.inputType === 'textarea' && 'Multi-line text area for longer content'}
                        {item.inputType === 'rich_text' && 'Rich text editor with formatting options'}
                        {item.inputType === 'image' && 'URL input for image sources'}
                        {item.inputType === 'url' && 'URL input for web links'}
                        {item.inputType === 'list' && 'Input for comma-separated values or array items'}
                        {item.inputType === 'json' && 'Structured data in JSON format'}
                        {item.inputType === 'date' && 'Date picker for selecting dates'}
                        {item.inputType === 'email' && 'Email address input with validation'}
                        {item.inputType === 'password' && 'Secure password input field'}
                        {item.inputType === 'color' && 'Color picker for selecting colors'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default HelpTab;

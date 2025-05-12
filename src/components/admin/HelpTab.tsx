
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { useFieldTypesMapping } from '@/hooks/useSiteData';
import { Search } from 'lucide-react';
import { getFieldInputType } from '@/hooks/useSiteData';

const HelpTab = () => {
  const { data: fieldTypesMapping } = useFieldTypesMapping();
  const [layoutSearch, setLayoutSearch] = useState('');
  const [fieldTypeSearch, setFieldTypeSearch] = useState('');
  
  const fieldTypeInputMappings = [
    { fieldType: 'title', inputType: 'text' },
    { fieldType: 'subtitle', inputType: 'text' },
    { fieldType: 'name', inputType: 'text' },
    { fieldType: 'label', inputType: 'text' },
    { fieldType: 'description', inputType: 'textarea' },
    { fieldType: 'content', inputType: 'textarea' },
    { fieldType: 'paragraph', inputType: 'textarea' },
    { fieldType: 'rich_text', inputType: 'rich_text' },
    { fieldType: 'richtext', inputType: 'rich_text' },
    { fieldType: 'image', inputType: 'image' },
    { fieldType: 'photo', inputType: 'image' },
    { fieldType: 'avatar', inputType: 'image' },
    { fieldType: 'logo', inputType: 'image' },
    { fieldType: 'url', inputType: 'url' },
    { fieldType: 'link', inputType: 'url' },
    { fieldType: 'button_url', inputType: 'url' },
    { fieldType: 'email', inputType: 'email' },
    { fieldType: 'password', inputType: 'password' },
    { fieldType: 'date', inputType: 'date' },
    { fieldType: 'color', inputType: 'color' },
    { fieldType: 'list', inputType: 'list' },
    { fieldType: 'features', inputType: 'json' },
    { fieldType: 'testimonials', inputType: 'json' },
    { fieldType: 'style', inputType: 'json' }
  ];

  // Filter layout types based on search term
  const filteredLayoutTypes = Object.entries(fieldTypesMapping || {}).filter(([layout]) => {
    return layout.toLowerCase().includes(layoutSearch.toLowerCase());
  });
  
  // Filter field types based on search term in the Layout to Field Type mapping tab
  const filteredFieldTypes = Object.entries(fieldTypesMapping || {}).flatMap(([layout, fields]) => {
    const matchedFields = fields.filter((field: string) => 
      field.toLowerCase().includes(layoutSearch.toLowerCase())
    ).map((field: string) => ({ layout, field }));
    return matchedFields;
  });
  
  // Filter field types based on search term in the Field Type to Input Type mapping tab
  const filteredFieldTypeInputMappings = fieldTypeInputMappings.filter(mapping => 
    mapping.fieldType.toLowerCase().includes(fieldTypeSearch.toLowerCase()) || 
    mapping.inputType.toLowerCase().includes(fieldTypeSearch.toLowerCase())
  );

  return (
    <Tabs defaultValue="section_layouts" className="w-full">
      <TabsList className="mb-4 grid grid-cols-3">
        <TabsTrigger value="section_layouts">Section Layouts</TabsTrigger>
        <TabsTrigger value="section_layout_field_mapping">Section Layout to Field Type Mapping</TabsTrigger>
        <TabsTrigger value="field_type_input_mapping">Field Type to Input Type Mapping</TabsTrigger>
      </TabsList>
      
      <TabsContent value="section_layouts" className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Available Section Layouts</h3>
          <p className="text-muted-foreground mb-4">These are the different layout types available for sections:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Hero Banner</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>hero</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Call to Action (CTA)</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>cta</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Introduction</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>intro</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Feature Grid</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>features</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Alternating Features</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>alternating</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Benefits List</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>benefits</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Comparison Table</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>comparison</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Testimonials</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>testimonials</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Client Logos</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>clients</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Case Studies</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>cases</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Media Mentions</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>media</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Product Showcase</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>products</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Pricing Table</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>pricing</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Stats / Metrics</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>stats</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Milestones</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>milestones</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Blog Previews</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>blog</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">FAQ Section</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>faq</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Contact Form</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>contact_form</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Contact Info</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>contact_info</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Newsletter Signup</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>newsletter</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Resume</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>resume</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Login / Signup</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>login</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Navigation Bar</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>navigation</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Footer</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>footer</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Utility / Settings</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>utility</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Error Page</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>error</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Image Gallery</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>gallery</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Video Section</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>video</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Portfolio Showcase</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>portfolio</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Team Members</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>team</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Timeline</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>timeline</code></p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">Default</h4>
              <p className="text-sm text-muted-foreground">Layout type: <code>default</code></p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="section_layout_field_mapping" className="space-y-4">
        <div className="relative">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search section layouts or field types..."
            className="pl-9"
            value={layoutSearch}
            onChange={(e) => setLayoutSearch(e.target.value)}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Section Layout to Field Type Mapping</h3>
          <p className="text-muted-foreground mb-4">These are the field types supported by each section layout:</p>
          
          {layoutSearch && filteredFieldTypes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-2">Matched Field Types:</h4>
              <div className="space-y-2">
                {filteredFieldTypes.map((item, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <p><strong>Layout:</strong> {item.layout}</p>
                    <p><strong>Field:</strong> {item.field}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(!layoutSearch || filteredLayoutTypes.length > 0) && (
            <div className="space-y-4">
              {filteredLayoutTypes.map(([layout, fields]) => (
                <div key={layout} className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">{layout.charAt(0).toUpperCase() + layout.slice(1)}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {(fields as string[]).map((field: string) => (
                      <div key={field} className="p-2 bg-muted rounded-md text-sm">
                        {field}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {layoutSearch && filteredLayoutTypes.length === 0 && filteredFieldTypes.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No matches found for "{layoutSearch}"
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="field_type_input_mapping" className="space-y-4">
        <div className="relative">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search field types or input types..."
            className="pl-9"
            value={fieldTypeSearch}
            onChange={(e) => setFieldTypeSearch(e.target.value)}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Field Type to Input Type Mapping</h3>
          <p className="text-muted-foreground mb-4">These are the input types used for different field types:</p>
          
          {filteredFieldTypeInputMappings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFieldTypeInputMappings.map((mapping, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <p><strong>Field Type:</strong> {mapping.fieldType}</p>
                  <p><strong>Input Type:</strong> {mapping.inputType}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No matches found for "{fieldTypeSearch}"
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default HelpTab;

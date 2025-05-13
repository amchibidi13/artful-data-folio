
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFontStyleOptions } from '@/hooks/useSiteData';
import StyledTextEditor from '@/components/admin/StyledTextEditor';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

// Content form schema
const contentSchema = z.object({
  id: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  content_type: z.string().min(1, "Content type is required"),
  content: z.string().default(''),
  field_type: z.string().optional(),
  display_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
  include_in_global_search: z.boolean().default(false),
  font_style: z.any().optional(),
});

export const ContentEditModal = ({
  isOpen,
  onClose,
  itemData,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  itemData: any | null;
  onSubmit: (data: any) => void;
}) => {
  const [activeTab, setActiveTab] = useState("content");
  const { data: fontStyleOptions } = useFontStyleOptions();
  
  // Convert font_style JSON to object if needed
  const parseFontStyle = (data: any) => {
    if (data?.font_style) {
      try {
        return typeof data.font_style === 'string' 
          ? JSON.parse(data.font_style) 
          : data.font_style;
      } catch (e) {
        console.error("Error parsing font style", e);
        return {};
      }
    }
    return {};
  };
  
  const form = useForm<any>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      ...(itemData || {
        section: '',
        content_type: '',
        content: '',
        field_type: '',
        display_order: 0,
        is_visible: true,
        include_in_global_search: false,
      }),
      font_style: parseFontStyle(itemData),
    },
  });

  // Reset form when data changes
  useEffect(() => {
    if (isOpen) {
      const defaultData = {
        ...(itemData || {
          section: '',
          content_type: '',
          content: '',
          field_type: '',
          display_order: 0,
          is_visible: true,
          include_in_global_search: false,
        }),
        font_style: parseFontStyle(itemData),
      };
      
      form.reset(defaultData);
    }
  }, [form, itemData, isOpen]);

  const handleSubmit = (data: any) => {
    // Make sure font_style is properly serialized
    if (data.font_style && typeof data.font_style === 'object') {
      data.font_style = JSON.stringify(data.font_style);
    }
    onSubmit(data);
  };

  // Input type options
  const inputTypes = [
    { value: "text", label: "Text" },
    { value: "textarea", label: "Long Text" },
    { value: "rich_text", label: "Rich Text" },
    { value: "image", label: "Image URL" },
    { value: "url", label: "URL" },
    { value: "list", label: "List" },
    { value: "json", label: "JSON" },
    { value: "email", label: "Email" },
    { value: "color", label: "Color" },
  ];
  
  // Get form values
  const fieldType = form.watch('field_type') || form.watch('content_type');
  const content = form.watch('content');

  // Update font style property
  const updateFontStyle = (property: string, value: string) => {
    const currentFontStyle = form.getValues('font_style') || {};
    form.setValue('font_style', {
      ...currentFontStyle,
      [property]: value
    });
  };
  
  // Handle formatting buttons
  const handleFormatting = (format: string) => {
    const currentFontStyle = form.getValues('font_style') || {};
    
    // Toggle boolean properties
    switch(format) {
      case 'bold':
        form.setValue('font_style', {
          ...currentFontStyle,
          fontWeight: currentFontStyle.fontWeight === 'font-bold' ? 'font-normal' : 'font-bold'
        });
        break;
      case 'italic':
        form.setValue('font_style', {
          ...currentFontStyle,
          fontStyle: currentFontStyle.fontStyle === 'italic' ? 'normal' : 'italic'
        });
        break;
      case 'underline':
        form.setValue('font_style', {
          ...currentFontStyle,
          textDecoration: currentFontStyle.textDecoration === 'underline' ? 'no-underline' : 'underline'
        });
        break;
      default:
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{itemData?.id ? 'Edit Content Field' : 'Add Content Field'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="formatting">Formatting</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="content_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Type</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., title, subtitle, etc." />
                        </FormControl>
                        <FormDescription>
                          What kind of content this is (title, description, etc.)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="field_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Input Type</FormLabel>
                        <Select value={field.value || ""} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select input type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inputTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          What type of input to use for editing this content
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        {fieldType === 'textarea' || fieldType === 'rich_text' ? (
                          <Textarea 
                            {...field} 
                            rows={8} 
                            className="font-mono"
                          />
                        ) : (
                          <Input {...field} />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Formatting Tab */}
              <TabsContent value="formatting" className="py-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleFormatting('bold')}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleFormatting('italic')}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleFormatting('underline')}
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        onClick={() => updateFontStyle('textAlign', 'text-left')}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        onClick={() => updateFontStyle('textAlign', 'text-center')}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        onClick={() => updateFontStyle('textAlign', 'text-right')}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {fontStyleOptions && (
                      <>
                        <div>
                          <label className="text-sm font-medium">Font</label>
                          <Select 
                            value={form.watch('font_style.fontFamily') || ""} 
                            onValueChange={(value) => updateFontStyle('fontFamily', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontStyleOptions.fonts.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Font Size</label>
                          <Select 
                            value={form.watch('font_style.fontSize') || ""} 
                            onValueChange={(value) => updateFontStyle('fontSize', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontStyleOptions.fontSizes.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Font Weight</label>
                          <Select 
                            value={form.watch('font_style.fontWeight') || ""} 
                            onValueChange={(value) => updateFontStyle('fontWeight', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select weight" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontStyleOptions.fontWeights.map((weight) => (
                                <SelectItem key={weight.value} value={weight.value}>
                                  {weight.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Text Transform</label>
                          <Select 
                            value={form.watch('font_style.textTransform') || ""} 
                            onValueChange={(value) => updateFontStyle('textTransform', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select transform" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontStyleOptions.textTransforms.map((transform) => (
                                <SelectItem key={transform.value} value={transform.value}>
                                  {transform.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Text Color</label>
                          <Select 
                            value={form.watch('font_style.textColor') || ""} 
                            onValueChange={(value) => updateFontStyle('textColor', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontStyleOptions.colors.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  {color.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Line Height</label>
                          <Select 
                            value={form.watch('font_style.lineHeight') || ""} 
                            onValueChange={(value) => updateFontStyle('lineHeight', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select line height" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontStyleOptions.spacings.map((spacing) => (
                                <SelectItem key={spacing.value} value={spacing.value}>
                                  {spacing.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Custom Color</label>
                          <Input 
                            type="color" 
                            value={form.watch('font_style.customColor') || "#000000"} 
                            onChange={(e) => updateFontStyle('customColor', e.target.value)} 
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-6 border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                    <div 
                      className={`p-2 border rounded ${form.watch('font_style.textColor') || ''} ${form.watch('font_style.fontSize') || ''} ${form.watch('font_style.fontWeight') || ''} ${form.watch('font_style.textAlign') || ''} ${form.watch('font_style.textTransform') || ''}`}
                      style={{
                        fontFamily: form.watch('font_style.fontFamily') || '',
                        fontStyle: form.watch('font_style.fontStyle') || '',
                        textDecoration: form.watch('font_style.textDecoration') === 'underline' ? 'underline' : 'none',
                        color: form.watch('font_style.customColor') || '',
                      }}
                    >
                      {content || 'Preview Text'}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="py-2">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_visible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Visible</FormLabel>
                          <FormDescription>
                            Should this content be visible on the site?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="include_in_global_search"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include in Global Search</FormLabel>
                          <FormDescription>
                            Can this content be found via the site search?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditModal;

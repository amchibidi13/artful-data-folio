
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bold, Italic, TextCursor, Palette } from "lucide-react";

interface StyledTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onStyleChange?: (styleObj: any) => void;
  currentStyle?: any;
  className?: string;
  label?: string;
  rows?: number;
}

const StyledTextEditor: React.FC<StyledTextEditorProps> = ({
  value,
  onChange,
  onStyleChange,
  currentStyle = {},
  className = '',
  label,
  rows = 5
}) => {
  const handleStyleChange = (property: string, value: string) => {
    if (onStyleChange) {
      onStyleChange({
        ...currentStyle,
        [property]: value
      });
    }
  };

  const toggleStyle = (property: string) => {
    if (onStyleChange) {
      const newStyle = { ...currentStyle };
      if (property === 'fontWeight') {
        newStyle.fontWeight = newStyle.fontWeight === 'bold' ? 'normal' : 'bold';
      }
      if (property === 'fontStyle') {
        newStyle.fontStyle = newStyle.fontStyle === 'italic' ? 'normal' : 'italic';
      }
      onStyleChange(newStyle);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      {onStyleChange && (
        <div className="flex items-center gap-2 mb-2">
          <Toggle 
            aria-label="Toggle bold"
            pressed={currentStyle?.fontWeight === 'bold'}
            onPressedChange={() => toggleStyle('fontWeight')}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            aria-label="Toggle italic"
            pressed={currentStyle?.fontStyle === 'italic'}
            onPressedChange={() => toggleStyle('fontStyle')}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          
          <div className="flex items-center gap-2 ml-2">
            <TextCursor className="h-4 w-4" />
            <Input
              type="number"
              className="w-20 h-8"
              value={currentStyle?.fontSize?.replace('px', '') || ''}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
              placeholder="Size"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Toggle aria-label="Choose color">
                <Palette className="h-4 w-4" />
              </Toggle>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="textColor"
                      value={currentStyle?.color || ''}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      placeholder="#000000"
                    />
                    <input 
                      type="color" 
                      className="w-8 h-8"
                      value={currentStyle?.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bgColor">Background Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="bgColor"
                      value={currentStyle?.backgroundColor || ''}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                    />
                    <input 
                      type="color" 
                      className="w-8 h-8"
                      value={currentStyle?.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      <Textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        rows={rows}
        className="w-full"
        style={currentStyle}
      />
    </div>
  );
};

export default StyledTextEditor;


import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const themes = [
  {
    id: 'default',
    name: 'Default',
    description: 'The default light theme with minimal styling',
    primaryColor: '#0f172a',
    accentColor: '#3b82f6',
    bgColor: '#ffffff'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Dark theme with light text for reduced eye strain',
    primaryColor: '#f1f5f9',
    accentColor: '#60a5fa',
    bgColor: '#1e293b'
  },
  {
    id: 'purple',
    name: 'Purple Haze',
    description: 'Vibrant purple theme with modern feel',
    primaryColor: '#f5f3ff',
    accentColor: '#8b5cf6',
    bgColor: '#4c1d95'
  },
  {
    id: 'green',
    name: 'Natural Green',
    description: 'Earthy green theme for a natural look',
    primaryColor: '#f0fdf4',
    accentColor: '#22c55e',
    bgColor: '#14532d'
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    description: 'Calming blue theme inspired by the ocean',
    primaryColor: '#eff6ff',
    accentColor: '#3b82f6',
    bgColor: '#1e40af'
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    description: 'Warm gradient theme inspired by sunrise colors',
    primaryColor: '#fef3c7',
    accentColor: '#f97316',
    bgColor: '#fff7ed'
  }
];

export const ThemesTab = () => {
  const [activeTheme, setActiveTheme] = useState('default');
  const queryClient = useQueryClient();

  const updateThemeMutation = useMutation({
    mutationFn: async (themeId: string) => {
      // In a real implementation, this would update a site_config record for theme
      // For now we'll just simulate success
      return { success: true, theme: themeId };
    },
    onSuccess: (data) => {
      setActiveTheme(data.theme);
      toast({
        title: 'Theme Updated',
        description: `Theme has been updated to ${themes.find(t => t.id === data.theme)?.name}`,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update theme',
        variant: 'destructive',
      });
    }
  });

  const handleApplyTheme = (themeId: string) => {
    updateThemeMutation.mutate(themeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Theme Settings</h2>
      </div>
      
      <p className="text-muted-foreground">
        Select a theme to apply to your entire website. The theme will affect colors, fonts, and general styling.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className={`cursor-pointer border-2 transition-all ${activeTheme === theme.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
            onClick={() => setActiveTheme(theme.id)}
          >
            <CardHeader>
              <CardTitle>{theme.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">{theme.description}</div>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.bgColor }} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={activeTheme === theme.id ? "default" : "outline"} 
                className="w-full"
                disabled={activeTheme === theme.id}
                onClick={() => handleApplyTheme(theme.id)}
              >
                {activeTheme === theme.id ? 'Current Theme' : 'Apply Theme'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="p-4 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">
          Note: Theme functionality is currently a preview feature. Full theme customization will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default ThemesTab;

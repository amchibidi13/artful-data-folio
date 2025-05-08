
export interface SiteConfig {
  id: string;
  section_name: string;
  display_order: number;
  is_visible: boolean;
  layout_type: string;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  section: string;
  content_type: string;
  content: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  target_section: string;
  display_order: number;
  is_visible: boolean;
  button_type: string;
  created_at: string;
  updated_at: string;
}

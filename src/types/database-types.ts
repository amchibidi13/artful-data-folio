export interface SiteConfig {
  id: string;
  section_name: string;
  display_order: number;
  is_visible: boolean;
  layout_type: string;
  created_at: string;
  updated_at: string;
  page?: string;
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

export interface UIConfig {
  id: string;
  component: string;
  attribute: string;
  value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  username: string;
  password_hash: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'section' | 'content' | 'navigation' | 'project' | 'article';
  itemData?: any;
  onSubmit: (data: any) => void;
}

// New interfaces for insert operations
export interface SiteConfigInsert {
  id?: string;
  section_name: string;
  display_order?: number;
  is_visible?: boolean;
  layout_type?: string;
  created_at?: string;
  updated_at?: string;
  page?: string;
}

export interface SiteContentInsert {
  id?: string;
  section: string;
  content_type: string;
  content: string;
  display_order?: number;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NavigationItemInsert {
  id?: string;
  label: string;
  target_section: string;
  display_order?: number;
  is_visible?: boolean;
  button_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectInsert {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  link?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleInsert {
  id?: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  read_time?: number;
  date?: string;
  link?: string | null;
  created_at?: string;
  updated_at?: string;
}


export interface Project {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url?: string;
  tags: string[];
  link?: string;
  // Remove display_order
}

export interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url?: string;
  read_time: number;
  date: string;
  link?: string;
  // Remove display_order
}


export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  link: string | null;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: number;
  category: string;
  link: string | null;
  created_at: string;
  updated_at: string;
}

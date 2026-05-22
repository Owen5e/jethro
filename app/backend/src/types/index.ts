export interface Event {
  id: string;
  title: string;
  image_url: string | null;
  date: string;
  time: string;
  location: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  description: string | null;
  audio_url: string | null;
  video_url: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  image_url: string | null;
  link_url: string;
  created_at: string;
  updated_at: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  description: string | null;
  header_image: string | null;
  images: string[] | null;
  audio_url: string | null;
  video_url: string | null;
  testimonies: string[] | null;
  created_at: string;
  updated_at: string;
}

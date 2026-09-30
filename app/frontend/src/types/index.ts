/**
 * Shapes the jethro backend returns (mirrors app/backend/src/types/index.ts).
 *
 * Declared with `type` rather than `interface` deliberately: only a type alias
 * of an object literal gets an implicit index signature, which is what lets a
 * record be handed to the generic form state in AdminDashboard without a cast.
 */

export type Event = {
  id: string;
  title: string;
  image_url: string | null;
  date: string;
  time: string;
  location: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Sermon = {
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
};

export type Book = {
  id: string;
  title: string;
  author: string;
  image_url: string | null;
  link_url: string;
  created_at: string;
  updated_at: string;
};

export type BlogArticle = {
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
};

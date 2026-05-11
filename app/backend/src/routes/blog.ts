import { Request, Response, Router } from 'express';
import { supabase } from '../config/supabase';
import { adminAuth } from '../middleware/auth';

const router = Router();

// GET /api/blog - Get all blog articles (summary for cards)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('id, title, header_image, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    res.status(500).json({ error: 'Failed to fetch blog articles' });
  }
});

// GET /api/blog/:id - Get a single article with full content
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Article not found' });
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// POST /api/blog - Create a new article (admin only)
router.post('/', adminAuth, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      header_image,
      images,
      audio_url,
      video_url,
      testimonies,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Missing required field: title',
      });
    }

    const { data, error } = await supabase
      .from('blog_articles')
      .insert([
        {
          title,
          description,
          header_image,
          images,
          audio_url,
          video_url,
          testimonies,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// PUT /api/blog/:id - Update an article (admin only)
router.put('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      header_image,
      images,
      audio_url,
      video_url,
      testimonies,
    } = req.body;

    const { data, error } = await supabase
      .from('blog_articles')
      .update({
        title,
        description,
        header_image,
        images,
        audio_url,
        video_url,
        testimonies,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Article not found' });
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// DELETE /api/blog/:id - Delete an article (admin only)
router.delete('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blog_articles')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Article not found' });
      }
      throw error;
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export default router;

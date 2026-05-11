import { Request, Response, Router } from 'express';
import { supabase } from '../config/supabase';
import { adminAuth } from '../middleware/auth';

const router = Router();

// GET /api/sermons - Get all sermons with optional search/filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;

    let query = supabase
      .from('sermons')
      .select('*')
      .order('date', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category as string);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

// GET /api/sermons/:id - Get a single sermon
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Sermon not found' });
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching sermon:', error);
    res.status(500).json({ error: 'Failed to fetch sermon' });
  }
});

// POST /api/sermons - Create a new sermon (admin only)
router.post('/', adminAuth, async (req: Request, res: Response) => {
  try {
    const { title, author, date, category, description, audio_url, video_url } =
      req.body;

    if (!title || !author || !date || !category) {
      return res.status(400).json({
        error: 'Missing required fields: title, author, date, category',
      });
    }

    const { data, error } = await supabase
      .from('sermons')
      .insert([
        { title, author, date, category, description, audio_url, video_url },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating sermon:', error);
    res.status(500).json({ error: 'Failed to create sermon' });
  }
});

// PUT /api/sermons/:id - Update a sermon (admin only)
router.put('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, author, date, category, description, audio_url, video_url } =
      req.body;

    const { data, error } = await supabase
      .from('sermons')
      .update({
        title,
        author,
        date,
        category,
        description,
        audio_url,
        video_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Sermon not found' });
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating sermon:', error);
    res.status(500).json({ error: 'Failed to update sermon' });
  }
});

// DELETE /api/sermons/:id - Delete a sermon (admin only)
router.delete('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('sermons').delete().eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Sermon not found' });
      }
      throw error;
    }
    res.json({ message: 'Sermon deleted successfully' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
});

export default router;

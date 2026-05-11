import { Request, Response, Router } from 'express';
import { supabase } from '../config/supabase';
import { adminAuth } from '../middleware/auth';

const router = Router();

// GET /api/events/upcoming - Get the 4 closest upcoming events
// IMPORTANT: This must come before /:id route to prevent "upcoming" being treated as an ID
router.get('/upcoming', async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(4);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
});

// GET /api/events - Get all events sorted by date
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get a single event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Event not found' });
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events - Create a new event (admin only)
router.post('/', adminAuth, async (req: Request, res: Response) => {
  try {
    const { title, image_url, date, time, location, description } = req.body;

    if (!title || !date || !time || !location) {
      return res.status(400).json({
        error: 'Missing required fields: title, date, time, location',
      });
    }

    const { data, error } = await supabase
      .from('events')
      .insert([{ title, image_url, date, time, location, description }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update an event (admin only)
router.put('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, image_url, date, time, location, description } = req.body;

    const { data, error } = await supabase
      .from('events')
      .update({
        title,
        image_url,
        date,
        time,
        location,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Event not found' });
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Delete an event (admin only)
router.delete('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Event not found' });
      }
      throw error;
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;

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

// POST /api/sermons/admin/calculate-all-durations - Calculate duration for all sermons without duration
router.post(
  '/admin/calculate-all-durations',
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const { execSync } = require('child_process');

      // Get all sermons without duration
      const { data: sermons, error: fetchError } = await supabase
        .from('sermons')
        .select('*')
        .is('duration', null)
        .neq('audio_url', null);

      if (fetchError) throw fetchError;

      if (!sermons || sermons.length === 0) {
        return res.json({ message: 'No sermons to process' });
      }

      const results = [];

      for (const sermon of sermons) {
        try {
          const output = execSync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:noprint_wrappers=1 "${sermon.audio_url}" 2>/dev/null || echo "0"`,
          )
            .toString()
            .trim();

          const duration = parseFloat(output);

          if (!isNaN(duration) && duration > 0) {
            const { data: updated } = await supabase
              .from('sermons')
              .update({
                duration: Math.round(duration),
                updated_at: new Date().toISOString(),
              })
              .eq('id', sermon.id)
              .select()
              .single();

            results.push({
              id: sermon.id,
              title: sermon.title,
              duration: Math.round(duration),
              status: 'success',
            });
          } else {
            results.push({
              id: sermon.id,
              title: sermon.title,
              status: 'failed',
              error: 'Could not extract duration',
            });
          }
        } catch (err) {
          results.push({
            id: sermon.id,
            title: sermon.title,
            status: 'error',
            error: (err as Error).message,
          });
        }
      }

      res.json({
        message: 'Duration calculation complete',
        processed: results.length,
        results,
      });
    } catch (error) {
      console.error('Error calculating all durations:', error);
      res.status(500).json({ error: 'Failed to calculate durations' });
    }
  },
);

// POST /api/sermons/:id/calculate-duration - Calculate and store duration for a sermon
router.post(
  '/:id/calculate-duration',
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Get the sermon
      const { data: sermon, error: fetchError } = await supabase
        .from('sermons')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !sermon) {
        return res.status(404).json({ error: 'Sermon not found' });
      }

      if (!sermon.audio_url) {
        return res.status(400).json({ error: 'Sermon has no audio URL' });
      }

      // Try to get duration from the audio file
      let duration: number | null = null;

      try {
        // Use ffprobe to get duration (requires ffmpeg to be installed)
        const { execSync } = require('child_process');
        try {
          const output = execSync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:noprint_wrappers=1 "${sermon.audio_url}" 2>/dev/null || echo "0"`,
          )
            .toString()
            .trim();
          duration = parseFloat(output);

          if (isNaN(duration) || duration === 0) {
            duration = null;
          }
        } catch (ffprobeError) {
          console.warn('ffprobe not available, trying alternative method');
          // Fallback: try to use a simple HEAD request to estimate duration
          // This is a fallback and may not be accurate
          duration = null;
        }
      } catch (err) {
        console.error('Error calculating duration:', err);
      }

      if (!duration) {
        return res.status(400).json({
          error:
            'Could not calculate duration. Ensure ffmpeg is installed and the audio URL is accessible.',
        });
      }

      // Update the sermon with the calculated duration
      const { data, error: updateError } = await supabase
        .from('sermons')
        .update({
          duration: Math.round(duration),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      res.json({
        message: 'Duration calculated successfully',
        duration: Math.round(duration),
        sermon: data,
      });
    } catch (error) {
      console.error('Error calculating sermon duration:', error);
      res.status(500).json({ error: 'Failed to calculate duration' });
    }
  },
);

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

// POST /api/sermons/:id/calculate-duration - Calculate and store duration for a sermon

// DELETE /api/sermons/:id - Delete a sermon (admin only)
router.delete('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('sermons')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Sermon deleted successfully' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
});

export default router;

import { Request, Response, Router } from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase';
import { adminAuth } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload - Upload a file to Supabase Storage (admin only)
router.post(
  '/',
  adminAuth,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const bucket = req.body.bucket as string;
      if (!bucket) {
        return res.status(400).json({ error: 'Missing bucket name' });
      }

      const allowedBuckets = [
        'event-images',
        'sermon-audio',
        'sermon-video',
        'book-images',
        'blog-images',
        'blog-audio',
        'blog-video',
      ];

      if (!allowedBuckets.includes(bucket)) {
        return res
          .status(400)
          .json({
            error: `Invalid bucket. Allowed: ${allowedBuckets.join(', ')}`,
          });
      }

      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      res.status(201).json({
        message: 'File uploaded successfully',
        url: urlData.publicUrl,
        path: filePath,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  },
);

export default router;

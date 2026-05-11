import { NextFunction, Request, Response } from 'express';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res
      .status(401)
      .json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  next();
}

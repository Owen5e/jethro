import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables',
  );
}

// For Node.js < 22, we need to provide a WebSocket implementation
let realtimeConfig: { transport: any } | undefined = undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ws = require('ws');
  realtimeConfig = { transport: ws };
} catch {
  // ws not installed, will use native WebSocket (Node.js 22+)
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  ...(realtimeConfig && { realtime: realtimeConfig }),
});

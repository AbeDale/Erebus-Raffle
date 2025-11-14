// api/save-draw.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars', {
    supabaseUrl,
    hasKey: !!supabaseKey,
  });
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const { round, nextDrawAt, winners } = body || {};

    if (!round || !nextDrawAt) {
      return res.status(400).json({ error: 'Missing round or nextDrawAt' });
    }

    // Update the single raffle_state row (id = 1)
    const { error } = await supabase
      .from('raffle_state')
      .update({
        round,
        next_draw_at: nextDrawAt,
        winners: winners || [],
      })
      .eq('id', 1);

    if (error) {
      console.error('Supabase upsert error in save-draw:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Handler error in save-draw:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

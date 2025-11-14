// /api/get-state.js

import { createClient } from '@supabase/supabase-js';

// Read env vars (the ones you set in Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Basic sanity check – this will show up in Vercel logs if something is missing
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
  });
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('raffle_state')
      .select('*')
      .single(); // we expect exactly one row

    if (error) {
      console.error('Supabase error in /api/get-state:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // If there is no row yet, send a safe default instead of crashing
    if (!data) {
      return res.status(200).json({
        round: 1,
        nextDrawAt: null,
        winners: [],
      });
    }

    // All good – send the row to the frontend
    return res.status(200).json(data);
  } catch (err) {
    console.error('Unhandled error in /api/get-state:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

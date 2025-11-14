// api/get-state.js

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
  try {
    const { data, error } = await supabase
      .from('raffle_state')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Supabase error in get-state:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Handler error in get-state:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

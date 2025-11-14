// api/save-draw.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { round, nextDrawAt, winners } = body || {};

    if (!round || !nextDrawAt) {
      return res.status(400).json({ error: 'Missing round or nextDrawAt' });
    }

    const { error } = await supabase
      .from('raffle_state')
      .upsert(
        {
          id: 1,                         // keep a single row
          round,
          next_draw_at: nextDrawAt,
          winners: winners || [],
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Supabase error in /api/save-draw:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Unexpected error in /api/save-draw:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

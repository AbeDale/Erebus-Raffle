// api/save-draw.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars', { supabaseUrl, hasKey: !!supabaseKey });
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Expecting something like { round, nextDrawAt, winners }
    const { round, nextDrawAt, winners } = body || {};

    if (!round || !nextDrawAt) {
      return res.status(400).json({ error: 'Missing round or nextDrawAt' });
    }

    // 1) Upsert the current state
    const { error: stateError } = await supabase
      .from('raffle_state')
      .upsert(
        {
          id: 1, // single row pattern
          round,
          next_draw_at: nextDrawAt,
          winners: winners || null
        },
        { onConflict: 'id' }
      );

    if (stateError) {
      console.error('Supabase error in save-draw (state):', stateError);
      return res.status(500).json({ error: 'Database error updating state' });
    }

    // 2) Optionally add to history
    if (winners && winners.length) {
      const { error: historyError } = await supabase.from('raffle_history').insert({
        round,
        winners
      });

      if (historyError) {
        console.error('Supabase error in save-draw (history):', historyError);
        // Don’t fail the whole request because of history
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Unhandled error in save-draw:', err);
    return res.status(500).json({ error: 'Server error in save-draw' });
  }
};

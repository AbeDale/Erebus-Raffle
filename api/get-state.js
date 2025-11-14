// api/get-state.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('raffle_state')
      .select('round, next_draw_at, winners')
      .eq('id', 1)          // always the single state row
      .single();

    if (error) {
      console.error('Supabase error in /api/get-state:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Shape the JSON exactly for the UI
    return res.status(200).json({
      round: data.round,
      nextDrawAt: data.next_draw_at,  // camelCase for the front-end
      winners: data.winners || [],    // always an array
    });
  } catch (err) {
    console.error('Unexpected error in /api/get-state:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

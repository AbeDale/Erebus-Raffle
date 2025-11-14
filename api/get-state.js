// api/get-state.js

const { createClient } = require('@supabase/supabase-js');

// Read env vars from Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // This will show up in Vercel logs if env vars are missing
  console.error('Missing Supabase env vars', { supabaseUrl, hasKey: !!supabaseKey });
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  try {
    // Adjust table name/columns if your schema is different
    const { data, error } = await supabase
      .from('raffle_state')
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error in get-state:', error);
      return res.status(500).json({ error: 'Database error fetching raffle state' });
    }

    return res.status(200).json(data || {});
  } catch (err) {
    console.error('Unhandled error in get-state:', err);
    return res.status(500).json({ error: 'Server error in get-state' });
  }
};

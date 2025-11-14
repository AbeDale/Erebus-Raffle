import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('raffle_state')
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: "Database error" });

  return res.status(200).json(data);
}


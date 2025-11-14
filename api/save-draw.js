import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST required" });
  }

  const { winners, timestamp } = req.body;

  const { error } = await supabase
    .from('draw_history')
    .insert([{ winners, timestamp }]);

  if (error) return res.status(500).json({ error: "Failed to save draw" });

  await supabase
    .from('raffle_state')
    .update({
      last_winners: winners,
      last_draw: timestamp
    })
    .eq('id', 1);

  return res.status(200).json({ success: true });
}


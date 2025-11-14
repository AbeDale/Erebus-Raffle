// api/get-state.js

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('raffle_state')
    .select('*')
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Database error' })
  }

  return res.status(200).json(data)
}

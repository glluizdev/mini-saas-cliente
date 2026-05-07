const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mqfnjkvwzjcagfvtvvax.supabase.co'
const supabaseKey = 'sb_publishable_B1n-2oRxqrXyipM1UgzHwA_5Usa7XV3'

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase }
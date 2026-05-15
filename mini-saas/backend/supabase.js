const { createClient } = require('@supabase/supabase-js');

const supabaseUrl =
    'https://vcjzygsailgfhoojzzhr.supabase.co';

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjanp5Z3NhaWxnZmhvb2p6emhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTE2OTUsImV4cCI6MjA5Mzc4NzY5NX0.ycN6eCJEyOIfCkymOMSYi2F60H4TZ1GXNeP0yiDpwng';
const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

module.exports = supabase;
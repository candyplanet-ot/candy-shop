const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
  try {
    const { error } = await supabase.rpc('keep_alive');
    if (error) {
      console.error('Error calling keep_alive:', error.message);
    } else {
      console.log('Keep alive ping successful at', new Date().toISOString());
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

keepAlive();

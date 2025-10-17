import { createClient } from '@supabase/supabase-js';
import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// Cloudflare Worker script to automatically call keep_alive() every 5 minutes
// This uses the onScheduled handler for cron triggers

export async function onScheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
  try {
    // Create Supabase client using environment variables
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

    // Call the keep_alive() function via RPC
    const { error } = await supabase.rpc('keep_alive');

    if (error) {
      // Log error but continue (graceful error handling)
      console.error('Error calling keep_alive:', error.message);
    } else {
      // Log success
      console.log('Keep alive ping successful at', new Date().toISOString());
    }
  } catch (err) {
    // Catch any unexpected errors and log them
    console.error('Unexpected error in keepalive worker:', err);
  }
}

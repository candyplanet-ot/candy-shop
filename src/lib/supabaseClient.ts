import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// TEMP fallback to avoid runtime crash if .env not loaded yet
const fallbackUrl = "https://ljzwqhrnrgiqpvezqhba.supabase.co";
const fallbackAnon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqendxaHJucmdpcXB2ZXpxaGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjE0OTAsImV4cCI6MjA3NDEzNzQ5MH0.xuZPmZpDjTmIFxmN-RHSGtVG4Ozj3d6pmS45m3qBvSI";

const supabaseUrl = envUrl || fallbackUrl;
const supabaseAnonKey = envAnon || fallbackAnon;

if (!envUrl || !envAnon) {
  // eslint-disable-next-line no-console
  console.warn("Supabase env vars missing. Using temporary fallback keys. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



<<<<<<< HEAD
import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Remove fallback keys to force proper .env configuration
if (!envUrl || !envAnon) {
  throw new Error(
    "Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file and restart the development server."
  );
}

export const supabase = createClient(envUrl, envAnon);


=======
import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Remove fallback keys to force proper .env configuration
if (!envUrl || !envAnon) {
  throw new Error(
    "Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file and restart the development server."
  );
}

export const supabase = createClient(envUrl, envAnon);


>>>>>>> cf3b96f63dd429b0a17bbe128b6c7a693ae364f5

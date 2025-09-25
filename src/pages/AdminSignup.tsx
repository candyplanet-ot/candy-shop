import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("email");
    if (e) setEmail(e);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo") || "/admin";

    try {
      console.log("Starting signup process...");
      console.log("Email:", email);
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

      // Sign up with proper options
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            created_at: new Date().toISOString(),
          }
        }
      });

      console.log("Signup response:", { data, error: signUpError });

      if (signUpError) {
        throw signUpError;
      }

      // If email confirmations are OFF, user gets a session immediately
      if (data.session) {
        console.log("Signup successful with immediate session");
        setLoading(false);
        window.location.href = returnTo;
        return;
      }

      // If email confirmations are ON, user needs to confirm email
      if (data.user && !data.session) {
        console.log("Signup successful, email confirmation required");
        setLoading(false);
        alert("Please check your email and click the confirmation link to complete your registration.");
        window.location.href = "/login";
        return;
      }

      // Fallback: try to sign in (for edge cases)
      console.log("Attempting fallback sign in...");
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log("Sign in response:", { data: signInData, error: signInErr });

      if (signInErr || !signInData.session) {
        throw new Error(signInErr?.message || "Signup succeeded but login failed. Please try signing in manually.");
      }

      window.location.href = returnTo;

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-baloo font-bold mb-6">Create Account</h1>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-gradient-candy text-white" disabled={loading}>
              {loading ? "Creating..." : "Sign up"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AdminSignup;




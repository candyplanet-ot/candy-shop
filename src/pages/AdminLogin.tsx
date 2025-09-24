import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError || !data.session) {
      // Redirect new users to signup, prefill email, preserve returnTo
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/admin";
      window.location.href = `/signup?email=${encodeURIComponent(email)}&returnTo=${encodeURIComponent(returnTo)}`;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo") || "/admin";
    window.location.href = returnTo;
  };

  return (
    <div className="pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-baloo font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-gradient-candy text-white" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;



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
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.user) {
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/admin";
      window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
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



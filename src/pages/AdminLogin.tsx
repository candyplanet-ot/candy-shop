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
    if (!signInError && data.session) {
      setLoading(false);
      const params = new URLSearchParams(window.location.search);
      const explicitReturnTo = params.get("returnTo");
      if (explicitReturnTo) {
        window.location.href = explicitReturnTo;
        return;
      }
      // No explicit returnTo: route by role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();
      const isAdmin = profile?.role === "admin";
      window.location.href = isAdmin ? "/admin" : "/";
      return;
    }

    // If login failed, try to create a new account automatically
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email, password });
    if (!signUpErr) {
      // If email confirmations are off, Supabase may return session on signUp
      if (signUpData.session) {
        setLoading(false);
        const params = new URLSearchParams(window.location.search);
        const explicitReturnTo = params.get("returnTo");
        if (explicitReturnTo) {
          window.location.href = explicitReturnTo;
          return;
        }
        window.location.href = "/";
        return;
      }
      // If no session returned, sign in immediately
      const { data: signInAfterSignUp, error: signInAfterErr } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (!signInAfterErr && signInAfterSignUp.session) {
        const params = new URLSearchParams(window.location.search);
        const explicitReturnTo = params.get("returnTo");
        if (explicitReturnTo) {
          window.location.href = explicitReturnTo;
          return;
        }
        window.location.href = "/";
        return;
      }
      setError("Account created but automatic login failed. Please try signing in.");
      return;
    }

    // signUp failed. If user already exists, surface incorrect password
    setLoading(false);
    const msg = signUpErr?.message?.toLowerCase() || "";
    if (msg.includes("already registered") || msg.includes("user already exists") || msg.includes("already exists")) {
      setError("Incorrect password for existing account.");
    } else {
      setError(signInError?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-baloo font-bold mb-6">Login</h1>
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
            {(() => {
              const params = new URLSearchParams(window.location.search);
              const returnTo = params.get("returnTo") || "/";
              const signupHref = `/signup?returnTo=${encodeURIComponent(returnTo)}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
              return (
                <>
                  New here? <Link to={signupHref} className="text-primary hover:underline">Create an account</Link>
                </>
              );
            })()}
          </p>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;




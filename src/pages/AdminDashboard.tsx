import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthed(!!data.session);
      setLoading(false);
    };
    init();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <div className="pt-16 p-6">Loading...</div>;
  if (!isAuthed) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-baloo font-bold">Admin</h1>
          <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
        </div>
        <div className="grid gap-4">
          <div className="rounded-lg border p-4">
            <h2 className="font-bold mb-2">Products</h2>
            <p className="mb-3">Create, edit, and delete products.</p>
            <Link to="/admin/products">
              <Button>Open Products</Button>
            </Link>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-bold mb-2">Users</h2>
            <p className="mb-3">Assign roles to users (admin/staff/user).</p>
            <Link to="/admin/users">
              <Button>Open Users</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



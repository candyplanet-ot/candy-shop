import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type Props = { children: JSX.Element };

const ProtectedRoute = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setIsAuthed(false);
        setLoading(false);
        return;
      }

      // Only allow if DB role is admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      setIsAuthed(profile?.role === "admin");
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;



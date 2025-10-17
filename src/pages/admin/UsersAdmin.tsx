import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

type UserRow = {
  id: string;
  email: string | null;
  role: "user" | "admin" | "staff" | null;
  created_at: string | null;
};

const UsersAdmin = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("list_users_with_roles");
    if (!error && data) setUsers(data as UserRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id: string, role: "user" | "admin" | "staff") => {
    await supabase.rpc("set_user_role", { target_id: id, new_role: role });
    await load();
  };

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto grid gap-6">
        <h1 className="text-2xl font-baloo font-bold">Manage Users</h1>
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div>Loading...</div>
            ) : users.length === 0 ? (
              <div>No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2">Email</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Created</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="py-2">{u.email}</td>
                        <td className="py-2">{u.role ?? "user"}</td>
                        <td className="py-2">{u.created_at ?? ""}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setRole(u.id, "admin")}>Make Admin</Button>
                            <Button size="sm" variant="outline" onClick={() => setRole(u.id, "staff")}>Make Staff</Button>
                            <Button size="sm" variant="secondary" onClick={() => setRole(u.id, "user")}>Make User</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersAdmin;


=======
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

type UserRow = {
  id: string;
  email: string | null;
  role: "user" | "admin" | "staff" | null;
  created_at: string | null;
};

const UsersAdmin = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("list_users_with_roles");
    if (!error && data) setUsers(data as UserRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id: string, role: "user" | "admin" | "staff") => {
    await supabase.rpc("set_user_role", { target_id: id, new_role: role });
    await load();
  };

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto grid gap-6">
        <h1 className="text-2xl font-baloo font-bold">Manage Users</h1>
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div>Loading...</div>
            ) : users.length === 0 ? (
              <div>No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2">Email</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Created</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="py-2">{u.email}</td>
                        <td className="py-2">{u.role ?? "user"}</td>
                        <td className="py-2">{u.created_at ?? ""}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setRole(u.id, "admin")}>Make Admin</Button>
                            <Button size="sm" variant="outline" onClick={() => setRole(u.id, "staff")}>Make Staff</Button>
                            <Button size="sm" variant="secondary" onClick={() => setRole(u.id, "user")}>Make User</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersAdmin;





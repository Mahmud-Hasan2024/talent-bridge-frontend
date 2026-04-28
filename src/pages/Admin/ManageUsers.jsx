import { useEffect, useState } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { FiMail } from "react-icons/fi";

const ManageUsers = () => {
  const { authTokens, user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authTokens?.access || user?.role !== 'admin') {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await authApiClient.get("/auth/users/?no_pagination=true");
        const data = res.data.results || res.data;
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authTokens, user]);

  if (loading) return <div className="p-6 text-center">Loading users...</div>;
  if (error) return <div className="p-6 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-emerald-700">
        System Users ({users.length})
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              {/* 🎯 text-center added to headers */}
              <th className="text-center">ID</th>
              <th className="text-center">Full Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Role</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                {/* 🎯 text-center added to data cells */}
                <td className="text-center">{u.id}</td>
                <td className="font-medium text-center">
                  {u.first_name || u.last_name 
                    ? `${u.first_name || ''} ${u.last_name || ''}` 
                    : u.username || "System User"}
                </td>
                <td className="text-center">
                  {/* justify-center added to keep icon and text centered together */}
                  <div className="flex items-center justify-center gap-2">
                    <FiMail className="text-gray-400" />
                    {u.email}
                  </div>
                </td>
                <td className="text-center">
                  <span className={`badge capitalize ${
                    u.role === 'admin' ? 'badge-secondary' : 
                    u.role === 'employer' ? 'badge-primary' : 
                    u.role === 'seeker' ? 'badge-accent' : 'badge-ghost'
                  }`}>
                    {u.role || 'Guest'}
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {u.is_active ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <div className="badge badge-success badge-xs"></div> Active
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <div className="badge badge-error badge-xs"></div> Inactive
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
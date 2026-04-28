import { useEffect, useState } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { FiUser, FiMail, FiShield } from "react-icons/fi";

const ManageUsers = () => {
  const { authTokens, user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Security Check: Only admins should even attempt to fetch this
    if (!authTokens?.access || user?.role !== 'admin') {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Bypass pagination as you did with jobs/applications
        const res = await authApiClient.get("/users/?no_pagination=true");
        // DRF usually returns data directly if no_pagination is handled, 
        // or inside .results if using standard pagination
        const data = res.data.results || res.data;
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Ensure your backend endpoint exists.");
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
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td className="font-medium">
                  {u.first_name} {u.last_name}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    {u.email}
                  </div>
                </td>
                <td>
                  <span className={`badge capitalize ${
                    u.role === 'admin' ? 'badge-secondary' : 
                    u.role === 'employer' ? 'badge-primary' : 'badge-ghost'
                  }`}>
                    {u.role || 'Guest'}
                  </span>
                </td>
                <td>
                  {u.is_active ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <div className="badge badge-success badge-xs"></div> Active
                    </span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
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
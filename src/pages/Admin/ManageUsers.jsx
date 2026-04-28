import { useEffect, useState } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { FiMail, FiUser, FiShield } from "react-icons/fi";

const ManageUsers = () => {
  const { authTokens, user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🛡️ Security Check
    if (!authTokens?.access || user?.role !== 'admin') {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Calling the correct /auth/ prefix
        const res = await authApiClient.get("/auth/users/?no_pagination=true");
        
        // Handle both paginated and non-paginated responses
        const data = res.data.results || res.data;
        
        // 💡 Useful for debugging: Uncomment the line below to see data in your console
        // console.log("API User Data:", data);

        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Ensure your backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authTokens, user]);

  if (loading) return <div className="p-6 text-center text-emerald-600">Loading users...</div>;
  if (error) return <div className="p-6 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-700">
          System Users ({users.length})
        </h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="bg-emerald-50 text-emerald-900">ID</th>
              <th className="bg-emerald-50 text-emerald-900">Name</th>
              <th className="bg-emerald-50 text-emerald-900">Email</th>
              <th className="bg-emerald-50 text-emerald-900">Role</th>
              <th className="bg-emerald-50 text-emerald-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover">
                <td className="font-mono text-xs">{u.id}</td>
                <td className="font-medium">
                  {/* Fallback to username if first/last name are empty */}
                  {u.first_name || u.last_name 
                    ? `${u.first_name || ''} ${u.last_name || ''}` 
                    : u.username || "System User"}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    {u.email}
                  </div>
                </td>
                <td>
                  <span className={`badge border-none py-3 px-4 capitalize font-semibold ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                    u.role === 'employer' ? 'bg-blue-100 text-blue-700' : 
                    u.role === 'seeker' ? 'bg-orange-100 text-orange-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {u.role || 'Not Assigned'}
                  </span>
                </td>
                <td>
                  {/* Explicit boolean check to handle 0/1, true/false, or undefined */}
                  {u.is_active === true ? (
                    <span className="inline-flex items-center gap-1.5 text-green-600 font-bold">
                      <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-gray-400 font-medium">
                      <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                      Inactive
                    </span>
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
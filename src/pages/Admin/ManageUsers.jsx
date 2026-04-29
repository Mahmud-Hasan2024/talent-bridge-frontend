import { useEffect, useState } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { FiMail, FiUser, FiBriefcase, FiShield, FiUsers } from "react-icons/fi";

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

        // 🎯 Initial sort by ID ascending
        const sortedUsers = [...data].sort((a, b) => a.id - b.id);
        
        setUsers(sortedUsers);
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

  // --- Logic to Group Users by Role ---
  const groupedUsers = users.reduce((groups, u) => {
    const role = u.role || 'guest';
    if (!groups[role]) groups[role] = [];
    groups[role].push(u);
    return groups;
  }, {});

  // Define display order and styling for each role
  const roleConfig = {
    admin: { icon: FiShield, color: 'text-secondary', bg: 'bg-secondary/10', badge: 'badge-secondary' },
    employer: { icon: FiBriefcase, color: 'text-primary', bg: 'bg-primary/10', badge: 'badge-primary' },
    seeker: { icon: FiUser, color: 'text-accent', bg: 'bg-accent/10', badge: 'badge-accent' },
    guest: { icon: FiUsers, color: 'text-gray-500', bg: 'bg-gray-100', badge: 'badge-ghost' },
  };

  if (loading) return <div className="p-12 text-center"><span className="loading loading-spinner loading-lg text-emerald-600"></span></div>;
  if (error) return <div className="p-6 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-emerald-700">System Users</h2>
          <p className="text-gray-500">Manage and oversee all registered accounts</p>
        </div>
        <div className="flex gap-2">
          {Object.entries(groupedUsers).map(([role, list]) => (
            <div key={role} className="badge badge-outline gap-2 p-4 font-medium uppercase text-xs">
              {role}: {list.length}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {Object.keys(groupedUsers).map((role) => {
          const config = roleConfig[role] || roleConfig.guest;
          const RoleIcon = config.icon;

          return (
            <div key={role} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Role Section Header */}
              <div className={`p-4 px-6 flex items-center gap-3 border-b border-gray-100 ${config.bg}`}>
                <RoleIcon className={`text-xl ${config.color}`} />
                <h3 className={`text-lg font-bold capitalize ${config.color}`}>
                  {role}s ({groupedUsers[role].length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider">
                      <th className="text-center py-4">ID</th>
                      <th>Full Name</th>
                      <th>Email Contact</th>
                      <th className="text-center">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {groupedUsers[role].map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="text-center font-mono text-sm text-gray-400">#{u.id}</td>
                        <td>
                          <div className="font-semibold text-gray-800">
                            {u.first_name || u.last_name 
                              ? `${u.first_name || ''} ${u.last_name || ''}` 
                              : u.username || "System User"}
                          </div>
                          <div className="text-xs text-gray-400">Joined: {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : 'N/A'}</div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiMail className="text-gray-300" />
                            <span className="text-sm">{u.email}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center">
                            {u.is_active ? (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                ACTIVE
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                INACTIVE
                              </div>
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
        })}
      </div>
    </div>
  );
};

export default ManageUsers;
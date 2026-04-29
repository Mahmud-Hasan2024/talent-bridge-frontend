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

  const groupedUsers = users.reduce((groups, u) => {
    const role = u.role || 'guest';
    if (!groups[role]) groups[role] = [];
    groups[role].push(u);
    return groups;
  }, {});

  const roleConfig = {
    admin: { icon: FiShield, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    employer: { icon: FiBriefcase, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    seeker: { icon: FiUser, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
    guest: { icon: FiUsers, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  };

  if (loading) return <div className="p-12 text-center"><span className="loading loading-spinner loading-lg text-emerald-600"></span></div>;
  if (error) return <div className="p-6 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">System Users</h2>
          <p className="text-slate-600 font-medium">Manage and oversee all registered accounts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(groupedUsers).map(([role, list]) => (
            <div key={role} className="badge badge-lg bg-white border-slate-200 text-slate-700 gap-2 py-4 shadow-sm font-semibold uppercase text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
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
            <div key={role} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Header with better color balance */}
              <div className={`p-4 px-6 flex items-center gap-3 border-b ${config.border} ${config.bg}`}>
                <RoleIcon className={`text-xl ${config.color}`} />
                <h3 className={`text-lg font-bold capitalize ${config.color}`}>
                  {role}s <span className="opacity-60 text-sm font-medium">({groupedUsers[role].length})</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full border-collapse">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-slate-100">
                      <th className="text-center py-5 w-20">ID</th>
                      <th>User Details</th>
                      <th>Contact Information</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupedUsers[role].map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="text-center font-bold text-slate-500 text-sm">
                          #{u.id}
                        </td>
                        <td>
                          <div className="font-bold text-slate-800 text-base">
                            {u.first_name || u.last_name 
                              ? `${u.first_name || ''} ${u.last_name || ''}` 
                              : u.username || "System User"}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold uppercase tracking-tight">
                            Joined: {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 text-slate-700 group">
                            <FiMail className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            <span className="font-medium">{u.email}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center">
                            {u.is_active ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                ACTIVE
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
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
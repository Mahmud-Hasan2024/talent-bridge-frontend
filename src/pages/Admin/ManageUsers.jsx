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
    if (!authTokens?.access || user?.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await authApiClient.get("/auth/users/?no_pagination=true");
        const data = res.data.results || res.data || [];
        const sortedUsers = [...data].sort((a, b) => a.id - b.id);
        setUsers(sortedUsers);
        setError(null);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [authTokens, user]);

  const groupedUsers = users.reduce((groups, u) => {
    const role = u.role || "guest";
    if (!groups[role]) groups[role] = [];
    groups[role].push(u);
    return groups;
  }, {});

  const roleConfig = {
    admin: { icon: FiShield, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    employer: {
      icon: FiBriefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    seeker: { icon: FiUser, color: "text-blue-500", bg: "bg-blue-500/10" },
    guest: { icon: FiUsers, color: "text-base-content/70", bg: "bg-base-200" },
  };

  if (loading)
    return (
      <div className="p-12 text-center">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  if (error)
    return <div className="p-6 text-center text-error font-bold">{error}</div>;

  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            System Users
          </h2>
          <p className="text-base-content/60 font-medium">
            Manage and oversee all registered accounts
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(groupedUsers).map(([role, list]) => (
            <div
              key={role}
              className="badge badge-lg bg-base-100 border-base-300 text-base-content gap-2 py-4 shadow-sm font-semibold uppercase text-xs"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {role}: {list.length}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(groupedUsers).map((role) => {
          const config = roleConfig[role] || roleConfig.guest;
          const RoleIcon = config.icon;

          return (
            <div
              key={role}
              className="bg-base-100 rounded-2xl shadow-sm border border-base-300 overflow-hidden"
            >
              <div
                className={`p-4 px-6 flex items-center gap-3 border-b border-base-300 ${config.bg}`}
              >
                <RoleIcon className={`text-xl ${config.color}`} />
                <h3 className={`text-lg font-bold capitalize ${config.color}`}>
                  {role}s{" "}
                  <span className="opacity-60 text-sm font-medium">
                    ({groupedUsers[role].length})
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="text-base-content/50 text-xs uppercase tracking-widest border-b border-base-200">
                      <th className="text-center py-4 w-20">ID</th>
                      <th>User Details</th>
                      <th>Contact Information</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {groupedUsers[role].map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-base-200/40 transition-colors"
                      >
                        <td className="text-center font-bold text-base-content/60 text-sm">
                          #{u.id}
                        </td>
                        <td>
                          <div className="font-bold text-base-content text-base">
                            {u.first_name || u.last_name
                              ? `${u.first_name || ""} ${u.last_name || ""}`
                              : u.email?.split("@")[0] || "System User"}
                          </div>
                          <div className="text-xs text-base-content/50 font-semibold uppercase">
                            Joined:{" "}
                            {u.date_joined
                              ? new Date(u.date_joined).toLocaleDateString()
                              : "Active Member"}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 text-base-content/80">
                            <FiMail className="text-emerald-500" />
                            <span className="font-medium">{u.email}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          {u.is_active ? (
                            <span className="badge badge-success badge-sm text-white font-bold">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="badge badge-error badge-sm text-white font-bold">
                              INACTIVE
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
        })}
      </div>
    </div>
  );
};

export default ManageUsers;

import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  UserCheck,
  Search,
  Filter,
  Mail,
  Calendar,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import {
  getAllUsers,
  getUserStatistics,
  deleteUser,
} from "../../firebase/dbService";
import AdminLayout from "./AdminLayout";
import Modal from "../../components/Modal";
import {
  getInitials,
  getDisplayName,
  getProfileImageUrl,
  hasProfileImage,
} from "../../utils/profileUtils";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    boardingOwners: 0,
    boardingFinders: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [searchTerm, filterType, sortBy, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [allUsers, userStats] = await Promise.all([
        getAllUsers(),
        getUserStatistics(),
      ]);
      setUsers(allUsers);
      setStats(userStats);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          getDisplayName(user)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(
        (user) => user.role === filterType || user.userType === filterType
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return getDisplayName(a).localeCompare(getDisplayName(b));
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setDeletingUserId(selectedUser.id);
      setShowDeleteModal(false);

      await deleteUser(selectedUser.id);

      // Remove user from list
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== selectedUser.id));

      // Update stats
      setStats({
        ...stats,
        totalUsers: stats.totalUsers - 1,
        boardingOwners:
          selectedUser.role === "boarding_owner" ||
          selectedUser.userType === "boarding_owner"
            ? stats.boardingOwners - 1
            : stats.boardingOwners,
        boardingFinders:
          selectedUser.role === "boarding_finder" ||
          selectedUser.userType === "boarding_finder"
            ? stats.boardingFinders - 1
            : stats.boardingFinders,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeletingUserId(null);
      setSelectedUser(null);
    }
  };

  const getUserTypeLabel = (user) => {
    const role = user.role || user.userType || "boarding_finder";
    if (role === "admin") return "Admin";
    if (role === "boarding_owner") return "Boarding Owner";
    return "Boarding Finder";
  };

  const getUserTypeBadgeColor = (user) => {
    const role = user.role || user.userType || "boarding_finder";
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "boarding_owner") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3ABBD0]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#263D5D] mb-2">
          Users Management
        </h1>
        <p className="text-gray-600">Manage and monitor platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#3ABBD0]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-[#263D5D]">
                {stats.totalUsers}
              </h3>
            </div>
            <div className="w-12 h-12 bg-[#3ABBD0]/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-[#3ABBD0]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-300/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Boarding Owners</p>
              <h3 className="text-3xl font-bold text-[#263D5D]">
                {stats.boardingOwners}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-300/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Boarding Finders</p>
              <h3 className="text-3xl font-bold text-[#263D5D]">
                {stats.boardingFinders}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative lg:w-56">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="boarding_owner">Boarding Owners</option>
              <option value="boarding_finder">Boarding Finders</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent appearance-none bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Users Found
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterType !== "all"
              ? "No users match your filters"
              : "No users registered yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#3ABBD0] to-cyan-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {hasProfileImage(user) ? (
                            <img
                              src={getProfileImageUrl(user)}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            getInitials(user.firstName, user.lastName) || "?"
                          )}
                        </div>
                        <div className="font-semibold text-[#263D5D]">
                          {getDisplayName(user, "Unknown User")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getUserTypeBadgeColor(
                          user
                        )}`}
                      >
                        {getUserTypeLabel(user)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            disabled={deletingUserId === user.id}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3ABBD0] to-cyan-400 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                      {hasProfileImage(user) ? (
                        <img
                          src={getProfileImageUrl(user)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(user.firstName, user.lastName) || "?"
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[#263D5D]">
                        {getDisplayName(user, "Unknown User")}
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getUserTypeBadgeColor(
                          user
                        )}`}
                      >
                        {getUserTypeLabel(user)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      disabled={deletingUserId === user.id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User?"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this user? This action cannot be
            undone and will remove all user data from the system.
          </p>

          {selectedUser && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-semibold text-[#263D5D] mb-1">
                {getDisplayName(selectedUser)}
              </h4>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3ABBD0] to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
                {hasProfileImage(selectedUser) ? (
                  <img
                    src={getProfileImageUrl(selectedUser)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(selectedUser.firstName, selectedUser.lastName) ||
                  "?"
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#263D5D]">
                  {getDisplayName(selectedUser, "Unknown User")}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getUserTypeBadgeColor(
                    selectedUser
                  )}`}
                >
                  {getUserTypeLabel(selectedUser)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Email
                </label>
                <p className="text-[#263D5D] font-medium">
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Phone Number
                </label>
                <p className="text-[#263D5D] font-medium">
                  {selectedUser.phoneNumber || "Not provided"}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Date of Birth
                </label>
                <p className="text-[#263D5D] font-medium">
                  {selectedUser.dateOfBirth || "Not provided"}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Join Date
                </label>
                <p className="text-[#263D5D] font-medium">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">
                  Address
                </label>
                <p className="text-[#263D5D] font-medium">
                  {selectedUser.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;

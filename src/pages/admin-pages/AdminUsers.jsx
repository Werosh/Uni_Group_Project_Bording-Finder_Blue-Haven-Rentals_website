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
import RefreshButton from "../../components/RefreshButton";
import {
  getAllUsers,
  getUserStatistics,
  deleteUser,
  updateUserDetails,
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
  const [refreshing, setRefreshing] = useState(false);
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    role: "",
  });
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    title: "",
    message: "",
    onClose: null,
  });

  // Helper function to show alert modal
  const showAlert = (type, title, message, onClose = null) => {
    setAlertConfig({ type, title, message, onClose });
    setShowAlertModal(true);
  };

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchUsers(true);
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
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
    }
  }, [users, searchTerm, filterType, sortBy]);

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setDeletingUserId(selectedUser.id);
      setShowDeleteModal(false);

      // Show progress alert
      showAlert(
        "info",
        "Deleting User",
        "Comprehensive user deletion in progress. This may take a moment..."
      );

      // Call comprehensive deletion function
      const deletionResults = await deleteUser(selectedUser.id);

      // Check deletion results and show appropriate feedback
      const successCount = [
        deletionResults.userDocument,
        deletionResults.profileImages,
        deletionResults.idDocuments,
        deletionResults.userPosts,
        deletionResults.authAccount
      ].filter(Boolean).length;

      const totalOperations = 5;
      const hasErrors = deletionResults.errors.length > 0;

      if (successCount === totalOperations && !hasErrors) {
        // Complete success
        showAlert(
          "success",
          "User Deleted Successfully",
          `User "${getDisplayName(selectedUser)}" has been completely removed from the system. All associated data including profile images, ID documents, posts, and authentication account have been deleted.`
        );
      } else if (successCount > 0) {
        // Partial success
        const errorDetails = deletionResults.errors.length > 0 
          ? `\n\nSome operations failed:\n${deletionResults.errors.slice(0, 3).join('\n')}${deletionResults.errors.length > 3 ? `\n... and ${deletionResults.errors.length - 3} more errors` : ''}`
          : '';
        
        showAlert(
          "warning",
          "User Partially Deleted",
          `User "${getDisplayName(selectedUser)}" has been partially deleted. ${successCount}/${totalOperations} operations completed successfully.${errorDetails}`
        );
      } else {
        // Complete failure
        throw new Error("All deletion operations failed");
      }

      // Remove user from list only if user document was successfully deleted
      if (deletionResults.userDocument) {
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
      }

    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert(
        "error",
        "Delete Failed",
        `Failed to delete user "${getDisplayName(selectedUser)}". ${error.message}`
      );
    } finally {
      setDeletingUserId(null);
      setSelectedUser(null);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      dateOfBirth: user.dateOfBirth || "",
      role: user.role || user.userType || "boarding_finder",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setEditingUserId(selectedUser.id);

      await updateUserDetails(selectedUser.id, editFormData);

      // Update user in list
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, ...editFormData } : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      setShowEditModal(false);
      setSelectedUser(null);
      setEditFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        role: "",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      showAlert(
        "error",
        "Update Failed",
        "Failed to update user. Please try again."
      );
    } finally {
      setEditingUserId(null);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#263D5D] mb-2">
              Users Management
            </h1>
            <p className="text-gray-600">Manage and monitor platform users</p>
          </div>
          <RefreshButton
            onRefresh={handleRefresh}
            loading={refreshing}
            title="Refresh users data"
          />
        </div>
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
                        <button
                          onClick={() => handleEditUser(user)}
                          disabled={editingUserId === user.id}
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors disabled:opacity-50"
                          title="Edit User"
                        >
                          <Edit className="w-5 h-5" />
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
                  <button
                    onClick={() => handleEditUser(user)}
                    disabled={editingUserId === user.id}
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    <Edit className="w-5 h-5" />
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
        title="Comprehensive User Deletion"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h4 className="font-semibold text-red-800">Warning: This action is irreversible</h4>
            </div>
            <p className="text-sm text-red-700">
              This will permanently delete the user and ALL associated data from the system.
            </p>
          </div>

          {selectedUser && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-[#263D5D] mb-2">
                User: {getDisplayName(selectedUser)}
              </h4>
              <p className="text-sm text-gray-600 mb-3">{selectedUser.email}</p>
              
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800 text-sm">The following data will be deleted:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    User document from Firestore
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Profile images from Firebase Storage
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ID verification documents (front & back)
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    All user posts and associated images
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Firebase Authentication account
                  </li>
                </ul>
              </div>
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
              disabled={deletingUserId === selectedUser?.id}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {deletingUserId === selectedUser?.id ? "Deleting..." : "Delete User Completely"}
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

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                First Name
              </label>
              <input
                type="text"
                value={editFormData.firstName}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    firstName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Last Name
              </label>
              <input
                type="text"
                value={editFormData.lastName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, lastName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">Email</label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Phone Number
              </label>
              <input
                type="tel"
                value={editFormData.phoneNumber}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    phoneNumber: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Date of Birth
              </label>
              <input
                type="date"
                value={editFormData.dateOfBirth}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    dateOfBirth: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">Role</label>
              <select
                value={editFormData.role}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, role: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
              >
                <option value="boarding_finder">Boarding Finder</option>
                <option value="boarding_owner">Boarding Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 mb-1 block">
                Address
              </label>
              <textarea
                value={editFormData.address}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, address: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="Enter address"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateUser}
              disabled={editingUserId === selectedUser?.id}
              className="flex-1 px-4 py-3 bg-[#3ABBD0] hover:bg-[#3ABBD0]/90 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {editingUserId === selectedUser?.id
                ? "Updating..."
                : "Update User"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Alert Modal */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => {
          setShowAlertModal(false);
          if (alertConfig.onClose) {
            alertConfig.onClose();
          }
        }}
        title={alertConfig.title}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                alertConfig.type === "error"
                  ? "bg-red-100"
                  : alertConfig.type === "warning"
                  ? "bg-yellow-100"
                  : alertConfig.type === "success"
                  ? "bg-green-100"
                  : "bg-blue-100"
              }`}
            >
              {alertConfig.type === "error" && (
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {alertConfig.type === "warning" && (
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
              {alertConfig.type === "success" && (
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {alertConfig.type === "info" && (
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-gray-700 whitespace-pre-line">
                {alertConfig.message}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                setShowAlertModal(false);
                if (alertConfig.onClose) {
                  alertConfig.onClose();
                }
              }}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                alertConfig.type === "error"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : alertConfig.type === "warning"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : alertConfig.type === "success"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;

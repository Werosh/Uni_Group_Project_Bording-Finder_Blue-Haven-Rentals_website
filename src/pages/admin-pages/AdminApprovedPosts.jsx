import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Search,
  Filter,
  Home,
  User,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";
import {
  getPostsByStatus,
  updatePost,
  deletePost,
} from "../../firebase/dbService";
import AdminLayout from "./AdminLayout";
import Modal from "../../components/Modal";

const CATEGORIES = [
  "Single Rooms",
  "Double Rooms",
  "Boarding Houses",
  "Hostels",
  "Sharing Rooms",
  "Annexes",
  "Houses",
  "Apartments",
  "Single Bedrooms",
];

const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

const AdminApprovedPosts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, filterCategory, posts]);

  const fetchApprovedPosts = async () => {
    try {
      setLoading(true);
      const approvedPosts = await getPostsByStatus("approved");
      setPosts(approvedPosts);
      setFilteredPosts(approvedPosts);
    } catch (error) {
      console.error("Error fetching approved posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((post) => post.category === filterCategory);
    }

    setFilteredPosts(filtered);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditFormData({
      title: post.title || "",
      category: post.category || "",
      location: post.location || "",
      description: post.description || "",
      rent: post.rent || "",
      forWhom: post.forWhom || "",
      email: post.email || "",
      mobile: post.mobile || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!selectedPost) return;

    try {
      setProcessingId(selectedPost.id);
      setShowEditModal(false);

      // Update post in Firestore
      await updatePost(selectedPost.id, {
        title: editFormData.title,
        category: editFormData.category,
        location: editFormData.location,
        description: editFormData.description,
        rent: Number(editFormData.rent),
        forWhom: editFormData.forWhom,
        email: editFormData.email,
        mobile: editFormData.mobile,
      });

      // Update local state
      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id
          ? { ...post, ...editFormData, rent: Number(editFormData.rent) }
          : post
      );
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setProcessingId(null);
      setSelectedPost(null);
      setEditFormData({});
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPost) return;

    try {
      setProcessingId(selectedPost.id);
      setShowDeleteModal(false);

      await deletePost(selectedPost.id);

      // Remove post from list
      setPosts(posts.filter((p) => p.id !== selectedPost.id));
      setFilteredPosts(filteredPosts.filter((p) => p.id !== selectedPost.id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setProcessingId(null);
      setSelectedPost(null);
    }
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
          Approved Posts Management
        </h1>
        <p className="text-gray-600">
          View, edit, and manage all approved posts on the platform
        </p>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Total Approved Posts</p>
            <h3 className="text-4xl font-bold">{posts.length}</h3>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Home className="w-8 h-8 text-white" />
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
              placeholder="Search by title, location, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative lg:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPosts.length} of {posts.length} approved posts
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Approved Posts
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterCategory !== "all"
              ? "No posts match your filters"
              : "No approved posts yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center flex-shrink-0">
                  {post.imageUrls && post.imageUrls.length > 0 ? (
                    <img
                      src={post.imageUrls[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Home className="w-16 h-16 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#263D5D] mb-2">
                        {post.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{post.location}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{post.ownerName}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[#263D5D] font-bold text-lg">
                          <span>Rs. {post.rent?.toLocaleString()}</span>
                          <span className="text-sm font-normal text-gray-500">
                            / month
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-3">
                      <button
                        onClick={() => handleEdit(post)}
                        disabled={processingId === post.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit className="w-5 h-5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(post)}
                        disabled={processingId === post.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Post"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={editFormData.title || ""}
                onChange={handleEditFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="Enter post title"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Category *
              </label>
              <select
                name="category"
                value={editFormData.category || ""}
                onChange={handleEditFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Location *
              </label>
              <select
                name="location"
                value={editFormData.location || ""}
                onChange={handleEditFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select location</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* For Whom */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                For Whom *
              </label>
              <select
                name="forWhom"
                value={editFormData.forWhom || ""}
                onChange={handleEditFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select</option>
                <option value="Students">Students</option>
                <option value="Families">Families</option>
                <option value="Professionals">Professionals</option>
              </select>
            </div>

            {/* Rent */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Rent (Rs.) *
              </label>
              <input
                type="number"
                name="rent"
                value={editFormData.rent || ""}
                onChange={handleEditFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="Enter monthly rent"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={editFormData.description || ""}
                onChange={handleEditFormChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent resize-none"
                placeholder="Enter property description"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="email"
                value={editFormData.email || ""}
                onChange={handleEditFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="owner@example.com"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Mobile Number *
              </label>
              <input
                type="text"
                name="mobile"
                value={editFormData.mobile || ""}
                onChange={handleEditFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:border-transparent"
                placeholder="771234567"
                maxLength={9}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-4 py-3 bg-[#3ABBD0] hover:bg-[#2BA9C1] text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post?"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this post? This action cannot be
            undone and will permanently remove the post from the platform.
          </p>

          {selectedPost && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-semibold text-[#263D5D] mb-1">
                {selectedPost.title}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedPost.location} • Rs.{" "}
                {selectedPost.rent?.toLocaleString()}
              </p>
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
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
            >
              Delete Post
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminApprovedPosts;

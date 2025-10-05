import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, getPostsByOwner } from "../../firebase/dbService";
import { Link } from "react-router-dom";
import {
  getInitials,
  getFullName,
  getDisplayName,
  getProfileImageUrl,
  hasProfileImage,
} from "../../utils/profileUtils";
import EditPostModal from "../../components/EditPostModal";

const UserPage = () => {
  const { user, userProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && userProfile) {
        try {
          // Fetch detailed profile data
          const profileData = await getUserProfile(user.uid);
          setProfile(profileData);

          // Fetch user's posts
          const userPosts = await getPostsByOwner(user.uid);
          setPosts(userPosts.filter((post) => post.status !== "draft"));
          setDrafts(userPosts.filter((post) => post.status === "draft"));

          // Mock reviews data for now
          setReviews([
            {
              id: 1,
              reviewerName: "Adam Sandler",
              reviewerImage: null,
              rating: 5,
              reviewText:
                "We are so grateful for the incredible wedding photos you captured! Every moment feels alive in the pictures, and we can't stop looking at them. Thank you for making our day so memorable!",
              timeAgo: "1 hour ago",
              likes: 100000,
              hasReply: true,
            },
            {
              id: 2,
              reviewerName: "Adam Sandler",
              reviewerImage: null,
              rating: 5,
              reviewText:
                "We are so grateful for the incredible wedding photos you captured! Every moment feels alive in the pictures, and we can't stop looking at them. Thank you for making our day so memorable!",
              timeAgo: "1 hour ago",
              likes: 100000,
              hasReply: true,
            },
          ]);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, userProfile]);

  const formatMemberSince = (createdAt) => {
    if (!createdAt) return "December 28, 2018";
    const date = new Date(createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRent = (rent) => {
    if (rent === undefined || rent === null || isNaN(rent)) {
      return "Rent not set";
    }
    return `Rs. ${rent.toLocaleString()}/=`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Pending
          </div>
        );
      case "approved":
        return (
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Approved
          </div>
        );
      default:
        return null;
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleEditSuccess = async () => {
    // Refresh posts data
    try {
      const userPosts = await getPostsByOwner(user.uid);
      setPosts(userPosts.filter((post) => post.status !== "draft"));
      setDrafts(userPosts.filter((post) => post.status === "draft"));
    } catch (error) {
      console.error("Error refreshing posts:", error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingPost(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-400 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAxMDAwIDMwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc4QkU4Ii8+CjxyZWN0IHg9IjAiIHk9IjIwMCIgd2lkdGg9IjEwMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNjQ4Q0U4Ii8+CjxyZWN0IHg9IjAiIHk9IjI1MCIgd2lkdGg9IjEwMDAiIGhlaWdodD0iNTAiIGZpbGw9IiM4OEE4RjgiLz4KPC9zdmc+')",
          }}
        ></div>

        {/* Edit Profile Button */}
        <Link
          to="/user/edit"
          className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Profile
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Profile Picture */}
              <div className="flex justify-center -mt-16 mb-6">
                {hasProfileImage(profile) ? (
                  <img
                    src={getProfileImageUrl(profile)}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-blue-100 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      {getInitials(profile.firstName, profile.lastName)}
                    </span>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
                {getDisplayName(profile, "User")}
              </h1>

              {/* About Me Section */}
              <div className="border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">About me</h3>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {profile.description ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
                </p>
              </div>

              {/* Location Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  {profile.address ||
                    "Level 5, Hemas House No 75 Bray-brooke place, Colombo 02"}
                </p>
              </div>

              {/* Member Since */}
              <div>
                <p className="text-gray-600 text-sm">
                  Member since: {formatMemberSince(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === "posts"
                        ? "text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Posts
                  </button>
                  <button
                    onClick={() => setActiveTab("drafts")}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === "drafts"
                        ? "text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Drafts
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === "reviews"
                        ? "text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Reviews
                  </button>
                </div>

                {activeTab === "reviews" && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add Review
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === "posts" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={
                            post.images && post.images[0]
                              ? post.images[0]
                              : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNFNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+"
                          }
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          {getStatusIcon(post.status)}
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white p-1 rounded transition-all"
                            title="Edit post"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button className="bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white p-1 rounded transition-all">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-blue-600 font-bold text-lg">
                          {formatRent(post.rent)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Create New Post Card */}
                  <Link
                    to="/post-add"
                    className="bg-white border-2 border-blue-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">Create new post</p>
                  </Link>
                </div>
              )}

              {activeTab === "drafts" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drafts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={
                            post.images && post.images[0]
                              ? post.images[0]
                              : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNFNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+"
                          }
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <div className="bg-blue-600 text-white p-1 rounded">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white p-1 rounded transition-all"
                            title="Edit draft"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-blue-600 font-bold text-lg">
                          {formatRent(post.rent)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Create More Posts Card */}
                  <Link
                    to="/post-add"
                    className="bg-white border-2 border-blue-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">
                      Create more posts
                    </p>
                  </Link>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {review.reviewerName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.reviewerName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {review.timeAgo}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-teal-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-gray-700 mb-4">{review.reviewText}</p>

                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>{review.likes.toLocaleString()}k</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <span>Reply</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16l-4-4m0 0l4-4m-4 4h18"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        post={editingPost}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default UserPage;

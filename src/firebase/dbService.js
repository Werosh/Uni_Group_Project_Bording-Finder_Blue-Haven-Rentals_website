import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// CREATE
export const addPlace = async (placeData) => {
  const colRef = collection(db, "places");
  return await addDoc(colRef, placeData);
};

// READ
export const getPlaces = async () => {
  const colRef = collection(db, "places");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// UPDATE
export const updatePlace = async (id, updatedData) => {
  const docRef = doc(db, "places", id);
  return await updateDoc(docRef, updatedData);
};

// DELETE
export const deletePlace = async (id) => {
  const docRef = doc(db, "places", id);
  return await deleteDoc(docRef);
};

// POST OPERATIONS

// Create a new post
export const createPost = async (postData) => {
  const colRef = collection(db, "posts");
  const docRef = await addDoc(colRef, {
    ...postData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending", // pending, approved, declined, active (default to pending for review)
  });
  return docRef;
};

// Get all posts
export const getPosts = async () => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get posts by location
export const getPostsByLocation = async (location) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter((post) => post.location === location);
};

// Get posts by category
export const getPostsByCategory = async (category) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter((post) => post.category === category);
};

// Get posts by owner
export const getPostsByOwner = async (ownerId) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter((post) => post.ownerId === ownerId);
};

// Get single post by ID
export const getPost = async (id) => {
  const docRef = doc(db, "posts", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

// Update a post
export const updatePost = async (id, updatedData) => {
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
};

// Edit a post (handles status transitions)
export const editPost = async (id, updatedData) => {
  const docRef = doc(db, "posts", id);
  const postDoc = await getDoc(docRef);

  if (!postDoc.exists()) {
    throw new Error("Post not found");
  }

  const currentPost = postDoc.data();

  // Determine new status based on current status
  let newStatus = currentPost.status;
  let updateData = {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  // If the post was approved and is being edited, change status to pending
  if (currentPost.status === "approved") {
    newStatus = "pending";
    updateData.status = newStatus;
    updateData.editedAt = new Date().toISOString();
    updateData.isEdited = true;
  }
  // If the post was declined and is being edited, change status to pending and clear decline data
  else if (currentPost.status === "declined") {
    newStatus = "pending";
    updateData.status = newStatus;
    updateData.editedAt = new Date().toISOString();
    updateData.isEdited = true;
    updateData.declineReason = null;
    updateData.declinedAt = null;
    updateData.resubmittedAt = new Date().toISOString();
  }

  await updateDoc(docRef, updateData);

  return { id, ...updatedData, status: newStatus };
};

// Delete a post
export const deletePost = async (id) => {
  const docRef = doc(db, "posts", id);
  return await deleteDoc(docRef);
};

// USER PROFILE OPERATIONS

// Create user profile with specific UID
export const createUserProfile = async (uid, userData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...userData,
    userType: userData.userType || "boarding_finder", // Store user type (boarding_finder or boarding_owner)
    role: userData.userType || userData.role || "boarding_finder", // Also store as role for backwards compatibility
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return userRef;
};

// Get user profile by UID
export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

// Update user profile
export const updateUserProfile = async (uid, updatedData) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
};

// Get all users
export const getAllUsers = async () => {
  const colRef = collection(db, "users");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Delete user
export const deleteUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  return await deleteDoc(userRef);
};

// ADMIN-SPECIFIC FUNCTIONS

// Get posts by status (pending, approved, declined)
export const getPostsByStatus = async (status) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter((post) => post.status === status);
};

// Get declined posts by owner
export const getDeclinedPostsByOwner = async (ownerId) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter(
    (post) => post.ownerId === ownerId && post.status === "declined"
  );
};

// Get edited posts that need re-approval
export const getEditedPosts = async () => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter(
    (post) => post.isEdited === true && post.status === "pending"
  );
};

// Update post status
export const updatePostStatus = async (
  postId,
  status,
  declineReason = null
) => {
  const docRef = doc(db, "posts", postId);
  const updateData = {
    status: status,
    updatedAt: new Date().toISOString(),
  };

  // If approving a post, clear the edited flag
  if (status === "approved") {
    updateData.isEdited = false;
    updateData.editedAt = null;
  }

  // If declining a post, add decline reason and timestamp
  if (status === "declined") {
    updateData.declineReason = declineReason;
    updateData.declinedAt = new Date().toISOString();
  }

  await updateDoc(docRef, updateData);
};

// Get user statistics
export const getUserStatistics = async () => {
  const colRef = collection(db, "users");
  const snapshot = await getDocs(colRef);
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const stats = {
    totalUsers: users.length,
    boardingOwners: users.filter(
      (u) => u.role === "boarding_owner" || u.userType === "boarding_owner"
    ).length,
    boardingFinders: users.filter(
      (u) => u.role === "boarding_finder" || u.userType === "boarding_finder"
    ).length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return stats;
};

// Get post statistics
export const getPostStatistics = async () => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const stats = {
    totalPosts: posts.length,
    pendingPosts: posts.filter((p) => p.status === "pending").length,
    approvedPosts: posts.filter((p) => p.status === "approved").length,
    declinedPosts: posts.filter((p) => p.status === "declined").length,
    activePosts: posts.filter((p) => p.status === "active").length,
  };

  return stats;
};

// Get analytics data
export const getAnalyticsData = async () => {
  const postsColRef = collection(db, "posts");
  const usersColRef = collection(db, "users");

  const [postsSnapshot, usersSnapshot] = await Promise.all([
    getDocs(postsColRef),
    getDocs(usersColRef),
  ]);

  const posts = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const users = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Posts by category
  const categoryCounts = {};
  posts.forEach((post) => {
    const category = post.category || "Uncategorized";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  // Posts by location
  const locationCounts = {};
  posts.forEach((post) => {
    const location = post.location || "Unknown";
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });

  // User growth over time (by month)
  const userGrowth = {};
  users.forEach((user) => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      userGrowth[monthYear] = (userGrowth[monthYear] || 0) + 1;
    }
  });

  // User status distribution
  const userStatusDistribution = {
    active: users.filter((u) => !u.inactive).length,
    inactive: users.filter((u) => u.inactive).length,
    pending: users.filter((u) => u.status === "pending").length,
  };

  return {
    postsByCategory: Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    })),
    postsByLocation: Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10), // Top 10 locations
    userGrowth: Object.entries(userGrowth)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    userStatusDistribution,
  };
};

// ADMIN-SPECIFIC USER MANAGEMENT FUNCTIONS

// Update user details (admin function)
export const updateUserDetails = async (userId, updatedData) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
  return { id: userId, ...updatedData };
};

// Get user by ID (admin function)
export const getUserById = async (userId) => {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

// Update user role (admin function)
export const updateUserRole = async (userId, newRole) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    role: newRole,
    userType: newRole, // Also update userType for backwards compatibility
    updatedAt: new Date().toISOString(),
  });
  return { id: userId, role: newRole };
};

// Deactivate/Activate user (admin function)
export const toggleUserStatus = async (userId, isActive) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    inactive: !isActive,
    updatedAt: new Date().toISOString(),
  });
  return { id: userId, inactive: !isActive };
};

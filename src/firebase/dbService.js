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
    status: "active", // active, inactive, pending
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

import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
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

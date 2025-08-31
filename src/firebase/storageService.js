import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// UPLOAD
export const uploadImage = async (file, path) => {
  const storageRef = ref(storage, `${path}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef); // returns public image URL
};

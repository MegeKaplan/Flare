import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseConfig } from "../config/db/firebaseConfig.js";
import MESSAGES from "../constants/messages.js";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage);

export const uploadFiles = async (files) => {
  try {
    const uploadedFiles = [];

    for (const file of files) {
      const imageRef = ref(storageRef, "images/" + file.originalname);
      await uploadBytes(imageRef, file.buffer);
      const downloadUrl = await getDownloadURL(imageRef);
      uploadedFiles.push({ name: file.originalname, url: downloadUrl });
    }

    return uploadedFiles;
  } catch (error) {
    return { message: MESSAGES.ERROR_OCCURRED, error: error.message };
  }
};

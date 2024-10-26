import { uploadFiles } from "../services/storageService.js";
import MESSAGES from "../constants/messages.js";

export const uploadToStorage = async (req, res) => {
  try {
    const uploadedFiles = await uploadFiles(req.files);

    res.status(201).json({
      message:
        (await req.files.length) > 1
          ? MESSAGES.FILES_UPLOAD_SUCCESS
          : MESSAGES.FILE_UPLOAD_SUCCESS,
      response: uploadedFiles,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

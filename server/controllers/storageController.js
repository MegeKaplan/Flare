import db from "../config/db/db_conn.js";
import { uploadFiles } from "../services/storageService.js";
import MESSAGES from "../constants/messages.js";

export const uploadToStorage = async (req, res) => {
  try {
    const uploadedFiles = await uploadFiles(req.files);
    const { tableName, id } = req.body;

    if (!(["post_images", "user_images"].includes(tableName) && id)) {
      return res.status(400).json({
        message: MESSAGES.MISSING_PARAMETERS,
      });
    }

    const files = [];
    for (const file of uploadedFiles) {
      tableName === "post_images"
        ? files.push({ post_id: id, image_url: file.url })
        : files.push({ user_id: id, image_url: file.url });
    }
    await db(tableName).insert(files);

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

export const deleteFromDB = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableName } = req.query;

    if (!(["post_images", "user_images"].includes(tableName) && id)) {
      return res.status(400).json({
        message: MESSAGES.MISSING_PARAMETERS,
      });
    }

    const files = await db(tableName).where(
      tableName === "post_images" ? { post_id: id } : { user_id: id }
    );
    if (files.length === 0) {
      return res.status(404).json({
        message: MESSAGES.FILE_NOT_FOUND,
      });
    }

    await db(tableName)
      .where(tableName === "post_images" ? { post_id: id } : { user_id: id })
      .del();

    res.status(200).json({
      message: MESSAGES.FILES_DELETE_SUCCESS,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

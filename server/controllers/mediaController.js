import db from "../config/db/db_conn.js";
import { uploadFilesToCloudinary } from "../services/cloudinaryService.js";
import MESSAGES from "../constants/messages.js";
import compressFiles from "../utils/compressFiles.js";

export const uploadFiles = async (req, res) => {
  try {
    const { type, id } = req.query;

    const compressedFiles = await compressFiles(req.files);

    const uploadedFiles = await uploadFilesToCloudinary(
      { type, id },
      compressedFiles
    );

    if (!(["post", "user"].includes(type) && id)) {
      return res.status(400).json({
        message: MESSAGES.MISSING_PARAMETERS,
      });
    }

    const files = [];
    for (const file of uploadedFiles) {
      let fileData;

      if (type == "post") {
        const existingFile = await db("post_images")
          .where({
            post_id: id,
            filename: `${file.display_name}.${file.format}`,
          })
          .first();

        if (existingFile) {
          fileData = {
            ...existingFile,
            image_url: file.secure_url,
            media_order: file.original_filename.split("-")[1],
          };
          await db("post_images")
            .where({ id: existingFile.id })
            .update(fileData);
        } else {
          fileData = {
            post_id: id,
            image_url: file.secure_url,
            filename: `${file.display_name}.${file.format}`,
            media_order: file.original_filename.split("-")[1],
          };
          await db("post_images").insert(fileData);
        }
      } else {
        const existingFile = await db("user_images")
          .where({
            user_id: id,
            filename: `${file.display_name}.${file.format}`,
          })
          .first();

        if (existingFile) {
          fileData = {
            ...existingFile,
            image_url: file.secure_url,
          };
          await db("user_images")
            .where({ id: existingFile.id })
            .update(fileData);
        } else {
          fileData = {
            user_id: id,
            image_url: file.secure_url,
            filename: `${file.display_name}.${file.format}`,
            media_order: file.original_filename.split("-")[1],
          };
          await db("user_images").insert(fileData);
        }
      }

      files.push(fileData);
    }

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

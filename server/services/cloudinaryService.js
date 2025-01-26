import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../config/db/cloudinaryConfig.js";
import sanitizeFilename from "../utils/sanitizeFilename.js";

cloudinary.config(cloudinaryConfig);

const uploadFilesToCloudinary = async ({ type, id }, files) => {
  try {
    var id = id.padStart(6, "0");
    var folderName = `${type}s`;
    if (type == "post") {
      folderName = `posts`;
    } else if (type == "user") {
      folderName = `users`;
    } else {
      folderName = `${type}s`;
    }

    const uploadPromises = await files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            public_id: sanitizeFilename(`${id}-0${index + 1}`),
            folder: `flare/${folderName}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    return results;
  } catch (error) {
    throw error;
  }
};

export { uploadFilesToCloudinary };

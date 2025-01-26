import dotenv from "dotenv";

dotenv.config();

export const cloudinaryConfig = {
  secure: true,
};

export const cloudinaryUploadOptions = {
  folder: "flare",
  resource_type: "auto",
  use_filename: true,
  unique_filename: true,
  overwrite: true,
};

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9_-]/g, "_");
};

export default sanitizeFilename;

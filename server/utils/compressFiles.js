import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supportedFileFormats = [
  ".mp4",
  ".mkv",
  ".avi",
  ".mov",
  ".wmv",
  ".flv",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".bmp",
  ".tiff",
  ".gif",
];

const videoConfig = {
  crf: 30,
  preset: "ultrafast",
  videoBitrate: "1M",
  audioBitrate: "128k",
  resolution: "-2:480",
  fps: 20,
  videoCodec: "libx264",
  audioCodec: "aac",
  fileFormat: "mp4",
};

const imageConfig = {
  quality: 25,
  width: 1080,
  format: "webp",
};

const gifConfig = {
  quality: 25,
  format: "webp",
};

const compressVideo = (file, config) => {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(__dirname, "temp", `input-${Date.now()}.mp4`);
    const outputPath = path.join(
      __dirname,
      "temp",
      `output-${Date.now()}.${config.format}`
    );

    fs.writeFile(inputPath, file.buffer, (writeErr) => {
      if (writeErr) {
        return reject(writeErr);
      }

      ffmpeg(inputPath)
        .output(outputPath)
        .outputOptions([
          `-crf ${config.crf}`,
          `-preset ${config.preset}`,
          `-b:v ${config.videoBitrate}`,
          `-b:a ${config.audioBitrate}`,
          `-vf scale=${config.resolution}`,
          `-r ${config.fps}`,
        ])
        .videoCodec(config.videoCodec)
        .audioCodec(config.audioCodec)
        .format(config.fileFormat)
        // .on("start", (cmd) => console.log("FFmpeg command:", cmd))
        .on("error", (err) => {
          return reject(err);
        })
        .on("end", () => {
          fs.readFile(outputPath, (readErr, compressedBuffer) => {
            if (readErr) {
              return reject(readErr);
            }

            resolve(compressedBuffer);

            fs.unlink(inputPath, (unlinkInputErr) => {
              if (unlinkInputErr) {
                // console.warn("Failed to delete input file:", unlinkInputErr);
              }
            });

            fs.unlink(outputPath, (unlinkOutputErr) => {
              if (unlinkOutputErr) {
                // console.warn("Failed to delete output file:", unlinkOutputErr);
              }
            });
          });
        })
        .run();
    });
  });
};

const compressGif = (file, config) => {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(__dirname, "temp", `input-${Date.now()}.gif`);
    const outputPath = path.join(
      __dirname,
      "temp",
      `output-${Date.now()}.${config.format}`
    );

    fs.writeFile(inputPath, file.buffer, (writeErr) => {
      if (writeErr) {
        return reject(writeErr);
      }

      ffmpeg(inputPath)
        .output(outputPath)
        .outputOptions([`-c:v libwebp`, `-loop 0`, `-q:v ${config.quality}`])
        // .on("start", (cmd) => console.log("FFmpeg command:", cmd))
        .on("error", (err) => {
          // console.error("FFmpeg Error:", err);
          return reject(err);
        })
        .on("end", () => {
          fs.readFile(outputPath, (readErr, compressedBuffer) => {
            if (readErr) {
              return reject(readErr);
            }

            resolve(compressedBuffer);

            fs.unlink(inputPath, (unlinkInputErr) => {
              if (unlinkInputErr) {
                // console.warn("Failed to delete input file:", unlinkInputErr);
              }
            });

            fs.unlink(outputPath, (unlinkOutputErr) => {
              if (unlinkOutputErr) {
                // console.warn("Failed to delete output file:", unlinkOutputErr);
              }
            });
          });
        })
        .run();
    });
  });
};

const processMediaFiles = async (files) => {
  const processedFiles = [];

  for (const file of files) {
    const extension = path.extname(file.originalname).toLowerCase();
    try {
      if (supportedFileFormats.includes(extension)) {
        const buffer = await compressVideo(file, videoConfig);
        processedFiles.push({ ...file, buffer });
      } else if (supportedFileFormats.includes(extension)) {
        const buffer = await sharp(file.buffer)
          .rotate()
          .resize({ width: imageConfig.width })
          .toFormat(imageConfig.format, { quality: imageConfig.quality })
          .toBuffer();
        processedFiles.push({ ...file, buffer });
      } else if (extension === ".gif") {
        const buffer = await compressGif(file, gifConfig);
        processedFiles.push({ ...file, buffer });
      } else {
        throw new Error(`Unsupported file type: ${extension}`);
      }
    } catch (error) {
      // console.error(
      //   `Error processing file ${file.originalname}:`,
      //   error.message
      // );
    }
  }

  return processedFiles;
};

export default processMediaFiles;

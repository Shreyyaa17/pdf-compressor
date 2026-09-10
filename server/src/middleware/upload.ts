import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploaded files in the tmp_uploads directory
    cb(null, path.join(__dirname, "../../tmp_uploads"));
  },
  filename: (req, file, cb) => {
    // Completely ignore the user's filename. Use a UUID to prevent collisions & directory traversal.
    const uniqueName = `${uuidv4()}.pdf`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // First line of defense: Check MIME type. (We will do a deeper magic-byte check later).
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDFs are allowed."));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

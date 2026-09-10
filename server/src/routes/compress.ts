import { Router, Request, Response } from "express";
import path from "path";
import { uploadMiddleware } from "../middleware/upload";
import { compressPDF } from "../services/ghostscript";
import { deleteFile } from "../utilities/cleanup";
import { compressRateLimiter } from "../middleware/rateLimiter";
import { isValidPdfBuffer } from "../utilities/validatePdf";

const router = Router();

router.post(
  "/",
  compressRateLimiter,
  uploadMiddleware.single("pdf"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded or file rejected." });
        return;
      }

      const inputPath = req.file.path;

      // SECURITY: Deep file validation via Magic Bytes
      const isRealPdf = await isValidPdfBuffer(inputPath);
      if (!isRealPdf) {
        console.log(
          `[Security Warning] Fake PDF uploaded: ${req.file.filename}`,
        );
        await deleteFile(inputPath); // Clean up immediately
        res.status(400).json({
          error: "Invalid file format. The uploaded file is not a genuine PDF.",
        });
        return;
      }

      const outputPath = path.join(
        __dirname,
        "../../tmp_outputs",
        req.file.filename,
      );
      const level = req.body.level || "recommended";

      console.log(
        `[Processing] Compressing ${req.file.filename} at ${level} level...`,
      );

      // Call Ghostscript
      const result = await compressPDF(inputPath, outputPath, level);

      const originalSize = req.file.size;
      const compressedSize = result.compressedSize;
      const savedBytes = originalSize - compressedSize;
      const reductionPercentage = ((savedBytes / originalSize) * 100).toFixed(
        2,
      );

      console.log(`[Success] Reduced by ${reductionPercentage}%`);

      // === IMMEDIATE CLEANUP ===
      await deleteFile(inputPath);

      res.status(200).json({
        message: "File compressed successfully",
        fileId: req.file.filename,
        originalSize,
        compressedSize,
        savedBytes,
        reductionPercentage,
      });
    } catch (error: any) {
      console.error("[Upload/Compress Error]", error);

      // === ERROR CLEANUP ===
      if (req.file) {
        await deleteFile(req.file.path);
      }

      res
        .status(500)
        .json({ error: error.message || "Failed to process upload." });
    }
  },
);

export default router;

import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/:fileId", (req: Request, res: Response): void => {
  const fileIdParam = req.params.fileId;

  // TypeScript guard: Express route parameters can sometimes resolve as string | string[]
  const fileId = Array.isArray(fileIdParam) ? fileIdParam[0] : fileIdParam;

  if (!fileId || !/^[a-zA-Z0-9-]+(\.pdf)?$/.test(fileId)) {
    res.status(400).json({ error: "Invalid file ID." });
    return;
  }

  const filename = fileId.endsWith(".pdf") ? fileId : `${fileId}.pdf`;
  const filePath = path.join(__dirname, "../../tmp_outputs", filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found or has expired." });
    return;
  }

  // Force the browser to download the file instead of opening it
  res.download(filePath, `compressed.pdf`, (err) => {
    if (err) {
      console.error("[Download Error]", err);
    }
  });
});

export default router;

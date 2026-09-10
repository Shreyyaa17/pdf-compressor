import fs from "fs/promises";
import path from "path";

/**
 * Safely deletes a single file.
 * Ignores "ENOENT" errors (which just means the file was already deleted).
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.error(
        `[Cleanup Error] Failed to delete ${filePath}:`,
        err.message,
      );
    }
  }
};

/**
 * Sweeps a directory and deletes files older than `maxAgeMinutes`.
 */
export const sweepDirectory = async (
  dirPath: string,
  maxAgeMinutes: number,
): Promise<void> => {
  try {
    const files = await fs.readdir(dirPath);
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    for (const file of files) {
      // Ignore hidden files or git keeps
      if (file.startsWith(".")) continue;

      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);
      const ageMs = now - stats.mtimeMs;

      if (ageMs > maxAgeMs) {
        await deleteFile(filePath);
        console.log(`[Vacuum] Swept old file: ${file}`);
      }
    }
  } catch (err: any) {
    // Ignore ENOENT if directory doesn't exist yet
    if (err.code !== "ENOENT") {
      console.error(`[Sweep Error] Failed to sweep ${dirPath}:`, err.message);
    }
  }
};

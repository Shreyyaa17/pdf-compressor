import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";

// Promisify allows us to use async/await instead of callbacks for child processes
const execFileAsync = promisify(execFile);

export type CompressionLevel = "extreme" | "recommended" | "low";

// Windows uses 'gswin64c', Linux/Mac use 'gs'
const getGhostscriptCommand = () => {
  return process.platform === "win32" ? "gswin64c" : "gs";
};

export const compressPDF = async (
  inputPath: string,
  outputPath: string,
  level: CompressionLevel = "recommended",
) => {
  const gsCommand = getGhostscriptCommand();

  // Map our UI levels to Ghostscript PDFSETTINGS
  const qualitySettings = {
    extreme: "/screen", // 72 dpi (lowest size/quality)
    recommended: "/ebook", // 150 dpi (balanced)
    low: "/printer", // 300 dpi (high quality, less compression)
  };

  const pdfSettings = qualitySettings[level];

  // Ghostscript arguments array
  const args = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    `-dPDFSETTINGS=${pdfSettings}`,
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    "-dSAFER", // SECURITY: Disables dangerous file operations within PostScript
    `-sOutputFile=${outputPath}`,
    inputPath,
  ];

  try {
    // Execute the compression
    await execFileAsync(gsCommand, args);

    // Get the new file size to calculate savings
    const stats = await fs.stat(outputPath);

    return {
      success: true,
      compressedSize: stats.size,
    };
  } catch (error) {
    console.error("[Ghostscript Execution Error]", error);
    throw new Error(
      "PDF compression engine failed. Ensure Ghostscript is installed.",
    );
  }
};

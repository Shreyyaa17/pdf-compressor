import fs from "fs/promises";

/**
 * Reads the first few bytes of a file to verify its magic bytes.
 * A valid PDF file must always start with '%PDF-' (Hex: 25 50 44 46 2d).
 */
export const isValidPdfBuffer = async (filePath: string): Promise<boolean> => {
  try {
    const handle = await fs.open(filePath, "r");
    const buffer = Buffer.alloc(5);
    await handle.read(buffer, 0, 5, 0);
    await handle.close();

    const header = buffer.toString("utf8");
    return header.startsWith("%PDF-");
  } catch (err) {
    return false;
  }
};

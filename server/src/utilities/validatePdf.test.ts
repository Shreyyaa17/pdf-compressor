import { isValidPdfBuffer } from "./validatePdf";
import fs from "fs/promises";
import path from "path";

describe("isValidPdfBuffer Utility", () => {
  const testDir = path.join(__dirname, "../../tmp_test_sandbox");

  beforeAll(async () => {
    // Create a temporary sandbox folder for test files
    await fs.mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    // Clean up test sandbox
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test("should return true for a file starting with valid %PDF- magic bytes", async () => {
    const fakePdfPath = path.join(testDir, "valid.pdf");
    // Write fake content that starts with the PDF signature
    await fs.writeFile(fakePdfPath, "%PDF-1.4 some mock content here");

    const isValid = await isValidPdfBuffer(fakePdfPath);
    expect(isValid).toBe(true);
  });

  test("should return false for a file with invalid magic bytes (e.g., text file)", async () => {
    const fakeTxtPath = path.join(testDir, "invalid.pdf");
    await fs.writeFile(fakeTxtPath, "Hello World, I am a text file");

    const isValid = await isValidPdfBuffer(fakeTxtPath);
    expect(isValid).toBe(false);
  });
});

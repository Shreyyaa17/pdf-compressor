import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { sweepDirectory } from "./utilities/cleanup";
import cors from "cors";
import compressRoutes from "./routes/compress";
import downloadRoutes from "./routes/download";

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://pdf-compressor-client.vercel.app",
];

// Middleware
// CORS allows our React app to communicate with this server
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  }),
);

// Parse incoming JSON requests
app.use(express.json());

// Basic Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "ok", message: "PDF Compressor API is running" });
});

// Register the compress route
app.use("/api/compress", compressRoutes);
app.use("/api/download", downloadRoutes);

// Global Error Handler Fallback
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// Background Cleanup Worker
// Runs every 5 minutes to sweep files older than 15 minutes
setInterval(
  () => {
    console.log("[System] Running background cleanup vacuum...");
    const uploadsDir = path.join(__dirname, "../tmp_uploads");
    const outputsDir = path.join(__dirname, "../tmp_outputs");

    // 15 minute retention policy
    sweepDirectory(uploadsDir, 15);
    sweepDirectory(outputsDir, 15);
  },
  5 * 60 * 1000,
); // 5 minutes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import rateLimit from "express-rate-limit";

// Limit each IP to 10 compression requests per 15 minutes
export const compressRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error:
      "Too many PDF compression requests from this IP, please try again after 15 minutes.",
  },
});

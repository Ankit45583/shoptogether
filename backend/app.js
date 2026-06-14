import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import notFound from "./middleware/notFound.middleware.js";
import requestLogger from "./middleware/requestLogger.middleware.js";
import { globalLimiter } from "./middleware/rateLimiter.middleware.js";

const app = express();

// ─── Security Headers ───────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Rate Limiting ───────────────────────────────────────
app.use(globalLimiter);

// ─── Body Parsers ────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Cookie Parser ──────────────────────────────────────
app.use(cookieParser());

// ─── Request Logger ─────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(requestLogger);
}

// ─── Health Check ───────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopTogether API Running",
    environment: process.env.NODE_ENV,
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────
app.use("/api", routes);

// ─── 404 Handler ────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ───────────────────────────────
app.use(errorHandler);

export default app;
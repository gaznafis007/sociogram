import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const HOST = process.env.HOST || "0.0.0.0"; // Listen on all interfaces for Android emulator

const server = app.listen(PORT, HOST, () => {
  logger.info(`✓ Server is running on ${HOST}:${PORT}`);
  logger.info(`✓ Environment: ${NODE_ENV}`);
  logger.info(`✓ API Documentation: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

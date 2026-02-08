import mongoose from "mongoose";
import { logger } from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.DB_URL || "mongodb://localhost:27017/sociogram";

    if (!process.env.DB_URL) {
      logger.warn("DB_URL not set in environment, using fallback URL");
    }

    await mongoose.connect(mongoUri);

    logger.info("✓ MongoDB Connected Successfully");

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB Disconnected");
    });
  } catch (error) {
    logger.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;

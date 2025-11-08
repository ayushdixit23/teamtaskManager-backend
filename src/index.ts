import { PORT, NODE_ENV } from "./config/env.js";
import createApp from "./app.js";
import "./config/db.js";

/**
 * Entry point - Start the server
 */
const startServer = async () => {
  try {
    console.log("🚀 Starting server...\n");

    // Create Express app
    const app = createApp();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log("\n" + "=".repeat(50));
      console.log(`✅ Server is running successfully!`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📍 Environment: ${NODE_ENV}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
      console.log("=".repeat(50) + "\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

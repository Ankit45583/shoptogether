import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import createSocketServer from "./sockets/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // HTTP server banao
    const server = http.createServer(app);

    // Socket.io attach karo
    const io = createSocketServer(server);

    // io ko app mein store karo
    app.set("io", io);

    server.listen(PORT, () => {
      console.log("=================================");
      console.log(`✅ Server Running`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🚀 URL: http://localhost:${PORT}`);
      console.log(`🔌 Socket.io Ready`);
      console.log("=================================");
    });
  } catch (error) {
    console.error("❌ Failed To Start Server");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import roomRoutes from "./room.routes.js";
import messageRoutes from "./message.routes.js";
import productRoutes from "./product.routes.js";
import voteRoutes from "./vote.routes.js";
import cartRoutes from "./cart.routes.js";
import notificationRoutes from "./notification.routes.js";
import aiRoutes from "./ai.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/rooms", roomRoutes);
router.use("/messages", messageRoutes);
router.use("/products", productRoutes);
router.use("/votes", voteRoutes);
router.use("/cart", cartRoutes);
router.use("/notifications", notificationRoutes);
router.use("/ai", aiRoutes);

// Dev-only seed route
if (process.env.NODE_ENV === "development") {
  const { default: devRoutes } = await import("./dev.routes.js").catch(() => ({ default: express.Router() }));
  router.use("/dev", devRoutes);
}

export default router;

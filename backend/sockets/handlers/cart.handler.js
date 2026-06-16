import GroupCart from "../../models/GroupCart.model.js";
import Product from "../../models/Product.model.js";
import Room from "../../models/Room.model.js";
import { CART_EVENTS } from "../events/cart.events.js";
import { LIMITS } from "../../config/constants.js";
import logger from "../../utils/logger.js";

const populateCart = async (roomId) => {
  const cart = await GroupCart.findOne({ room: roomId })
    .populate("items.product", "name price thumbnail brand category inStock")
    .populate("items.addedBy", "name username avatar")
    .lean();

  if (!cart) return null;

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  return { ...cart, totalPrice };
};

const cartHandler = (io, socket) => {
  // Add item to cart
  socket.on(CART_EVENTS.ADD, async ({ roomId, productId, quantity = 1, note }) => {
    try {
      if (!roomId || !productId) {
        return socket.emit("error", { message: "roomId and productId are required" });
      }

      const room = await Room.findById(roomId).lean();
      if (!room) return socket.emit("error", { message: "Room not found" });

      const isMember = room.members.some((m) => m.user.toString() === socket.user._id.toString());
      if (!isMember) return socket.emit("error", { message: "Not a room member" });

      const product = await Product.findById(productId).lean();
      if (!product) return socket.emit("error", { message: "Product not found" });

      let cart = await GroupCart.findOne({ room: roomId });
      if (!cart) cart = await GroupCart.create({ room: roomId, items: [], totalItems: 0 });

      const maxItems = LIMITS?.MAX_CART_ITEMS || 20;
      const qty = Math.min(Math.max(1, parseInt(quantity) || 1), 10);

      const existingIndex = cart.items.findIndex((i) => i.product?.toString() === productId);

      if (existingIndex !== -1) {
        cart.items[existingIndex].quantity = Math.min(
          cart.items[existingIndex].quantity + qty,
          10
        );
        if (note !== undefined) cart.items[existingIndex].note = note;
      } else {
        if (cart.items.length >= maxItems) {
          return socket.emit("error", { message: `Cart limit of ${maxItems} items reached` });
        }
        cart.items.push({
          product: productId,
          addedBy: socket.user._id,
          quantity: qty,
          note,
          addedAt: new Date(),
        });
      }

      cart.totalItems = cart.items.length;
      await cart.save();

      const populated = await populateCart(roomId);
      io.to(roomId).emit(CART_EVENTS.UPDATED, { cart: populated, action: "item_added" });
    } catch (err) {
      logger.error("cart:add socket error:", err.message);
      socket.emit("error", { message: "Failed to add item to cart" });
    }
  });

  // Remove item from cart
  socket.on(CART_EVENTS.REMOVE, async ({ roomId, productId }) => {
    try {
      if (!roomId || !productId) {
        return socket.emit("error", { message: "roomId and productId are required" });
      }

      const room = await Room.findById(roomId).lean();
      if (!room) return socket.emit("error", { message: "Room not found" });

      const isMember = room.members.some((m) => m.user.toString() === socket.user._id.toString());
      if (!isMember) return socket.emit("error", { message: "Not a room member" });

      const cart = await GroupCart.findOne({ room: roomId });
      if (!cart) return socket.emit("error", { message: "Cart not found" });

      const itemIndex = cart.items.findIndex((i) => i.product?.toString() === productId);
      if (itemIndex === -1) return socket.emit("error", { message: "Item not in cart" });

      const item = cart.items[itemIndex];
      const isHost = room.host?.toString() === socket.user._id.toString();
      const isAdder = item.addedBy?.toString() === socket.user._id.toString();

      if (!isHost && !isAdder) {
        return socket.emit("error", { message: "Not authorized to remove this item" });
      }

      cart.items.splice(itemIndex, 1);
      cart.totalItems = cart.items.length;
      await cart.save();

      const populated = await populateCart(roomId);
      io.to(roomId).emit(CART_EVENTS.UPDATED, { cart: populated, action: "item_removed" });
    } catch (err) {
      logger.error("cart:remove socket error:", err.message);
      socket.emit("error", { message: "Failed to remove cart item" });
    }
  });

  // Get current cart
  socket.on(CART_EVENTS.GET, async ({ roomId }) => {
    try {
      if (!roomId) return socket.emit("error", { message: "roomId is required" });

      const room = await Room.findById(roomId).lean();
      if (!room) return socket.emit("error", { message: "Room not found" });

      const isMember = room.members.some((m) => m.user.toString() === socket.user._id.toString());
      if (!isMember) return socket.emit("error", { message: "Not a room member" });

      let cart = await GroupCart.findOne({ room: roomId });
      if (!cart) cart = await GroupCart.create({ room: roomId, items: [], totalItems: 0 });

      const populated = await populateCart(roomId);
      socket.emit("cart:data", { cart: populated });
    } catch (err) {
      logger.error("cart:get socket error:", err.message);
      socket.emit("error", { message: "Failed to fetch cart" });
    }
  });
};

export default cartHandler;

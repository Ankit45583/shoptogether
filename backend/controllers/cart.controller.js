import GroupCart from "../models/GroupCart.model.js";
import Product from "../models/Product.model.js";
import Room from "../models/Room.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { addToCartValidator, updateCartItemValidator } from "../validators/cart.validator.js";
import { LIMITS } from "../config/constants.js";

const getRoomAndCheckMembership = async (roomId, userId) => {
  const room = await Room.findById(roomId).lean();
  if (!room) throw new ApiError(404, "Room not found");
  const isMember = room.members.some((m) => m.user.toString() === userId.toString());
  if (!isMember) throw new ApiError(403, "You are not a member of this room");
  return room;
};

const getOrCreateCart = async (roomId) => {
  let cart = await GroupCart.findOne({ room: roomId });
  if (!cart) {
    cart = await GroupCart.create({ room: roomId, items: [], totalItems: 0 });
  }
  return cart;
};

const populateAndCalculateCart = async (roomId) => {
  const cart = await GroupCart.findOne({ room: roomId })
    .populate("items.product", "name price thumbnail brand category inStock")
    .populate("items.addedBy", "name username avatar")
    .lean();

  if (!cart) return null;

  const totalPrice = cart.items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return { ...cart, totalPrice };
};

export const getGroupCart = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  await getRoomAndCheckMembership(roomId, req.user._id);
  await getOrCreateCart(roomId);
  const cart = await populateAndCalculateCart(roomId);
  return res.status(200).json(new ApiResponse(200, { cart }, "Cart fetched successfully"));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const io = req.app.get("io");

  const { error, value } = addToCartValidator.validate(req.body, { abortEarly: false });
  if (error) throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  const { productId, quantity, note } = value;

  await getRoomAndCheckMembership(roomId, req.user._id);

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let cart = await getOrCreateCart(roomId);

  const maxItems = LIMITS?.MAX_CART_ITEMS || 20;
  const existingIndex = cart.items.findIndex((i) => i.product?.toString() === productId);

  if (existingIndex !== -1) {
    // Update quantity
    cart.items[existingIndex].quantity = Math.min(
      cart.items[existingIndex].quantity + quantity,
      10
    );
    if (note !== undefined) cart.items[existingIndex].note = note;
  } else {
    if (cart.items.length >= maxItems) {
      throw new ApiError(400, `Cart cannot have more than ${maxItems} items`);
    }
    cart.items.push({
      product: productId,
      addedBy: req.user._id,
      quantity,
      note,
      addedAt: new Date(),
    });
  }

  cart.totalItems = cart.items.length;
  await cart.save();

  const populatedCart = await populateAndCalculateCart(roomId);

  if (io) {
    io.to(roomId).emit("cart:updated", { cart: populatedCart, action: "item_added" });
  }

  return res.status(200).json(new ApiResponse(200, { cart: populatedCart }, "Item added to cart"));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { roomId, productId } = req.params;
  const io = req.app.get("io");

  const room = await getRoomAndCheckMembership(roomId, req.user._id);

  const cart = await GroupCart.findOne({ room: roomId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const itemIndex = cart.items.findIndex((i) => i.product?.toString() === productId);
  if (itemIndex === -1) throw new ApiError(404, "Item not found in cart");

  const item = cart.items[itemIndex];
  const isHost = room.host?.toString() === req.user._id.toString();
  const isItemAdder = item.addedBy?.toString() === req.user._id.toString();

  if (!isHost && !isItemAdder) {
    throw new ApiError(403, "Only the item adder or room host can remove this item");
  }

  cart.items.splice(itemIndex, 1);
  cart.totalItems = cart.items.length;
  await cart.save();

  const populatedCart = await populateAndCalculateCart(roomId);

  if (io) {
    io.to(roomId).emit("cart:updated", { cart: populatedCart, action: "item_removed" });
  }

  return res.status(200).json(new ApiResponse(200, { cart: populatedCart }, "Item removed from cart"));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { roomId, productId } = req.params;
  const io = req.app.get("io");

  const { error, value } = updateCartItemValidator.validate(req.body, { abortEarly: false });
  if (error) throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  await getRoomAndCheckMembership(roomId, req.user._id);

  const cart = await GroupCart.findOne({ room: roomId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.find((i) => i.product?.toString() === productId);
  if (!item) throw new ApiError(404, "Item not found in cart");

  if (item.addedBy?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the item adder can update this item");
  }

  if (value.quantity !== undefined) item.quantity = value.quantity;
  if (value.note !== undefined) item.note = value.note;

  await cart.save();

  const populatedCart = await populateAndCalculateCart(roomId);

  if (io) {
    io.to(roomId).emit("cart:updated", { cart: populatedCart, action: "item_updated" });
  }

  return res.status(200).json(new ApiResponse(200, { cart: populatedCart }, "Cart item updated"));
});

export const clearCart = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const io = req.app.get("io");

  const room = await getRoomAndCheckMembership(roomId, req.user._id);

  if (room.host?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the room host can clear the cart");
  }

  const cart = await GroupCart.findOneAndUpdate(
    { room: roomId },
    { items: [], totalItems: 0 },
    { new: true }
  );

  if (io) {
    io.to(roomId).emit("cart:updated", { cart, action: "cart_cleared" });
  }

  return res.status(200).json(new ApiResponse(200, { cart }, "Cart cleared successfully"));
});

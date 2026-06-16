import Product from "../models/Product.model.js";
import Room from "../models/Room.model.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createProductValidator, updateProductValidator } from "../validators/product.validator.js";
import { createNotification } from "../services/notification.service.js";
import { PAGINATION, NOTIFICATION_TYPES } from "../config/constants.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    category,
    minPrice,
    maxPrice,
    search,
    sort = "newest",
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(parseInt(limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_low: { price: 1 },
    price_high: { price: -1 },
    most_voted: { "totalVotes.up": -1 },
    trending: { isTrending: -1, "totalVotes.up": -1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate("addedBy", "name username avatar")
      .lean(),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    }, "Products fetched successfully")
  );
});

export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findByIdAndUpdate(
    productId,
    { $inc: { "metadata.views": 1 } },
    { new: true }
  )
    .populate("addedBy", "name username avatar")
    .lean();

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(new ApiResponse(200, { product }, "Product fetched successfully"));
});

export const createProduct = asyncHandler(async (req, res) => {
  const { error, value } = createProductValidator.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, error.details.map((d) => d.message).join(", "));
  }

  const product = await Product.create({
    ...value,
    addedBy: req.user._id,
  });

  await product.populate("addedBy", "name username avatar");

  return res.status(201).json(new ApiResponse(201, { product }, "Product created successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { error, value } = updateProductValidator.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, error.details.map((d) => d.message).join(", "));
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.addedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the product owner can update it");
  }

  const updated = await Product.findByIdAndUpdate(productId, value, { new: true })
    .populate("addedBy", "name username avatar")
    .lean();

  return res.status(200).json(new ApiResponse(200, { product: updated }, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.addedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the product owner can delete it");
  }

  await Product.findByIdAndDelete(productId);

  return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export const saveProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const alreadySaved = product.savedBy.includes(userId);

  if (alreadySaved) {
    await Promise.all([
      Product.findByIdAndUpdate(productId, { $pull: { savedBy: userId } }),
      User.findByIdAndUpdate(userId, { $pull: { savedProducts: productId } }),
    ]);
    return res.status(200).json(new ApiResponse(200, { saved: false }, "Product unsaved"));
  } else {
    await Promise.all([
      Product.findByIdAndUpdate(productId, { $addToSet: { savedBy: userId } }),
      User.findByIdAndUpdate(userId, { $addToSet: { savedProducts: productId } }),
    ]);
    return res.status(200).json(new ApiResponse(200, { saved: true }, "Product saved"));
  }
});

export const getTrendingProducts = asyncHandler(async (req, res) => {
  let products = await Product.find({ isTrending: true })
    .sort({ "totalVotes.up": -1 })
    .limit(10)
    .populate("addedBy", "name username avatar")
    .lean();

  if (products.length < 10) {
    const trendingIds = products.map((p) => p._id);
    const extra = await Product.find({ _id: { $nin: trendingIds } })
      .sort({ "totalVotes.up": -1 })
      .limit(10 - products.length)
      .populate("addedBy", "name username avatar")
      .lean();
    products = [...products, ...extra];
  }

  return res.status(200).json(new ApiResponse(200, { products }, "Trending products fetched"));
});

export const getRoomProducts = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findById(roomId).lean();
  if (!room) throw new ApiError(404, "Room not found");

  const isMember = room.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "You are not a member of this room");

  const products = await Product.find({ room: roomId })
    .populate("addedBy", "name username avatar")
    .lean();

  return res.status(200).json(new ApiResponse(200, { products }, "Room products fetched"));
});

export const shareProductToRoom = asyncHandler(async (req, res) => {
  const { productId, roomId } = req.params;
  const io = req.app.get("io");

  const [product, room] = await Promise.all([
    Product.findById(productId),
    Room.findById(roomId),
  ]);

  if (!product) throw new ApiError(404, "Product not found");
  if (!room) throw new ApiError(404, "Room not found");

  const isMember = room.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "You are not a member of this room");

  // Add product to room's sharedProducts if not already there
  if (!room.sharedProducts?.includes(productId)) {
    await Room.findByIdAndUpdate(roomId, { $addToSet: { sharedProducts: productId } });
  }

  // Update product room reference and increment shares
  await Product.findByIdAndUpdate(productId, {
    room: roomId,
    $inc: { "metadata.shares": 1 },
  });

  // Emit socket event
  if (io) {
    io.to(roomId).emit("product:shared", {
      product: await Product.findById(productId).populate("addedBy", "name username avatar").lean(),
      sharedBy: { _id: req.user._id, name: req.user.name, username: req.user.username },
    });
  }

  // Notify room members
  const otherMembers = room.members.filter((m) => m.user.toString() !== req.user._id.toString());
  for (const member of otherMembers) {
    createNotification({
      recipient: member.user,
      sender: req.user._id,
      type: NOTIFICATION_TYPES.PRODUCT_SHARED,
      title: "New product shared",
      message: `${req.user.name} shared "${product.name}" in ${room.name}`,
      data: { roomId, productId },
      io,
    });
  }

  return res.status(200).json(new ApiResponse(200, { message: "Product shared to room" }, "Product shared successfully"));
});

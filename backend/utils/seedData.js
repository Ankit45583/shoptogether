import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";
import logger from "./logger.js";

const seedProducts = [
  {
    name: "Nike Air Max 270",
    description: "Lightweight running shoe with Max Air unit for all-day comfort.",
    price: 8995,
    originalPrice: 10995,
    discount: 18,
    category: "fashion",
    brand: "Nike",
    thumbnail: "https://via.placeholder.com/300x300?text=Nike+Air+Max+270",
    images: ["https://via.placeholder.com/300x300?text=Nike+Air+Max+270"],
    rating: { average: 4.5, count: 234 },
    isTrending: true,
    inStock: true,
    tags: ["shoes", "running", "sportswear", "nike"],
  },
  {
    name: "boAt Rockerz 450",
    description: "Wireless on-ear headphones with 15H playtime and deep bass.",
    price: 1499,
    originalPrice: 2990,
    discount: 50,
    category: "electronics",
    brand: "boAt",
    thumbnail: "https://via.placeholder.com/300x300?text=boAt+Rockerz+450",
    images: ["https://via.placeholder.com/300x300?text=boAt+Rockerz+450"],
    rating: { average: 4.2, count: 1823 },
    isTrending: true,
    inStock: true,
    tags: ["headphones", "wireless", "music", "boat"],
  },
  {
    name: "Lakme Eyeconic Kajal",
    description: "Long-lasting waterproof kajal with intense black color.",
    price: 249,
    originalPrice: 299,
    discount: 17,
    category: "beauty",
    brand: "Lakme",
    thumbnail: "https://via.placeholder.com/300x300?text=Lakme+Kajal",
    images: ["https://via.placeholder.com/300x300?text=Lakme+Kajal"],
    rating: { average: 4.7, count: 4521 },
    isTrending: false,
    inStock: true,
    tags: ["kajal", "makeup", "eyes", "lakme"],
  },
  {
    name: "Puma Running Shorts",
    description: "Lightweight breathable shorts perfect for running and gym workouts.",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    category: "sports",
    brand: "Puma",
    thumbnail: "https://via.placeholder.com/300x300?text=Puma+Shorts",
    images: ["https://via.placeholder.com/300x300?text=Puma+Shorts"],
    rating: { average: 4.0, count: 342 },
    isTrending: false,
    inStock: true,
    tags: ["shorts", "running", "gym", "puma"],
  },
  {
    name: "Noise ColorFit Pro 4",
    description: "Advanced smartwatch with AMOLED display, SpO2, and heart rate monitor.",
    price: 3499,
    originalPrice: 5999,
    discount: 42,
    category: "electronics",
    brand: "Noise",
    thumbnail: "https://via.placeholder.com/300x300?text=Noise+ColorFit+Pro+4",
    images: ["https://via.placeholder.com/300x300?text=Noise+ColorFit+Pro+4"],
    rating: { average: 4.3, count: 2341 },
    isTrending: true,
    inStock: true,
    tags: ["smartwatch", "fitness", "wearable", "noise"],
  },
  {
    name: "Levi's 511 Slim Jeans",
    description: "Classic slim fit jeans with stretch comfort technology.",
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    category: "fashion",
    brand: "Levis",
    thumbnail: "https://via.placeholder.com/300x300?text=Levis+511",
    images: ["https://via.placeholder.com/300x300?text=Levis+511"],
    rating: { average: 4.6, count: 876 },
    isTrending: false,
    inStock: true,
    tags: ["jeans", "denim", "slim-fit", "levis"],
  },
  {
    name: "Mamaearth Vitamin C Serum",
    description: "Brightening face serum with 15% Vitamin C and Turmeric for radiant skin.",
    price: 599,
    originalPrice: 799,
    discount: 25,
    category: "beauty",
    brand: "Mamaearth",
    thumbnail: "https://via.placeholder.com/300x300?text=Mamaearth+Serum",
    images: ["https://via.placeholder.com/300x300?text=Mamaearth+Serum"],
    rating: { average: 4.4, count: 3210 },
    isTrending: true,
    inStock: true,
    tags: ["skincare", "serum", "vitamin-c", "mamaearth"],
  },
  {
    name: "Philips Air Fryer",
    description: "Digital air fryer with 7 preset programs and rapid air technology.",
    price: 6499,
    originalPrice: 8999,
    discount: 28,
    category: "home",
    brand: "Philips",
    thumbnail: "https://via.placeholder.com/300x300?text=Philips+Air+Fryer",
    images: ["https://via.placeholder.com/300x300?text=Philips+Air+Fryer"],
    rating: { average: 4.5, count: 1234 },
    isTrending: false,
    inStock: true,
    tags: ["air-fryer", "kitchen", "cooking", "philips"],
  },
  {
    name: "Fastrack Analog Watch",
    description: "Stylish analog watch for men with leather strap and water resistance.",
    price: 1795,
    originalPrice: 2295,
    discount: 22,
    category: "fashion",
    brand: "Fastrack",
    thumbnail: "https://via.placeholder.com/300x300?text=Fastrack+Watch",
    images: ["https://via.placeholder.com/300x300?text=Fastrack+Watch"],
    rating: { average: 4.1, count: 567 },
    isTrending: false,
    inStock: true,
    tags: ["watch", "analog", "men", "fastrack"],
  },
  {
    name: "JBL Flip 6 Speaker",
    description: "Portable waterproof Bluetooth speaker with powerful sound and 12H battery.",
    price: 9999,
    originalPrice: 13999,
    discount: 29,
    category: "electronics",
    brand: "JBL",
    thumbnail: "https://via.placeholder.com/300x300?text=JBL+Flip+6",
    images: ["https://via.placeholder.com/300x300?text=JBL+Flip+6"],
    rating: { average: 4.8, count: 3456 },
    isTrending: true,
    inStock: true,
    tags: ["speaker", "bluetooth", "portable", "jbl"],
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip 6mm thick yoga mat with carrying strap for home and gym.",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    category: "sports",
    brand: "Boldfit",
    thumbnail: "https://via.placeholder.com/300x300?text=Yoga+Mat",
    images: ["https://via.placeholder.com/300x300?text=Yoga+Mat"],
    rating: { average: 4.3, count: 789 },
    isTrending: false,
    inStock: true,
    tags: ["yoga", "mat", "fitness", "boldfit"],
  },
  {
    name: "Wooden Photo Frame Set",
    description: "Set of 6 decorative wooden photo frames in assorted sizes for wall decor.",
    price: 699,
    originalPrice: 999,
    discount: 30,
    category: "home",
    brand: "Noaproblem",
    thumbnail: "https://via.placeholder.com/300x300?text=Photo+Frame+Set",
    images: ["https://via.placeholder.com/300x300?text=Photo+Frame+Set"],
    rating: { average: 4.2, count: 234 },
    isTrending: false,
    inStock: true,
    tags: ["frames", "decor", "home", "wooden"],
  },
];

export const seedDatabase = async () => {
  try {
    // Create or find test user
    let testUser = await User.findOne({ email: "seed@shoptogether.dev" });
    if (!testUser) {
      const hashedPassword = await bcrypt.hash("Seed@1234", 10);
      testUser = await User.create({
        name: "Seed User",
        username: "seeduser",
        email: "seed@shoptogether.dev",
        password: hashedPassword,
        isVerified: true,
      });
      logger.info("Seed user created: seed@shoptogether.dev / Seed@1234");
    }

    // Check if products already seeded
    const existingCount = await Product.countDocuments({ addedBy: testUser._id });
    if (existingCount >= seedProducts.length) {
      logger.info(`Seed skipped — ${existingCount} products already exist`);
      return { message: "Already seeded", userId: testUser._id, productCount: existingCount };
    }

    // Remove previous seed products and re-seed
    await Product.deleteMany({ addedBy: testUser._id });

    const products = await Product.insertMany(
      seedProducts.map((p) => ({ ...p, addedBy: testUser._id }))
    );

    logger.info(`Seeded ${products.length} products`);
    return {
      message: "Seed successful",
      userId: testUser._id,
      email: "seed@shoptogether.dev",
      password: "Seed@1234",
      productCount: products.length,
    };
  } catch (err) {
    logger.error("Seed failed:", err.message);
    throw err;
  }
};

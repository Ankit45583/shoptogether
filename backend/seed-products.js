import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "./models/Product.model.js";
import User from "./models/User.model.js";

const products = [
  /* ========== FASHION (6) ========== */
  { name: "Nike Air Max 270", description: "Iconic running shoes with maximum cushioning.", price: 8995, originalPrice: 12995, discount: 31, category: "fashion", brand: "Nike", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop", rating: { average: 4.5, count: 234 }, totalVotes: { up: 12, down: 2 }, isTrending: true, inStock: true },
  { name: "Levi's 511 Slim Jeans", description: "Classic slim-fit jeans with stretch denim.", price: 2999, originalPrice: 4999, discount: 40, category: "fashion", brand: "Levi's", thumbnail: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop", rating: { average: 4.6, count: 445 }, totalVotes: { up: 18, down: 1 }, isTrending: true, inStock: true },
  { name: "Fastrack Analog Watch", description: "Premium analog watch with leather strap.", price: 1795, originalPrice: 3995, discount: 55, category: "fashion", brand: "Fastrack", thumbnail: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop", rating: { average: 4.1, count: 203 }, totalVotes: { up: 7, down: 4 }, isTrending: false, inStock: true },
  { name: "Ray-Ban Aviator Sunglasses", description: "Iconic gold-frame aviator sunglasses with UV protection.", price: 5990, originalPrice: 8990, discount: 33, category: "fashion", brand: "Ray-Ban", thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop", rating: { average: 4.7, count: 892 }, totalVotes: { up: 24, down: 2 }, isTrending: true, inStock: true },
  { name: "Leather Crossbody Bag", description: "Genuine leather crossbody with multiple compartments.", price: 2499, originalPrice: 4999, discount: 50, category: "fashion", brand: "Hidesign", thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop", rating: { average: 4.4, count: 312 }, totalVotes: { up: 15, down: 1 }, isTrending: false, inStock: true },
  { name: "H&M Cotton T-Shirt", description: "Premium cotton t-shirt with regular fit.", price: 799, originalPrice: 1499, discount: 47, category: "fashion", brand: "H&M", thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop", rating: { average: 4.2, count: 1456 }, totalVotes: { up: 10, down: 3 }, isTrending: false, inStock: true },

  /* ========== ELECTRONICS (6) ========== */
  { name: "boAt Rockerz 450", description: "Wireless Bluetooth headphones with 15-hour battery.", price: 1499, originalPrice: 2999, discount: 50, category: "electronics", brand: "boAt", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", rating: { average: 4.2, count: 1823 }, totalVotes: { up: 8, down: 1 }, isTrending: true, inStock: true },
  { name: "Noise ColorFit Pro 4", description: "Smartwatch with 1.72'' HD display, 100+ sports modes.", price: 3499, originalPrice: 7999, discount: 56, category: "electronics", brand: "Noise", thumbnail: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop", rating: { average: 4.3, count: 2341 }, totalVotes: { up: 15, down: 2 }, isTrending: true, inStock: true },
  { name: "JBL Flip 6 Speaker", description: "Portable waterproof Bluetooth speaker with 12-hour playtime.", price: 9999, originalPrice: 11999, discount: 17, category: "electronics", brand: "JBL", thumbnail: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop", rating: { average: 4.8, count: 3456 }, totalVotes: { up: 25, down: 1 }, isTrending: true, inStock: true },
  { name: "Apple iPhone 15", description: "Apple iPhone 15 with A16 Bionic chip and Dynamic Island.", price: 79900, originalPrice: 89900, discount: 11, category: "electronics", brand: "Apple", thumbnail: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=500&fit=crop", rating: { average: 4.9, count: 5234 }, totalVotes: { up: 42, down: 3 }, isTrending: true, inStock: true },
  { name: "Logitech MX Master 3S", description: "Advanced wireless mouse for power users.", price: 8995, originalPrice: 10995, discount: 18, category: "electronics", brand: "Logitech", thumbnail: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop", rating: { average: 4.7, count: 987 }, totalVotes: { up: 19, down: 1 }, isTrending: false, inStock: true },
  { name: "Sony WH-1000XM5", description: "Industry-leading noise cancelling wireless headphones.", price: 29990, originalPrice: 34990, discount: 14, category: "electronics", brand: "Sony", thumbnail: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop", rating: { average: 4.8, count: 1234 }, totalVotes: { up: 33, down: 2 }, isTrending: true, inStock: true },

  /* ========== BEAUTY (6) ========== */
  { name: "Lakme Eyeconic Kajal", description: "Smudge-proof kajal with intense black color for 22 hours.", price: 249, originalPrice: 350, discount: 29, category: "beauty", brand: "Lakme", thumbnail: "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?w=500&h=500&fit=crop", rating: { average: 4.7, count: 4521 }, totalVotes: { up: 20, down: 0 }, isTrending: true, inStock: true },
  { name: "Mamaearth Vitamin C Serum", description: "Vitamin C face serum for glowing skin with turmeric extract.", price: 599, originalPrice: 799, discount: 25, category: "beauty", brand: "Mamaearth", thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop", rating: { average: 4.4, count: 3210 }, totalVotes: { up: 22, down: 3 }, isTrending: true, inStock: true },
  { name: "Maybelline Lipstick", description: "Long-lasting matte lipstick in bold red.", price: 449, originalPrice: 599, discount: 25, category: "beauty", brand: "Maybelline", thumbnail: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop", rating: { average: 4.5, count: 2987 }, totalVotes: { up: 17, down: 1 }, isTrending: false, inStock: true },
  { name: "Plum Green Tea Face Wash", description: "Green tea face wash for oily skin with pore minimizing formula.", price: 345, originalPrice: 450, discount: 23, category: "beauty", brand: "Plum", thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop", rating: { average: 4.3, count: 1876 }, totalVotes: { up: 14, down: 2 }, isTrending: false, inStock: true },
  { name: "Nykaa Eyeshadow Palette", description: "12-color eyeshadow palette with matte and shimmer finishes.", price: 899, originalPrice: 1499, discount: 40, category: "beauty", brand: "Nykaa", thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop", rating: { average: 4.6, count: 2456 }, totalVotes: { up: 21, down: 1 }, isTrending: true, inStock: true },
  { name: "Dior Sauvage Perfume", description: "Iconic men's fragrance with fresh and woody notes.", price: 8500, originalPrice: 11500, discount: 26, category: "beauty", brand: "Dior", thumbnail: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop", rating: { average: 4.9, count: 1234 }, totalVotes: { up: 28, down: 2 }, isTrending: true, inStock: true },

  /* ========== HOME (6) ========== */
  { name: "Philips Air Fryer", description: "4.1L capacity rapid air fryer with 90% less oil cooking.", price: 6499, originalPrice: 9999, discount: 35, category: "home", brand: "Philips", thumbnail: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop", rating: { average: 4.5, count: 1234 }, totalVotes: { up: 10, down: 2 }, isTrending: false, inStock: true },
  { name: "Wooden Photo Frame Set", description: "Set of 4 wooden photo frames in different sizes.", price: 699, originalPrice: 1299, discount: 46, category: "home", brand: "ArtNCraft", thumbnail: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500&h=500&fit=crop", rating: { average: 4.2, count: 234 }, totalVotes: { up: 6, down: 1 }, isTrending: false, inStock: true },
  { name: "Scented Candles Set", description: "Set of 3 aromatic scented candles for home ambiance.", price: 1299, originalPrice: 1999, discount: 35, category: "home", brand: "Iris", thumbnail: "https://images.unsplash.com/photo-1602874801006-c34c0e2c5d2f?w=500&h=500&fit=crop", rating: { average: 4.6, count: 567 }, totalVotes: { up: 16, down: 1 }, isTrending: true, inStock: true },
  { name: "Throw Pillow Covers", description: "Set of 5 decorative throw pillow covers in various designs.", price: 899, originalPrice: 1499, discount: 40, category: "home", brand: "AmazonBasics", thumbnail: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=500&fit=crop", rating: { average: 4.3, count: 421 }, totalVotes: { up: 11, down: 2 }, isTrending: false, inStock: true },
  { name: "Indoor Plant Set", description: "Set of 3 low-maintenance indoor plants with pots.", price: 1499, originalPrice: 2499, discount: 40, category: "home", brand: "GreenWorld", thumbnail: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop", rating: { average: 4.7, count: 789 }, totalVotes: { up: 19, down: 1 }, isTrending: true, inStock: true },
  { name: "Coffee Maker Machine", description: "Automatic drip coffee maker with 12-cup capacity.", price: 4999, originalPrice: 7999, discount: 38, category: "home", brand: "Morphy Richards", thumbnail: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop", rating: { average: 4.4, count: 654 }, totalVotes: { up: 13, down: 3 }, isTrending: false, inStock: true },

  /* ========== SPORTS (6) ========== */
  { name: "Puma Running Shorts", description: "Lightweight running shorts with moisture-wicking fabric.", price: 1299, originalPrice: 1999, discount: 35, category: "sports", brand: "Puma", thumbnail: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop", rating: { average: 4.0, count: 342 }, totalVotes: { up: 5, down: 3 }, isTrending: false, inStock: true },
  { name: "Yoga Mat Premium", description: "Anti-skid yoga mat with extra cushioning, 6mm thick.", price: 899, originalPrice: 1499, discount: 40, category: "sports", brand: "Boldfit", thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop", rating: { average: 4.3, count: 789 }, totalVotes: { up: 9, down: 2 }, isTrending: false, inStock: true },
  { name: "Adjustable Dumbbells", description: "Set of adjustable dumbbells (2.5kg to 10kg) for home workouts.", price: 4999, originalPrice: 7999, discount: 38, category: "sports", brand: "Kore", thumbnail: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&h=500&fit=crop", rating: { average: 4.6, count: 567 }, totalVotes: { up: 17, down: 1 }, isTrending: true, inStock: true },
  { name: "Nivia Football", description: "FIFA approved size 5 football for professional matches.", price: 699, originalPrice: 1199, discount: 42, category: "sports", brand: "Nivia", thumbnail: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500&h=500&fit=crop", rating: { average: 4.2, count: 891 }, totalVotes: { up: 12, down: 2 }, isTrending: false, inStock: true },
  { name: "Cricket Bat — SS", description: "Premium English willow cricket bat by SS.", price: 2499, originalPrice: 3999, discount: 37, category: "sports", brand: "SS", thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&h=500&fit=crop", rating: { average: 4.5, count: 432 }, totalVotes: { up: 15, down: 1 }, isTrending: false, inStock: true },
  { name: "Wilson Tennis Racket", description: "Professional tennis racket with graphite frame.", price: 3499, originalPrice: 4999, discount: 30, category: "sports", brand: "Wilson", thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&h=500&fit=crop", rating: { average: 4.4, count: 256 }, totalVotes: { up: 11, down: 2 }, isTrending: false, inStock: true },

  /* ========== BOOKS (6) ========== */
  { name: "Atomic Habits", description: "Bestselling book by James Clear on building good habits.", price: 399, originalPrice: 699, discount: 43, category: "books", brand: "Penguin", thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop", rating: { average: 4.8, count: 12543 }, totalVotes: { up: 45, down: 2 }, isTrending: true, inStock: true },
  { name: "Rich Dad Poor Dad", description: "Classic personal finance book by Robert Kiyosaki.", price: 299, originalPrice: 499, discount: 40, category: "books", brand: "Plata Publishing", thumbnail: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=500&fit=crop", rating: { average: 4.7, count: 9876 }, totalVotes: { up: 38, down: 3 }, isTrending: true, inStock: true },
  { name: "The Psychology of Money", description: "Timeless lessons on wealth and happiness by Morgan Housel.", price: 349, originalPrice: 599, discount: 42, category: "books", brand: "Jaico", thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop", rating: { average: 4.6, count: 6543 }, totalVotes: { up: 32, down: 1 }, isTrending: true, inStock: true },
  { name: "Ikigai", description: "The Japanese secret to a long and happy life.", price: 250, originalPrice: 399, discount: 37, category: "books", brand: "Penguin", thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop", rating: { average: 4.5, count: 4321 }, totalVotes: { up: 27, down: 2 }, isTrending: false, inStock: true },
  { name: "Sapiens", description: "A Brief History of Humankind by Yuval Noah Harari.", price: 499, originalPrice: 799, discount: 38, category: "books", brand: "Harper", thumbnail: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop", rating: { average: 4.7, count: 7890 }, totalVotes: { up: 35, down: 2 }, isTrending: true, inStock: true },
  { name: "The Alchemist", description: "Paulo Coelho's classic about following your dreams.", price: 199, originalPrice: 350, discount: 43, category: "books", brand: "HarperOne", thumbnail: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=500&h=500&fit=crop", rating: { average: 4.6, count: 15234 }, totalVotes: { up: 41, down: 1 }, isTrending: true, inStock: true },
];

/* Add images array from thumbnail */
products.forEach((p) => {
  p.images = [p.thumbnail];
  p.tags = [p.category, p.brand?.toLowerCase()].filter(Boolean);
});

(async () => {
  try {
    console.log("\n🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected!");

    const user = await User.findOne();
    if (user) {
      console.log(`👤 Using user "${user.name || user.username}" as product creator`);
      products.forEach((p) => (p.addedBy = user._id));
    }

    await Product.deleteMany({});
    console.log("🗑️  Cleared old products");

    console.log("\n🌱 Seeding 36 products...");
    const inserted = await Product.insertMany(products);
    console.log(`\n✅ Successfully added ${inserted.length} products!\n`);

    const summary = {};
    inserted.forEach((p) => {
      summary[p.category] = (summary[p.category] || 0) + 1;
    });

    console.log("📦 Summary by category:");
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`   ${cat.padEnd(15)} → ${count} products`);
    });

    const trending = inserted.filter((p) => p.isTrending).length;
    console.log(`\n🔥 Trending: ${trending} products`);
    console.log("\n🎉 Done!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
})();
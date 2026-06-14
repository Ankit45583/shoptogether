/* ==========================================
   MOCK USERS
========================================== */

export const MOCK_USERS = [
  {
    id: "1",
    name: "Arjun Sharma",
    username: "arjun_s",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Fashion lover from Mumbai",
  },
  {
    id: "2",
    name: "Priya Patel",
    username: "priya_p",
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Tech enthusiast",
  },
  {
    id: "3",
    name: "Rahul Verma",
    username: "rahul_v",
    avatar: "https://i.pravatar.cc/150?img=33",
    bio: "Sneaker collector",
  },
  {
    id: "4",
    name: "Sneha Gupta",
    username: "sneha_g",
    avatar: "https://i.pravatar.cc/150?img=45",
    bio: "Beauty & lifestyle",
  },
  {
    id: "5",
    name: "Karan Mehta",
    username: "karan_m",
    avatar: "https://i.pravatar.cc/150?img=53",
    bio: "Sports & fitness",
  },
];

/* ==========================================
   MOCK ROOMS
========================================== */

export const MOCK_ROOMS = [
  {
    id: "1",
    name: "Weekend Fashion Haul",
    code: "WF4X2K",
    type: "public",
    category: "Fashion",
    members: 8,
    maxMembers: 20,
    status: "active",
    host: "Arjun Sharma",
    hostId: "1",
    cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Tech Gadgets 2024",
    code: "TG9P1M",
    type: "public",
    category: "Electronics",
    members: 12,
    maxMembers: 20,
    status: "active",
    host: "Priya Patel",
    hostId: "2",
    cover: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Sneaker Drop Squad",
    code: "SD3K7N",
    type: "private",
    category: "Fashion",
    members: 5,
    maxMembers: 10,
    status: "active",
    host: "Rahul Verma",
    hostId: "3",
    cover: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Beauty Essentials",
    code: "BE8J2P",
    type: "public",
    category: "Beauty",
    members: 15,
    maxMembers: 20,
    status: "active",
    host: "Sneha Gupta",
    hostId: "4",
    cover: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Fitness Gear Hunt",
    code: "FG5R3Q",
    type: "public",
    category: "Sports",
    members: 7,
    maxMembers: 15,
    status: "active",
    host: "Karan Mehta",
    hostId: "5",
    cover: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Home Decor Ideas",
    code: "HD1T6W",
    type: "private",
    category: "Home",
    members: 4,
    maxMembers: 10,
    status: "active",
    host: "Priya Patel",
    hostId: "2",
    cover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=300&fit=crop",
  },
];

/* ==========================================
   MOCK PRODUCTS — 36 products (6 per category)
========================================== */

export const MOCK_PRODUCTS = [
  // FASHION
  { id: "1", name: "Nike Air Max 270", price: 8995, category: "Fashion", rating: 4.5, ratingCount: 234, votes: { up: 12, down: 2 }, emoji: "👟", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop" },
  { id: "2", name: "Levi's 511 Slim Jeans", price: 2999, category: "Fashion", rating: 4.6, ratingCount: 445, votes: { up: 18, down: 1 }, emoji: "👖", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop" },
  { id: "3", name: "Fastrack Analog Watch", price: 1795, category: "Fashion", rating: 4.1, ratingCount: 203, votes: { up: 7, down: 4 }, emoji: "⌚", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop" },
  { id: "4", name: "Ray-Ban Aviator Sunglasses", price: 5990, category: "Fashion", rating: 4.7, ratingCount: 892, votes: { up: 24, down: 2 }, emoji: "🕶️", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop" },
  { id: "5", name: "Leather Crossbody Bag", price: 2499, category: "Fashion", rating: 4.4, ratingCount: 312, votes: { up: 15, down: 1 }, emoji: "👜", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop" },
  { id: "6", name: "H&M Cotton T-Shirt", price: 799, category: "Fashion", rating: 4.2, ratingCount: 1456, votes: { up: 10, down: 3 }, emoji: "👕", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop" },

  // ELECTRONICS
  { id: "7", name: "boAt Rockerz 450", price: 1499, category: "Electronics", rating: 4.2, ratingCount: 1823, votes: { up: 8, down: 1 }, emoji: "🎧", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop" },
  { id: "8", name: "Noise ColorFit Pro 4", price: 3499, category: "Electronics", rating: 4.3, ratingCount: 2341, votes: { up: 15, down: 2 }, emoji: "⌚", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop" },
  { id: "9", name: "JBL Flip 6 Speaker", price: 9999, category: "Electronics", rating: 4.8, ratingCount: 3456, votes: { up: 25, down: 1 }, emoji: "🔊", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop" },
  { id: "10", name: "Apple iPhone 15", price: 79900, category: "Electronics", rating: 4.9, ratingCount: 5234, votes: { up: 42, down: 3 }, emoji: "📱", image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=500&fit=crop" },
  { id: "11", name: "Logitech MX Master 3S", price: 8995, category: "Electronics", rating: 4.7, ratingCount: 987, votes: { up: 19, down: 1 }, emoji: "🖱️", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop" },
  { id: "12", name: "Sony WH-1000XM5", price: 29990, category: "Electronics", rating: 4.8, ratingCount: 1234, votes: { up: 33, down: 2 }, emoji: "🎧", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop" },

  // BEAUTY
  { id: "13", name: "Lakme Eyeconic Kajal", price: 249, category: "Beauty", rating: 4.7, ratingCount: 4521, votes: { up: 20, down: 0 }, emoji: "✨", image: "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?w=500&h=500&fit=crop" },
  { id: "14", name: "Mamaearth Vitamin C Serum", price: 599, category: "Beauty", rating: 4.4, ratingCount: 3210, votes: { up: 22, down: 3 }, emoji: "🌿", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop" },
  { id: "15", name: "Maybelline Lipstick", price: 449, category: "Beauty", rating: 4.5, ratingCount: 2987, votes: { up: 17, down: 1 }, emoji: "💄", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop" },
  { id: "16", name: "Plum Green Tea Face Wash", price: 345, category: "Beauty", rating: 4.3, ratingCount: 1876, votes: { up: 14, down: 2 }, emoji: "🧴", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop" },
  { id: "17", name: "Nykaa Eyeshadow Palette", price: 899, category: "Beauty", rating: 4.6, ratingCount: 2456, votes: { up: 21, down: 1 }, emoji: "🎨", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop" },
  { id: "18", name: "Dior Sauvage Perfume", price: 8500, category: "Beauty", rating: 4.9, ratingCount: 1234, votes: { up: 28, down: 2 }, emoji: "🌸", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop" },

  // HOME
  { id: "19", name: "Philips Air Fryer", price: 6499, category: "Home", rating: 4.5, ratingCount: 1234, votes: { up: 10, down: 2 }, emoji: "🍳", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop" },
  { id: "20", name: "Wooden Photo Frame Set", price: 699, category: "Home", rating: 4.2, ratingCount: 234, votes: { up: 6, down: 1 }, emoji: "🖼️", image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500&h=500&fit=crop" },
  { id: "21", name: "Scented Candles Set", price: 1299, category: "Home", rating: 4.6, ratingCount: 567, votes: { up: 16, down: 1 }, emoji: "🕯️", image: "https://images.unsplash.com/photo-1602874801006-c34c0e2c5d2f?w=500&h=500&fit=crop" },
  { id: "22", name: "Throw Pillow Covers", price: 899, category: "Home", rating: 4.3, ratingCount: 421, votes: { up: 11, down: 2 }, emoji: "🛋️", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=500&fit=crop" },
  { id: "23", name: "Indoor Plant Set", price: 1499, category: "Home", rating: 4.7, ratingCount: 789, votes: { up: 19, down: 1 }, emoji: "🪴", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop" },
  { id: "24", name: "Coffee Maker Machine", price: 4999, category: "Home", rating: 4.4, ratingCount: 654, votes: { up: 13, down: 3 }, emoji: "☕", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop" },

  // SPORTS
  { id: "25", name: "Puma Running Shorts", price: 1299, category: "Sports", rating: 4.0, ratingCount: 342, votes: { up: 5, down: 3 }, emoji: "🩳", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop" },
  { id: "26", name: "Yoga Mat Premium", price: 899, category: "Sports", rating: 4.3, ratingCount: 789, votes: { up: 9, down: 2 }, emoji: "🧘", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop" },
  { id: "27", name: "Adjustable Dumbbells", price: 4999, category: "Sports", rating: 4.6, ratingCount: 567, votes: { up: 17, down: 1 }, emoji: "🏋️", image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&h=500&fit=crop" },
  { id: "28", name: "Nivia Football", price: 699, category: "Sports", rating: 4.2, ratingCount: 891, votes: { up: 12, down: 2 }, emoji: "⚽", image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500&h=500&fit=crop" },
  { id: "29", name: "Cricket Bat — SS", price: 2499, category: "Sports", rating: 4.5, ratingCount: 432, votes: { up: 15, down: 1 }, emoji: "🏏", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&h=500&fit=crop" },
  { id: "30", name: "Wilson Tennis Racket", price: 3499, category: "Sports", rating: 4.4, ratingCount: 256, votes: { up: 11, down: 2 }, emoji: "🎾", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&h=500&fit=crop" },

  // BOOKS
  { id: "31", name: "Atomic Habits", price: 399, category: "Books", rating: 4.8, ratingCount: 12543, votes: { up: 45, down: 2 }, emoji: "📘", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop" },
  { id: "32", name: "Rich Dad Poor Dad", price: 299, category: "Books", rating: 4.7, ratingCount: 9876, votes: { up: 38, down: 3 }, emoji: "💰", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=500&fit=crop" },
  { id: "33", name: "The Psychology of Money", price: 349, category: "Books", rating: 4.6, ratingCount: 6543, votes: { up: 32, down: 1 }, emoji: "📗", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop" },
  { id: "34", name: "Ikigai", price: 250, category: "Books", rating: 4.5, ratingCount: 4321, votes: { up: 27, down: 2 }, emoji: "📕", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop" },
  { id: "35", name: "Sapiens", price: 499, category: "Books", rating: 4.7, ratingCount: 7890, votes: { up: 35, down: 2 }, emoji: "📙", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop" },
  { id: "36", name: "The Alchemist", price: 199, category: "Books", rating: 4.6, ratingCount: 15234, votes: { up: 41, down: 1 }, emoji: "✨", image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=500&h=500&fit=crop" },
];

/* ==========================================
   MOCK MESSAGES
========================================== */

export const MOCK_MESSAGES = [
  { id: "1", senderId: "1", sender: "Arjun Sharma", content: "guys check out these Nike shoes!", time: "2:30 PM", type: "text" },
  { id: "2", senderId: "2", sender: "Priya Patel", content: "omg these are fire 🔥", time: "2:31 PM", type: "text" },
  { id: "3", senderId: "3", sender: "Rahul Verma", content: "bro ₹8995 is a bit steep for me", time: "2:31 PM", type: "text" },
  { id: "4", senderId: "4", sender: "Sneha Gupta", content: "vote karo sab log!", time: "2:32 PM", type: "text" },
  { id: "5", senderId: "5", sender: "Karan Mehta", content: "I already voted up, these are worth it", time: "2:33 PM", type: "text" },
  { id: "6", senderId: "1", sender: "Arjun Sharma", content: "AI ne suggest kiya budget ₹5k ke andar rakho", time: "2:34 PM", type: "text" },
  { id: "7", senderId: "2", sender: "Priya Patel", content: "then boAt headphones better option hai", time: "2:35 PM", type: "text" },
  { id: "8", senderId: "3", sender: "Rahul Verma", content: "haan sahi bol raha hai, ₹1499 mein great deal", time: "2:35 PM", type: "text" },
];

/* ==========================================
   MOCK NOTIFICATIONS
========================================== */

export const MOCK_NOTIFICATIONS = [
  { id: "1", type: "room_invite", text: "Priya Patel ne tumhe 'Beauty Essentials' room mein invite kiya", time: "5 min ago", read: false },
  { id: "2", type: "vote_update", text: "boAt Rockerz pe 8 new votes aaye", time: "15 min ago", read: false },
  { id: "3", type: "ai_suggestion", text: "AI Host ne new recommendations generate ki hain", time: "1 hour ago", read: true },
  { id: "4", type: "product_shared", text: "Karan ne 'Yoga Mat Premium' share kiya room mein", time: "2 hours ago", read: true },
  { id: "5", type: "room_closed", text: "'Sneaker Drop Squad' room close ho gayi", time: "Yesterday", read: true },
];

/* ==========================================
   MOCK TESTIMONIALS
========================================== */

export const MOCK_TESTIMONIALS = [
  {
    name: "Aditi Sharma",
    username: "@aditi_s",
    text: "ShopTogether ne meri shopping experience completely badal di! Ab mai apni friends ke saath real-time mein shopping karti hoon aur sab milke decide karte hain.",
    role: "Fashion Blogger",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    name: "Vikram Singh",
    username: "@vikram_s",
    text: "AI recommendations bahut accurate hain. Mere group ka budget aur preferences perfectly samajhta hai. Highly recommended!",
    role: "Tech Enthusiast",
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    name: "Meera Joshi",
    username: "@meera_j",
    text: "Discord + Shopping = ShopTogether! Finally ek aise platform jo actually samajhta hai ki group shopping kaise hoti hai.",
    role: "Lifestyle Creator",
    avatar: "https://i.pravatar.cc/150?img=49",
  },
];

/* ==========================================
   CATEGORIES
========================================== */

export const CATEGORIES = ["All", "Fashion", "Electronics", "Beauty", "Home", "Sports", "Books"];

export const CATEGORY_COLORS = {
  Fashion: "#ec4899",
  Electronics: "#3b82f6",
  Beauty: "#f97316",
  Home: "#22c55e",
  Sports: "#f59e0b",
  Books: "#8b5cf6",
  All: "#71717a",
};
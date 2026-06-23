# 🛍️ ShopTogether
### Shop Together, Decide Together

A real-time social commerce platform where friends can shop collaboratively, discuss products, vote on choices, build a shared cart, and receive AI-powered recommendations—all in one place.

**ShopTogether** combines the social experience of chatting with friends and the convenience of online shopping, making group buying decisions faster, smarter, and more fun.

---

## 🚀 The Problem

Online shopping is often a lonely and fragmented experience.

People constantly send product links through messaging apps, share screenshots, ask for opinions, compare options across multiple chats, and struggle to make group decisions.

This process is slow, messy, and scattered.

**ShopTogether** solves this by bringing friends into a shared live shopping room where they can discuss, vote, compare, and decide together in real-time.

---

## 🔄 How It Works

1. User signs up and creates an account.
2. User creates a shopping room (Public or Private).
3. A unique 6-character room code is generated.
4. User shares the code with friends.
5. Friends join the room using the code.
6. Members chat in real-time about products.
7. Products are shared directly into the room.
8. Members vote using upvotes and downvotes.
9. A shared cart is built collaboratively.
10. AI analyzes conversations and suggests products based on preferences and budget.
11. The group reaches a final buying decision together.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT Authentication
- Refresh Token Rotation
- Protected Routes
- Secure Password Hashing with bcryptjs

### 🏠 Shopping Rooms
- Create Public or Private Rooms
- Unique 6-Character Join Codes
- Invite Friends Instantly
- Live Member Presence Tracking

### 💬 Real-Time Collaboration
- Real-Time Group Chat
- Typing Indicators
- Socket.io Powered Communication
- Instant Updates Across All Members

### 🛒 Collaborative Shopping
- Product Catalog
- Search & Filter Products
- Product Sharing Inside Rooms
- Shared Group Cart
- "Added By" User Tracking

### 👍 Voting & Consensus
- Upvote / Downvote Products
- Real-Time Vote Counts
- Consensus Tracking
- Group Decision Support

### 🤖 AI Shopping Assistant
- Powered by Google Gemini API
- Product Recommendations
- Budget-Aware Suggestions
- Preference-Based Recommendations
- Chat Context Analysis

### 🔔 Notifications
- Room Invite Notifications
- Product Vote Notifications
- AI Recommendation Alerts
- Real-Time Activity Updates

### 🎨 User Experience
- Fully Responsive Design
- Modern Dark UI
- Smooth Animations with Framer Motion
- Mobile Friendly Experience

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router v6
- Zustand
- Axios
- Socket.io Client
- Framer Motion
- React Icons
- React Hot Toast
- Plain CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT
- bcryptjs
- Joi
- Cloudinary
- Google Gemini API
- Helmet
- CORS
- Morgan
- cookie-parser

---

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📁 Project Structure

```text
shoptogether/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── hooks/
        ├── layouts/
        ├── lib/
        ├── pages/
        ├── router/
        ├── store/
        ├── styles/
        └── App.jsx
```


**ShopTogether — Shop Together, Decide Together 🛍️**

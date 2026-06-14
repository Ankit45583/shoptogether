import { motion } from "framer-motion";
import "./FeaturesSection.css";

const features = [
  { icon: "🏪", title: "Live Shopping Rooms", desc: "Create private or public rooms and shop with up to 20 friends in real-time." },
  { icon: "💬", title: "Real-time Chat", desc: "Chat, share reactions, and discuss products with your group instantly." },
  { icon: "🤖", title: "AI Shopping Assistant", desc: "Get personalized recommendations based on your group's preferences and budget." },
  { icon: "🗳️", title: "Smart Voting", desc: "Vote on products and see real-time consensus. Let the group decide!" },
  { icon: "🛒", title: "Group Cart", desc: "Build a shared cart together. Everyone can add their favorite picks." },
  { icon: "⚡", title: "Instant Recommendations", desc: "AI analyzes chat mood and suggests perfect products for your group." },
];

function FeaturesSection() {
  return (
    <section className="features-section" id="features">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">
            Everything you need for<br />
            <span className="gradient-text">group shopping</span>
          </h2>
          <p className="section-subtitle">
            ShopTogether has all the tools your squad needs to shop smarter.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

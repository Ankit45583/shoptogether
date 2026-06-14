import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsPlay } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import Button from "../../components/ui/Button/Button";
import "./HeroSection.css";

// Animated preview card showing a mock room
function RoomPreview() {
  return (
    <div className="room-preview-card">
      <div className="room-preview-header">
        <div className="room-preview-dot green" />
        <span>Weekend Fashion Haul</span>
        <span className="room-preview-code">WF4X2K</span>
      </div>

      <div className="room-preview-members">
        {["A", "P", "R", "S"].map((l, i) => (
          <div key={i} className={`preview-avatar color-${i}`}>{l}</div>
        ))}
        <span className="preview-member-count">8 online</span>
      </div>

      <div className="room-preview-chat">
        {[
          { name: "Arjun", msg: "check out these Nike shoes! 🔥", self: false },
          { name: "Priya", msg: "omg these are fire!", self: false },
          { name: "You", msg: "vote karo sab! 👆", self: true },
        ].map((m, i) => (
          <motion.div
            key={i}
            className={`preview-msg ${m.self ? "self" : ""}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.3 }}
          >
            {!m.self && <span className="preview-msg-name">{m.name}</span>}
            <span className="preview-msg-text">{m.msg}</span>
          </motion.div>
        ))}
      </div>

      <div className="room-preview-product">
        <div className="preview-product-img">👟</div>
        <div className="preview-product-info">
          <span className="preview-product-name">Nike Air Max 270</span>
          <span className="preview-product-price">₹8,995</span>
        </div>
        <div className="preview-votes">
          <span className="vote-up">👍 12</span>
          <span className="vote-down">👎 2</span>
        </div>
      </div>

      <div className="preview-vote-bar-wrap">
        <div className="preview-vote-bar">
          <motion.div
            className="preview-vote-fill"
            initial={{ width: 0 }}
            animate={{ width: "86%" }}
            transition={{ delay: 1.5, duration: 0.8 }}
          />
        </div>
        <span className="preview-vote-pct">86% approval</span>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-badge">✨ Social Commerce, Reimagined</div>

          <h1 className="hero-heading">
            Shop <span className="gradient-text">Together</span>,<br />
            Decide <span className="gradient-text">Together</span>
          </h1>

          <p className="hero-subtext">
            Create live shopping rooms, invite your friends, chat in real-time, and make group shopping decisions powered by AI.
          </p>

          <div className="hero-actions">
            <Link to="/register">
              <Button variant="primary" size="lg" rightIcon={<AiOutlineArrowRight />}>
                Start Shopping Together
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" leftIcon={<BsPlay />}>
                How it Works
              </Button>
            </a>
          </div>

          <p className="hero-social-proof">
            🛍️ Join <strong>10,000+</strong> shoppers already using ShopTogether
          </p>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RoomPreview />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;

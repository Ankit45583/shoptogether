import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button/Button";
import "./CTASection.css";

function CTASection() {
  return (
    <section className="cta-section">
      <div className="section-inner">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="cta-title">Ready to shop smarter?</h2>
          <p className="cta-subtitle">
            Join thousands of people already shopping together with their friends.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg">Get Started Free</Button>
          </Link>
          <p className="cta-note">No credit card required · Free forever</p>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;

import { motion } from "framer-motion";
import { BsQuote } from "react-icons/bs";
import Avatar from "../../components/ui/Avatar/Avatar";
import { MOCK_TESTIMONIALS } from "../../config/constants";
import "./TestimonialsSection.css";

function TestimonialsSection() {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">
            Loved by shoppers <span className="gradient-text">across India</span>
          </h2>
        </div>

        <div className="testimonials-grid">
          {MOCK_TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <BsQuote size={28} className="testimonial-quote-icon" />
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <Avatar name={t.name} size="md" />
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-role">{t.role} · {t.username}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

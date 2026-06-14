import { motion } from "framer-motion";
import { BsPlusCircle, BsPersonPlus, BsBagHeart } from "react-icons/bs";
import "./HowItWorksSection.css";

const steps = [
  { icon: <BsPlusCircle size={32} />, num: "01", title: "Create a Room", desc: "Set up your shopping room in seconds. Choose public or private, set a budget, pick a category." },
  { icon: <BsPersonPlus size={32} />, num: "02", title: "Invite Your Friends", desc: "Share the room code or invite link with your shopping squad. They join in one tap." },
  { icon: <BsBagHeart size={32} />, num: "03", title: "Shop Together", desc: "Browse products, chat, vote, and let AI help you decide. Shopping has never been this fun!" },
];

function HowItWorksSection() {
  return (
    <section className="hiw-section" id="how-it-works">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">
            Start shopping in <span className="gradient-text">3 simple steps</span>
          </h2>
          <p className="section-subtitle">
            Getting started takes less than a minute.
          </p>
        </div>

        <div className="hiw-steps">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="hiw-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="hiw-step-icon">{step.icon}</div>
              <div className="hiw-step-num">{step.num}</div>
              <h3 className="hiw-step-title">{step.title}</h3>
              <p className="hiw-step-desc">{step.desc}</p>
            </motion.div>
          ))}

          <div className="hiw-arrow hiw-arrow-1">→</div>
          <div className="hiw-arrow hiw-arrow-2">→</div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;

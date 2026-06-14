import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import "./Modal.css";

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            className={`modal-card modal-${size}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {title && (
              <div className="modal-header">
                <h3 className="modal-title">{title}</h3>
                <button className="modal-close" onClick={onClose}>
                  <AiOutlineClose size={18} />
                </button>
              </div>
            )}
            <div className="modal-body">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;

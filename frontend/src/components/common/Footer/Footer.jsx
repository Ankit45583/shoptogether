import { Link } from "react-router-dom";
import { BsTwitterX, BsInstagram, BsLinkedin } from "react-icons/bs";
import Logo from "../Logo/Logo";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo />
          <p className="footer-tagline">Shop smarter, decide together.</p>
          <div className="footer-social">
            <a href="#" className="footer-social-link"><BsTwitterX size={16} /></a>
            <a href="#" className="footer-social-link"><BsInstagram size={16} /></a>
            <a href="#" className="footer-social-link"><BsLinkedin size={16} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <Link to="/register">Pricing</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 ShopTogether. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

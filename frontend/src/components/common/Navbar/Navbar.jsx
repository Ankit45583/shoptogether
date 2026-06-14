import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Logo from "../Logo/Logo";
import Button from "../../ui/Button/Button";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={["landing-nav", scrolled ? "scrolled" : ""].filter(Boolean).join(" ")}>
      <div className="landing-nav-inner">
        <Logo />

        <div className={["nav-links", menuOpen ? "open" : ""].filter(Boolean).join(" ")}>
          <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="nav-link" onClick={() => setMenuOpen(false)}>How it Works</a>
          <a href="#testimonials" className="nav-link" onClick={() => setMenuOpen(false)}>About</a>
        </div>

        <div className="nav-actions">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen((p) => !p)}>
          {menuOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

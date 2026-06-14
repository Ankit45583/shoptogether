import { Link } from "react-router-dom";
import { BsBagHeartFill } from "react-icons/bs";
import "./Logo.css";

function Logo({ size = "md", linkTo = "/" }) {
  return (
    <Link to={linkTo} className={`logo logo-${size}`}>
      <div className="logo-icon">
        <BsBagHeartFill />
      </div>
      <span className="logo-text">ShopTogether</span>
    </Link>
  );
}

export default Logo;

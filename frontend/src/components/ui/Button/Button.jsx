import "./Button.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <AiOutlineLoading3Quarters className="animate-spin" size={16} />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

export default Button;

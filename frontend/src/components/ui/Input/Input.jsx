import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./Input.css";

function Input({
  label,
  error,
  icon,
  type = "text",
  className = "",
  disabled,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <div className="input-field-wrap">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={inputType}
          disabled={disabled}
          className={[
            "input-field",
            icon ? "has-icon" : "",
            type === "password" ? "has-right-icon" : "",
            error ? "input-error" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className="input-right-icon"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}

export default Input;

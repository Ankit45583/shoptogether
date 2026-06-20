import "./Input.css";

function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  rightIcon,
  error,
  disabled = false,
  className = "",
  ...rest
}) {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}

      <div className={`input-field-wrapper ${error ? "has-error" : ""}`}>
        {icon && <span className="input-icon-left">{icon}</span>}

        <input
          className={`input-field ${icon ? "has-left-icon" : ""} ${
            rightIcon ? "has-right-icon" : ""
          }`}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />

        {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
      </div>

      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

export default Input;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import Logo from "../../components/common/Logo/Logo";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import useAuthStore from "../../store/auth.store";
import { sleep } from "../../lib/utils";
import "./LoginPage.css";
import "./RegisterPage.css";

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

function RegisterPage() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.includes(" ")) e.username = "No spaces allowed";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    if (!form.terms) e.terms = "You must accept the terms";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      await sleep(800);
      login({
        id: "1",
        name: form.name,
        username: form.username,
        email: form.email,
        avatar: "",
        bio: "",
        token: "mock-jwt-token",
      });
      toast.success("Account created! Welcome 🎉");
      navigate("/dashboard");
    } catch {
      toast.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  return (
    <div className="auth-card">
      <div className="auth-card-logo">
        <Logo size="md" />
      </div>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">Join thousands of group shoppers</p>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <Input label="Full Name" placeholder="Arjun Sharma" icon={<AiOutlineUser size={16} />} value={form.name} onChange={set("name")} error={errors.name} />

        <div className="username-input-wrap">
          <Input label="Username" placeholder="arjun_s" icon={<span className="at-sign">@</span>} value={form.username} onChange={set("username")} error={errors.username} />
        </div>

        <Input label="Email" type="email" placeholder="you@example.com" icon={<AiOutlineMail size={16} />} value={form.email} onChange={set("email")} error={errors.email} />

        <div>
          <Input label="Password" type="password" placeholder="Min 8 characters" icon={<AiOutlineLock size={16} />} value={form.password} onChange={set("password")} error={errors.password} />
          {form.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div className="strength-fill" style={{ width: `${(strength / 4) * 100}%`, background: strengthColor[strength] }} />
              </div>
              <p className="strength-text">{strengthLabel[strength]}</p>
            </div>
          )}
        </div>

        <Input label="Confirm Password" type="password" placeholder="Repeat password" icon={<AiOutlineLock size={16} />} value={form.confirm} onChange={set("confirm")} error={errors.confirm} />

        <div>
          <label className="auth-checkbox">
            <input type="checkbox" checked={form.terms} onChange={set("terms")} />
            I agree to <a href="#" className="auth-link">Terms of Service</a> and <a href="#" className="auth-link">Privacy Policy</a>
          </label>
          {errors.terms && <span style={{ fontSize: "var(--text-xs)", color: "var(--error)" }}>{errors.terms}</span>}
        </div>

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Create Account
        </Button>

        <div className="auth-divider"><span>or</span></div>

        <Button type="button" variant="outline" fullWidth leftIcon={<FcGoogle size={18} />} onClick={() => toast("Google signup coming soon!")}>
          Continue with Google
        </Button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">Sign in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;

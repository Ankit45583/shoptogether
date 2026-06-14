import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import Logo from "../../components/common/Logo/Logo";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import useAuthStore from "../../store/auth.store";
import { sleep } from "../../lib/utils";
import "./LoginPage.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      await sleep(700);
      // Mock login — any email/password works
      login({
        id: "1",
        name: "Arjun Sharma",
        username: "arjun_s",
        email: form.email,
        avatar: "",
        bio: "Fashion lover from Mumbai",
        token: "mock-jwt-token",
      });
      toast.success("Welcome back! 👋");
      navigate("/dashboard");
    } catch {
      toast.error("Login failed. Try again.");
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
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<AiOutlineMail size={16} />}
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<AiOutlineLock size={16} />}
          value={form.password}
          onChange={set("password")}
          error={errors.password}
        />

        <div className="auth-row">
          <label className="auth-checkbox">
            <input type="checkbox" checked={form.remember} onChange={set("remember")} />
            Remember me
          </label>
          <a href="#" className="auth-link">Forgot password?</a>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Sign In
        </Button>

        <div className="auth-divider"><span>or</span></div>

        <Button
          type="button"
          variant="outline"
          fullWidth
          leftIcon={<FcGoogle size={18} />}
          onClick={() => toast("Google login coming soon!")}
        >
          Continue with Google
        </Button>
      </form>

      <p className="auth-footer-text">
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;

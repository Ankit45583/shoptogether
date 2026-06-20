import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import useAuthStore from "../../store/auth.store";
import { loginUser } from "../../api/auth.api";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ==========================================
     LOGIN HANDLER — Real Backend Connect
  ========================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // ✅ Backend API call
      const response = await loginUser(form);

      const { user, accessToken } = response.data;

      // Save to store
      setAuth(user, accessToken);

      toast.success(`Welcome back, ${user.name}! 👋`);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Login failed. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue shopping together</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            icon={<AiOutlineMail size={18} />}
          />

          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            icon={<AiOutlineLock size={18} />}
            rightIcon={
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
            }
          />

          <div className="auth-row">
            <label className="auth-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default LoginPage;
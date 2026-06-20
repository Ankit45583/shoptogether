import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import useAuthStore from "../../store/auth.store";
import { registerUser } from "../../api/auth.api";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ==========================================
     REGISTER HANDLER — Real Backend Connect
  ========================================== */

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !form.name ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    setLoading(true);

    try {
      // ✅ Backend API call
      const { confirmPassword, ...userData } = form;
      const response = await registerUser(userData);

      const { user, accessToken } = response.data;

      // Save to store
      setAuth(user, accessToken);

      toast.success(`Account created! Welcome ${user.name} 🎉`);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Registration failed. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="register-page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join thousands of group shoppers</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <Input
            label="Full Name"
            name="name"
            placeholder="Ankit Maurya"
            value={form.name}
            onChange={handleChange}
            icon={<AiOutlineUser size={18} />}
          />

          <Input
            label="Username"
            name="username"
            placeholder="ankit_m"
            value={form.username}
            onChange={handleChange}
            icon={<AiOutlineUser size={18} />}
          />

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
            placeholder="At least 6 characters"
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

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={handleChange}
            icon={<AiOutlineLock size={18} />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default RegisterPage;
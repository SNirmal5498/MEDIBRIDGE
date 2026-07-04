import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-2xl text-text">
            Welcome back
          </h1>

          <p className="mt-1.5 text-sm text-text-muted">
            Log in to manage your orders and favorites.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-5">

          {error && (
            <div className="rounded-lg bg-danger-50 text-danger text-sm px-3.5 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Email
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-colors">
              <Mail className="w-4 h-4 text-text-muted shrink-0" />

              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full text-sm focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Password
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-colors">
              <Lock className="w-4 h-4 text-text-muted shrink-0" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-sm focus:outline-none bg-transparent"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted shrink-0"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            icon={LogIn}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>

          <p className="text-center text-sm text-text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-hover font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
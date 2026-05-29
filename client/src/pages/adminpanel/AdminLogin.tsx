import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/admin-dashboard");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B0F2F] overflow-hidden">

      {/* Abstract Background */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl bottom-[-120px] right-[-120px]" />

      {/* logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/public/images/logo.webp"
            alt="SRP Logo"
            className="h-16 w-16 object-contain"
          />
        </div>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white rounded-2xl shadow-2xl p-10 w-[380px]"
      >


        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Panel Login
        </h2>

        {/* Username */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-5 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#121959] hover:bg-[#1A237E] text-white p-3 rounded-lg font-semibold transition duration-200"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Secure Admin Access
        </p>
      </form>
    </div>
  );
}
// src/pages/Login.jsx
import { useState } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", null, {
        params: { email, password }
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 
        p-10 rounded-2xl w-[380px] shadow-[0_0_40px_rgba(0,0,0,0.3)]
        transition-all duration-300">

        <h1 className="text-white text-3xl font-bold mb-6 text-center">
          Welcome Back
        </h1>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white
              placeholder-gray-300 outline-none backdrop-blur-md
              focus:ring-2 focus:ring-purple-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white
              placeholder-gray-300 outline-none backdrop-blur-md
              focus:ring-2 focus:ring-purple-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 
            text-white py-3 mt-2 rounded-lg transition shadow-lg"
          >
            Login
          </button>

        </form>

        {/* NEW REGISTER LINK */}
        <p className="text-center text-sm text-gray-300 mt-4">
          New user?
          <Link to="/register" className="text-purple-400 ml-1 hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

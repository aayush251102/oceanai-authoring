import { useState } from "react";
import { API } from "../api/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", null, {
        params: { email, password }
      });

      alert("Registration successful! Now login.");
      window.location.href = "/login";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-xl w-[350px]">
        <h1 className="text-2xl mb-6 font-bold text-center">Register</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 p-3 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}

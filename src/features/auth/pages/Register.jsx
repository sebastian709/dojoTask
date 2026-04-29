import { useState } from "react";
import { registerUser } from "../services/cognitoService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await registerUser(email, password);

      toast.success("Account created! Check your email for OTP");

      navigate("/confirm", { state: { email } });
    } catch (err) {
      console.log(err);

      // 🔥 SMART ERROR HANDLING
      if (err.name === "UsernameExistsException") {
        toast.error("Email already registered");
      } else if (err.name === "InvalidPasswordException") {
        toast.error("Password must be stronger");
      } else {
        toast.error(err?.message || "Register failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <form
        onSubmit={handleRegister}
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5"
      >
        <h1 className="text-2xl font-bold text-white text-center">
          Create Account
        </h1>

        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none border border-white/20"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none border border-white/20"
        />

        <button
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 transition py-3 rounded-lg text-white font-semibold"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

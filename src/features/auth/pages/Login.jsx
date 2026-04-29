import { useState } from "react";
import { loginUser } from "../services/cognitoService";
import { checkUser } from "../../../services/userApi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { signOut } from "aws-amplify/auth";
import { Toaster, toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signOut().catch(() => {});

      // 1. LOGIN (auth only)
      const authUser = await loginUser(email, password);

      // 2. CHECK PROFILE (REAL APP USER)
      const profile = await checkUser(email);

      // 3. NORMALIZE FINAL USER
      const finalUser = {
        username: email,
        ...profile,
      };

      // 4. STORE CLEAN USER
      setUser(finalUser);

      // 5. ROUTE BASED ON PROFILE
      if (profile.is_no_data === 1) {
        toast.success("Welcome! Let's create your profile");
        navigate("/create-profile", { state: { username: email } });
      } else {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      toast.error(err?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <form
        onSubmit={handleLogin}
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5"
      >
        <h1 className="text-2xl font-bold text-white text-center">
          Welcome Back
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
          className="w-full bg-blue-500 hover:bg-blue-600 transition py-3 rounded-lg text-white font-semibold"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-gray-300 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

import { useState } from "react";
import { loginUser } from "../services/cognitoService";
import { checkUser } from "../../../services/userApi";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuthStore } from "../store";
import { signOut } from "aws-amplify/auth";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const redirectTo =
    searchParams.get("redirect") || "/dashboard";

  // 🔥 CORRECT FLAG
  const isJoinFlow =
    redirectTo.startsWith("/workspace/join/");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signOut().catch(() => {});

      // 1. LOGIN
      await loginUser(email, password);

      // 2. PROFILE CHECK
      const profile = await checkUser(email);

      // 3. STORE USER
      const finalUser = {
        username: email,
        ...profile,
      };

      setUser(finalUser);

      // 4. ROUTING
      if (profile.is_no_data === 1) {
        toast.success("Welcome! Let's create your profile");

        navigate("/create-profile", {
          state: { username: email },
        });
      } else {
        toast.success(
          isJoinFlow
            ? "Continue to workspace 🚀"
            : "Welcome back!"
        );

        navigate(redirectTo, { replace: true });
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
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5 relative overflow-hidden"
      >
        {/* 🔥 JOIN MODE BANNER */}
        {isJoinFlow && (
          <div className="mb-2 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs text-center">
            You’re joining a workspace 👋
            <div className="text-[10px] text-indigo-400 mt-1">
              Login to continue
            </div>
          </div>
        )}

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-white text-center">
          {isJoinFlow ? "Join Workspace" : "Welcome Back"}
        </h1>

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none border border-white/20 focus:border-indigo-400 transition"
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none border border-white/20 focus:border-indigo-400 transition"
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            isJoinFlow
              ? "bg-indigo-500 hover:bg-indigo-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading
            ? "Signing in..."
            : isJoinFlow
            ? "Continue to Workspace"
            : "Login"}
        </button>

        {/* FOOTER */}
        {!isJoinFlow && (
          <p className="text-center text-gray-300 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        )}
      </form>
    </div>
  );
}
import { useState } from "react";
import { loginUser } from "../services/cognitoService";
import { checkUser } from "../../../services/userApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store";
import toast from "react-hot-toast";
import DojoTaskLogo from "../../../assets/DojoTaskNoBG.png";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const flow = searchParams.get("flow");

  const isJoinFlow =
    flow === "join" || redirectTo.startsWith("/workspace/join/");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await loginUser(email, password);

      const res = await checkUser(email);
      const profile = res?.data || res; // 🔥 IMPORTANT FIX

      setUser({
        username: email,
        ...profile,
      });

      console.log(res);

      if (profile?.is_no_data === 1) {
        toast.success("Complete your profile first");

        navigate("/create-profile", {
          replace: true,
          state: {
            username: email,
            pendingRedirect: redirectTo,
            flow,
          },
        });

        return;
      }

      toast.success(isJoinFlow ? "Continue to workspace 🚀" : "Welcome back!");

      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false); // 🔥 BEST PRACTICE
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <form
        onSubmit={handleLogin}
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5"
      >
        {/* 🔥 LOGO + BRAND */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={DojoTaskLogo}
            alt="DojoTask"
            className="w-14 h-14 object-contain drop-shadow-lg"
          />

          <h1 className="text-xl font-semibold text-white tracking-wide">
            <span className="text-indigo-400">Dojo</span>
            <span className="text-white">Task</span>
          </h1>

          <p className="text-[11px] text-gray-400 -mt-1">
            Organize. Focus. Execute.
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-white text-center mt-2">
          {isJoinFlow ? "Join Workspace" : "Welcome Back"}
        </h2>

        {/* INPUTS */}
        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-lg text-white font-medium transition"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* REGISTER */}
        <p className="text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

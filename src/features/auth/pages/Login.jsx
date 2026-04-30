import { useState } from "react";
import { loginUser } from "../services/cognitoService";
import { checkUser } from "../../../services/userApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store";
import toast from "react-hot-toast";

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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <form
        onSubmit={handleLogin}
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5"
      >
        <h1 className="text-2xl font-bold text-white text-center">
          {isJoinFlow ? "Join Workspace" : "Welcome Back"}
        </h1>

        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/10 text-white"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-white/10 text-white"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg text-white"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { registerUser } from "../services/cognitoService";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import DojoTaskLogo from "../../../assets/DojoTaskNoBG.png";

export default function Register() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const redirectTo = params.get("redirect") || "/dashboard";
  const flow = params.get("flow");

  const isJoinFlow = flow === "join";

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await registerUser(email, password);

      toast.success("Account created! Check OTP");

      navigate("/confirm", {
        state: {
          email,
          redirectTo,
          flow,
        },
      });
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Register failed");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <form
        onSubmit={handleRegister}
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

        {/* JOIN MESSAGE */}
        {isJoinFlow && (
          <div className="text-indigo-300 text-xs text-center">
            Create account to join workspace 👋
          </div>
        )}

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-white text-center">
          {isJoinFlow ? "Join Workspace" : "Create Account"}
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
        <button className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-lg text-white font-medium transition">
          Register
        </button>

        {/* LOGIN */}
        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

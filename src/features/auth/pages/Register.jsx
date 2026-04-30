import { useState } from "react";
import { registerUser } from "../services/cognitoService";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <form
        onSubmit={handleRegister}
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5"
      >
        {isJoinFlow && (
          <div className="text-indigo-300 text-xs text-center mb-2">
            Create account to join workspace 👋
          </div>
        )}

        <h1 className="text-2xl font-bold text-white text-center">
          {isJoinFlow ? "Join Workspace" : "Create Account"}
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

        <button className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg text-white">
          Register
        </button>
      </form>
    </div>
  );
}

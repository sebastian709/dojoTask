import { useState } from "react";
import { confirmUser } from "../services/cognitoService";
import { useLocation, useNavigate } from "react-router-dom";

export default function ConfirmOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const email = state?.email;

  // 🔥 PRESERVE FLOW
  const redirectTo = state?.redirectTo || "/dashboard";
  const flow = state?.flow;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const code = e.target.code.value;

    try {
      await confirmUser(email, code);

      navigate(
        `/?redirect=${state?.redirectTo || "/dashboard"}&flow=${state?.flow || ""}`,
        { replace: true },
      );
    } catch (err) {
      alert(err?.message || "Invalid OTP");
      // console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <form
        onSubmit={handleConfirm}
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5 text-center"
      >
        <h1 className="text-2xl font-bold text-white">Verify Account</h1>

        <p className="text-gray-300 text-sm">
          Enter the OTP sent to your email
        </p>

        <input
          name="code"
          placeholder="Enter OTP"
          className="w-full p-3 text-center tracking-widest text-lg rounded-lg bg-white/10 text-white"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg text-white font-semibold"
        >
          {loading ? "Verifying..." : "Confirm"}
        </button>
      </form>
    </div>
  );
}

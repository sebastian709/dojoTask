import { useState } from "react";
import { createProfile } from "../services/userApi";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreateProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);

  const username = state?.username;
  const pendingRedirect = state?.pendingRedirect;
  const flow = state?.flow;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProfile({
        firstname: e.target.firstname.value,
        lastname: e.target.lastname.value,
        username,
      });

      // 🔥 AFTER PROFILE IS CREATED → NOW ALLOW REDIRECT
      if (pendingRedirect) {
        navigate(pendingRedirect, {
          replace: true,
          state: { flow },
        });
        return;
      }

      navigate("/dashboard", { replace: true });

    } catch (err) {
      // console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <form
        onSubmit={handleSave}
        className="w-[400px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl"
      >
        <h1 className="text-white text-center text-xl mb-4">
          Complete Profile
        </h1>

        <input name="firstname" placeholder="First name" className="w-full p-3 mb-3 bg-white/10 text-white" />
        <input name="lastname" placeholder="Last name" className="w-full p-3 mb-3 bg-white/10 text-white" />

        <button className="w-full bg-green-500 py-3 text-white">
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
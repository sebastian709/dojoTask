import { useState } from "react";
import { createProfile } from "../services/userApi";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreateProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      firstname: e.target.firstname.value,
      lastname: e.target.lastname.value,
      username: state?.username,
    };

    try {
      await createProfile(payload);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.message || "Failed to save profile");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">

      <form
        onSubmit={handleSave}
        className="w-[400px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-5"
      >
        <h1 className="text-2xl font-bold text-white text-center">
          Complete Your Profile
        </h1>

        <p className="text-center text-gray-300 text-sm">
          Let’s set up your account
        </p>

        <input
          name="firstname"
          placeholder="First Name"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none border border-white/20"
        />

        <input
          name="lastname"
          placeholder="Last Name"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none border border-white/20"
        />

        <button
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 transition py-3 rounded-lg text-white font-semibold"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </form>

    </div>
  );
}
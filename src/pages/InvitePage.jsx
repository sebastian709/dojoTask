// 📁 pages/InvitePage.jsx

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvite, acceptInvite } from "../features/workspace/services/inviteApi";
import { useAuthStore } from "../features/auth/store";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";

export default function InvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH INVITE DATA
  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const data = await getInvite(token);
        setInvite(data);
      } catch (err) {
        toast.error("Invalid or expired invite");
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [token]);

  // 🔥 REDIRECT IF NOT LOGGED IN (FIXED)
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate(`/?redirect=/invite/${token}`);
    }
  }, [isAuthenticated, loading, navigate, token]);

  const handleJoin = async () => {
    try {
      await acceptInvite(token);

      toast.success("Joined workspace!");

      navigate(`/workspace/${invite.workspace_id}`);
    } catch (err) {
      toast.error("Failed to join workspace");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        Loading invite...
      </div>
    );
  }

  if (!invite) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col">
      <NavBar />

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white/5 border border-white/10 p-8 rounded-xl w-[400px] text-center space-y-4">
          <h1 className="text-xl font-bold">You're invited!</h1>

          <p className="text-gray-300">Join workspace:</p>

          <h2 className="text-lg font-semibold text-white">
            {invite.workspace_name}
          </h2>

          <p className="text-sm text-gray-400">{invite.description}</p>

          <button
            onClick={handleJoin}
            className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg mt-4"
          >
            Join Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
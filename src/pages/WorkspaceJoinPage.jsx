import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function WorkspaceJoinPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();

        // ❌ NOT LOGGED IN → redirect to login
        if (!token) {
          navigate(`/?redirect=/workspace/join/${workspaceId}`);
          return;
        }

        // ✅ FETCH WORKSPACE
        const res = await axios.get(
          `${API_BASE}/workspace/getWorkspace/${workspaceId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setWorkspace(res.data);
      } catch (err) {
        console.log("FETCH ERROR:", err);

        if (err?.response?.status === 401) {
          navigate(`/?redirect=/workspace/join/${workspaceId}`);
          return;
        }

        toast.error("Workspace not found");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [workspaceId, navigate]);

  const handleJoin = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      await axios.post(
        `${API_BASE}/workspace/join`,
        { workspace_id: workspaceId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      toast.success("Joined workspace!");
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      console.log("JOIN ERROR:", err);

      const message = err?.response?.data?.message;

      // 🔥 IF ALREADY MEMBER → treat as success
      if (message === "Already a member") {
        toast.success("You're already in this workspace 👌");
        navigate(`/workspace/${workspaceId}`);
        return;
      }

      toast.error(message || "Failed to join workspace");
    }
  };

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0f19]">
        Loading workspace...
      </div>
    );
  }

  // ❌ NO DATA
  if (!workspace) return null;

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0f19]">
      <div className="bg-white/5 p-6 rounded-xl w-[420px] border border-white/10">
        <h1 className="text-xl font-bold">
          {workspace.workspace_name}
        </h1>

        <p className="text-gray-400 mt-2">
          {workspace.description}
        </p>

        <button
          onClick={handleJoin}
          className="w-full mt-5 bg-indigo-500 hover:bg-indigo-600 py-2 rounded transition"
        >
          Join Workspace
        </button>
      </div>
    </div>
  );
}
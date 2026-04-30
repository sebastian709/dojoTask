import { useParams, useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import WorkspaceShareDrawer from "../components/WorkspaceShareDrawer";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const getWorkspaceById = useWorkspaceStore(
    (s) => s.getWorkspaceById
  );

  const [workspace, setWorkspace] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // 🔥 1. CHECK STORE FIRST
        const ws = getWorkspaceById(workspaceId);

        if (ws) {
          setWorkspace(ws);
          return;
        }

        // 🔥 2. FALLBACK FETCH (FIX SA ISSUE MO)
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();

        if (!token) {
          navigate("/");
          return;
        }

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
        console.log("WORKSPACE FETCH ERROR:", err);
        navigate("/dashboard");
      }
    };

    init();
  }, [workspaceId, getWorkspaceById, navigate]);

  if (!workspace) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col">
        <NavBar />
        <div className="flex flex-1 flex-col items-center justify-center text-gray-400 gap-3">
          <span className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></span>
          <p className="text-sm animate-pulse">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-white/10">
          <SideBar />
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {workspace.workspace_name}
              </h1>
              <p className="text-gray-400 mt-2">
                {workspace.description}
              </p>
            </div>

            {/* SHARE BUTTON */}
            <button
              onClick={() => setShareOpen(true)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm"
            >
              Share
            </button>
          </div>

          <hr className="my-6 border-white/10" />

          {/* BOARDS */}
          <h2 className="text-lg font-semibold mb-4">
            Boards
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((board) => (
              <div
                key={board}
                className="group relative p-3 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition"></div>

                <div className="flex items-start justify-between">
                  <h3 className="text-white font-semibold text-sm">
                    Board {board}
                  </h3>

                  <div className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition">
                    ⋯
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                  Organize tasks, collaborate with team, and track progress efficiently.
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] px-2 py-[2px] rounded-full bg-white/10 text-gray-300">
                    0 tasks
                  </span>

                  <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                    Open →
                  </span>
                </div>
              </div>
            ))}

            <div className="group flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="text-3xl text-gray-400 group-hover:text-white transition group-hover:rotate-90 duration-200">
                +
              </div>

              <h3 className="mt-1 text-sm text-white font-medium">
                Create Board
              </h3>

              <p className="text-[11px] text-gray-400 text-center">
                Add a new workspace board
              </p>
            </div>
          </div>
        </main>
      </div>

      <WorkspaceShareDrawer
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        workspace={workspace}
      />
    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import toast from "react-hot-toast";

import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import WorkspaceShareDrawer from "../components/WorkspaceShareDrawer";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const getWorkspaceById = useWorkspaceStore((s) => s.getWorkspaceById);

  const [workspace, setWorkspace] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDesc, setBoardDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;

    try {
      setCreating(true);

      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();
      // const userId = session.tokens?.idToken?.payload?.sub;

      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action: "CREATE",
          workspace_id: workspaceId,
          board_name: boardName,
          description: boardDesc,
          // created_by: userId,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      );

      // 🔥 refresh boards
      const res = await axios.post(
        `${API_BASE}/board/crud`,
        {
          action: "LIST",
          workspace_id: workspaceId,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      );

      setBoards(res.data || []);

      // reset
      setBoardName("");
      setBoardDesc("");
      setCreateOpen(false);

      toast.success("Board created successfully!");
    } catch (err) {
      // console.log("CREATE BOARD ERROR:", err);
      toast.error("Failed to create board");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      if (!workspaceId) return;

      try {
        setLoadingBoards(true);

        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();

        const res = await axios.post(
          `${API_BASE}/board/crud`,
          {
            action: "LIST",
            workspace_id: workspaceId,
          },
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        );

        setBoards(res.data || []);
      } catch (err) {
        // console.log("BOARD FETCH ERROR:", err);
        setBoards([]);
      } finally {
        setLoadingBoards(false);
      }
    };

    fetchBoards();
  }, [workspaceId]);

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
          },
        );

        setWorkspace(res.data);
      } catch (err) {
        // console.log("WORKSPACE FETCH ERROR:", err);
        navigate("/dashboard");
      }
    };

    init();
  }, [workspaceId, getWorkspaceById, navigate]);

  if (!workspace) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col overflow-hidden">
        <NavBar />

        <div className="flex-1 flex items-center justify-center relative">
          {/* background glow */}
          <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full" />

          <div className="relative flex flex-col items-center">
            {/* spinner */}
            <div className="relative flex items-center justify-center">
              {/* outer ring */}
              <div className="w-16 h-16 rounded-full border border-white/10" />

              {/* spinning ring */}
              <div className="absolute w-16 h-16 rounded-full border-2 border-transparent border-t-indigo-400 border-r-indigo-500 animate-spin" />

              {/* center glow */}
              <div className="absolute w-6 h-6 rounded-full bg-indigo-500/80 blur-sm animate-pulse" />
            </div>

            {/* text */}
            <div className="mt-6 flex flex-col items-center">
              <h2 className="text-sm font-medium text-white/90 tracking-wide">
                Loading Workspace
              </h2>

              <p className="text-xs text-gray-500 mt-1 animate-pulse">
                Syncing boards and tasks...
              </p>
            </div>

            {/* loading bars */}
            <div className="mt-8 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: "240ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div className="flex-shrink-0">
          <SideBar />
        </div>

        {/* CONTENT */}
        <main className="flex-1 min-w-0 p-6 overflow-y-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{workspace.workspace_name}</h1>
              <p className="text-gray-400 mt-2">{workspace.description}</p>
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
          <h2 className="text-lg font-semibold mb-4">Boards</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {loadingBoards ? (
              [1, 2, 3, 4].map((b) => (
                <div
                  key={b}
                  className="p-3 rounded-xl border border-white/10 bg-white/5 animate-pulse"
                >
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-3 bg-white/10 rounded w-full mt-2"></div>
                </div>
              ))
            ) : boards.length > 0 ? (
              boards.map((board) => (
                <div
                  key={board.board_id}
                  onClick={() =>
                    navigate(
                      `/workspace/${workspaceId}/board/${board?.board_id || ""}`,
                    )
                  }
                  className="group relative p-3 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition"></div>

                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-semibold text-sm">
                      {board.board_name || "Board"}
                    </h3>

                    <div className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition">
                      ⋯
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                    {board.description || "No description"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] px-2 py-[2px] rounded-full bg-white/10 text-gray-300">
                      {board.active_tasks || 0} tasks
                    </span>

                    <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                      Open →
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-full">
                No boards yet
              </p>
            )}

            <div
              onClick={() => setCreateOpen(true)}
              className="group flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10"
            >
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

      {createOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111827] w-[400px] rounded-xl p-5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Create Board</h2>

            <input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Board name"
              className="w-full mb-3 px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
            />

            <textarea
              value={boardDesc}
              onChange={(e) => setBoardDesc(e.target.value)}
              placeholder="Description"
              className="w-full mb-4 px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-3 py-2 text-sm text-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateBoard}
                disabled={creating}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-sm"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <WorkspaceShareDrawer
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        workspace={workspace}
      />
    </div>
  );
}

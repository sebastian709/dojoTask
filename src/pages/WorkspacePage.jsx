import { useParams } from "react-router-dom";
import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import WorkspaceShareDrawer from "../components/WorkspaceShareDrawer";

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const getWorkspaceById = useWorkspaceStore((s) => s.getWorkspaceById);

  const [workspace, setWorkspace] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const ws = getWorkspaceById(workspaceId);
    setWorkspace(ws);
  }, [workspaceId, getWorkspaceById]);

  if (!workspace) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col">
        <NavBar />
        <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
          <span className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></span>
          <p className="text-sm animate-pulse">Loading your workspace...</p>
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
              <h1 className="text-2xl font-bold">{workspace.workspace_name}</h1>
              <p className="text-gray-400 mt-2">{workspace.description}</p>
            </div>

            {/* 🔥 SHARE BUTTON */}
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
            {/* BOARDS */}
            {[1, 2, 3, 4].map((board) => (
              <div
                key={board}
                className="group relative p-3 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10"
              >
                {/* TOP ACCENT BAR */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition"></div>

                {/* HEADER ROW */}
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-semibold text-sm">
                    Board {board}
                  </h3>

                  {/* DOT MENU (fake UI feel) */}
                  <div className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition">
                    ⋯
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                  Organize tasks, collaborate with team, and track progress
                  efficiently.
                </p>

                {/* FOOTER */}
                <div className="mt-3 flex items-center justify-between">
                  {/* TASK COUNT */}
                  <span className="text-[10px] px-2 py-[2px] rounded-full bg-white/10 text-gray-300">
                    0 tasks
                  </span>

                  {/* ACTION */}
                  <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition translate-x-0 group-hover:translate-x-1">
                    Open →
                  </span>
                </div>
              </div>
            ))}

            {/* CREATE BOARD CARD */}
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

      {/* 🔥 DRAWER */}
      <WorkspaceShareDrawer
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        workspace={workspace}
      />
    </div>
  );
}

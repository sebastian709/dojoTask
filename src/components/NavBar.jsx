import React, { useState } from "react";
import { useAuthStore } from "../features/auth/store";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/services/cognitoService";
import Modal from "./Modal";
import { createWorkspace } from "../features/workspace/services/workspaceApi";
import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";
import toast from "react-hot-toast";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 🔥 NEW STATES (workspace form)
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDesc, setWorkspaceDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const { addWorkspace } = useWorkspaceStore();

  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/");
  };

  // 🔥 CREATE WORKSPACE HANDLER
  const handleCreateWorkspace = async () => {
    if (!workspaceName) return;

    setLoading(true);

    // 🔥 OPTIMISTIC UI (instant add)
    const tempWorkspace = {
      workspace_id: Date.now().toString(),
      workspace_name: workspaceName,
      description: workspaceDesc,
      owner_fullname: user?.firstname,
      status: "active",
      created_at: new Date().toISOString(),
    };

    addWorkspace(tempWorkspace);

    try {
      const res = await createWorkspace({
        workspace_name: workspaceName,
        workspace_description: workspaceDesc,
      });

      toast.success("Workspace created!");

      setWorkspaceName("");
      setWorkspaceDesc("");
      setShowModal(false);
    } catch (err) {
      console.log(err);

      toast.error("Failed to create workspace");

      // rollback optimistic UI
      // (optional advanced step later)
    }

    setLoading(false);
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0f172a] sticky top-0 z-50 backdrop-blur-md">
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/dashboard`)}
        >
          <img src="/icons/DojoTaskNoBG.png" className="h-8 w-8" alt="logo" />
          <span className="text-xl font-bold text-white">Dojo Task</span>
        </div>

        {/* SEARCH + CREATE */}
        <div className="flex items-center gap-3 w-1/2">
          <input
            placeholder="Search workspace..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white outline-none"
          />

          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-500 px-4 py-2 rounded-lg text-white whitespace-nowrap cursor-pointer hover:bg-indigo-600 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Create
          </button>
        </div>

        {/* USER */}
        <div className="flex items-center gap-4 relative">
          <span className="text-sm text-gray-300 hidden md:block">
            {user?.firstname || user?.username || "User"}
          </span>

          <div
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white cursor-pointer"
          >
            {(user?.firstname || user?.username || "U").charAt(0).toUpperCase()}
          </div>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#111827] border border-white/10 rounded-lg">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-white font-semibold">
                  {user?.firstname || user?.username}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-2 text-white hover:bg-white/10"
              >
                Profile
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="w-full text-left px-4 py-2 text-white hover:bg-white/10"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MODAL */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg">Create Workspace</h2>

          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <input
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          placeholder="Workspace name"
          className="w-full p-2 mb-3 bg-white/10 text-white rounded outline-none"
        />

        <textarea
          value={workspaceDesc}
          onChange={(e) => setWorkspaceDesc(e.target.value)}
          placeholder="Description"
          className="w-full p-2 bg-white/10 text-white mb-4 rounded outline-none"
        />

        <button
          onClick={handleCreateWorkspace}
          disabled={loading}
          className="w-full bg-indigo-500 py-2 rounded text-white cursor-pointer hover:bg-indigo-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-500"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </Modal>
    </>
  );
};

export default NavBar;

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

    // 🔥 OPTIMISTIC UI
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
      await createWorkspace({
        workspace_name: workspaceName,

        workspace_description: workspaceDesc,
      });

      toast.success("Workspace created!");

      setWorkspaceName("");

      setWorkspaceDesc("");

      setShowModal(false);
    } catch (err) {
      // console.log(err);

      toast.error("Failed to create workspace");
    }

    setLoading(false);
  };

  return (
    <>
      <header
        className="
    sticky top-0 z-50

    border-b border-white/10

    bg-[#0f172a]/80
    backdrop-blur-xl

    px-4 sm:px-6

    py-3
  "
      >
        {/* MOBILE LAYOUT */}
        <div className="flex flex-col gap-4 lg:hidden">
          {/* TOP */}
          <div className="flex items-center justify-between gap-4">
            {/* LOGO */}
            <div
              className="
          flex items-center gap-2
          cursor-pointer min-w-0
        "
              onClick={() => navigate(`/dashboard`)}
            >
              <img
                src="/icons/DojoTaskNoBG.png"
                className="h-8 w-8 flex-shrink-0"
                alt="logo"
              />

              <span
                className="
            text-lg font-bold
            text-white truncate
          "
              >
                Dojo Task
              </span>
            </div>

            {/* USER */}
            <div className="flex items-center gap-3 relative">
              <div
                onClick={() => setOpen(!open)}
                className="
            w-10 h-10 rounded-2xl
            bg-indigo-500
            flex items-center justify-center
            text-white cursor-pointer
            flex-shrink-0
          "
              >
                {(user?.firstname || user?.username || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              {/* DROPDOWN */}
              {open && (
                <div
                  className="
              absolute right-0 top-full mt-3

              w-56

              rounded-3xl

              border border-white/10

              bg-[#111827]

              overflow-hidden

              shadow-2xl
            "
                >
                  <div className="px-4 py-4 border-b border-white/10">
                    <p className="text-white font-semibold">
                      {user?.firstname || user?.username}
                    </p>

                    <p className="text-xs text-gray-400 mt-1 break-all">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/profile")}
                    className="
                w-full text-left
                px-4 py-3
                text-white
                hover:bg-white/10
              "
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    className="
                w-full text-left
                px-4 py-3
                text-white
                hover:bg-white/10
              "
                  >
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="
                w-full text-left
                px-4 py-3
                text-red-400
                hover:bg-red-500/10
              "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-3">
            <input
              placeholder="Search workspace..."
              className="
          flex-1
          px-4 py-3
          rounded-2xl
          bg-white/[0.05]
          border border-white/10
          text-white text-sm
          outline-none
          placeholder:text-gray-500
        "
            />

            <button
              onClick={() => setShowModal(true)}
              className="
          px-5 py-3
          rounded-2xl
          bg-indigo-500
          text-white text-sm font-medium
          whitespace-nowrap
        "
            >
              Create
            </button>
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div
          className="
      hidden lg:grid

      grid-cols-[1fr_auto_1fr]

      items-center

      gap-6
    "
        >
          {/* LEFT */}
          <div className="flex items-center">
            {/* LOGO */}
            <div
              className="
          flex items-center gap-2
          cursor-pointer
        "
              onClick={() => navigate(`/dashboard`)}
            >
              <img
                src="/icons/DojoTaskNoBG.png"
                className="h-8 w-8"
                alt="logo"
              />

              <span className="text-xl font-bold text-white">Dojo Task</span>
            </div>
          </div>

          {/* CENTER */}
          <div className="flex items-center gap-3 w-[520px]">
            <input
              placeholder="Search workspace..."
              className="
          flex-1
          px-4 py-3
          rounded-2xl
          bg-white/[0.05]
          border border-white/10
          text-white text-sm
          outline-none
          placeholder:text-gray-500
        "
            />

            <button
              onClick={() => setShowModal(true)}
              className="
          px-5 py-3
          rounded-2xl
          bg-indigo-500
          text-white text-sm font-medium
          whitespace-nowrap
        "
            >
              Create
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex justify-end">
            {/* USER */}
            <div className="flex items-center gap-3 relative">
              <span className="text-sm text-gray-300">
                {user?.firstname || user?.username || "User"}
              </span>

              <div
                onClick={() => setOpen(!open)}
                className="
            w-10 h-10 rounded-2xl
            bg-indigo-500
            flex items-center justify-center
            text-white cursor-pointer
          "
              >
                {(user?.firstname || user?.username || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              {/* DROPDOWN */}
              {open && (
                <div
                  className="
              absolute right-0 top-full mt-3

              w-56

              rounded-3xl

              border border-white/10

              bg-[#111827]

              overflow-hidden

              shadow-2xl
            "
                >
                  <div className="px-4 py-4 border-b border-white/10">
                    <p className="text-white font-semibold">
                      {user?.firstname || user?.username}
                    </p>

                    <p className="text-xs text-gray-400 mt-1 break-all">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/profile")}
                    className="
                w-full text-left
                px-4 py-3
                text-white
                hover:bg-white/10
              "
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    className="
                w-full text-left
                px-4 py-3
                text-white
                hover:bg-white/10
              "
                  >
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="
                w-full text-left
                px-4 py-3
                text-red-400
                hover:bg-red-500/10
              "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MODAL */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-lg font-semibold">Create Workspace</h2>

          <button
            onClick={() => setShowModal(false)}
            className="
              w-10 h-10

              rounded-2xl

              bg-white/[0.03]

              border border-white/10

              text-gray-400

              hover:text-white
              hover:bg-white/[0.06]

              transition
            "
          >
            ✕
          </button>
        </div>

        <input
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          placeholder="Workspace name"
          className="
            w-full

            p-3 mb-3

            rounded-2xl

            bg-white/[0.05]

            border border-white/10

            text-white

            outline-none

            placeholder:text-gray-500

            focus:border-indigo-500/50
          "
        />

        <textarea
          value={workspaceDesc}
          onChange={(e) => setWorkspaceDesc(e.target.value)}
          placeholder="Description"
          className="
            w-full

            p-3 mb-4

            rounded-2xl

            bg-white/[0.05]

            border border-white/10

            text-white

            outline-none

            placeholder:text-gray-500

            min-h-[120px]

            focus:border-indigo-500/50
          "
        />

        <button
          onClick={handleCreateWorkspace}
          disabled={loading}
          className="
            w-full

            bg-indigo-500

            py-3

            rounded-2xl

            text-white
            font-medium

            cursor-pointer

            hover:bg-indigo-600

            transition-all duration-200

            active:scale-[0.98]

            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:bg-indigo-500
          "
        >
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </Modal>
    </>
  );
};

export default NavBar;

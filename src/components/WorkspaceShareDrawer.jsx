import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAuthSession } from "aws-amplify/auth";

import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";
import { getWorkspaceMembers } from "../features/workspace/services/workspaceApi";

const WorkspaceShareDrawer = ({ open, onClose, workspace }) => {
  const [copied, setCopied] = useState(false);

  // 🧠 Zustand store
  const members = useWorkspaceStore((s) => s.members);
  const setMembers = useWorkspaceStore((s) => s.setMembers);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const session = await fetchAuthSession();
        const id = session?.tokens?.idToken?.payload?.sub;

        setUserId(id);
      } catch (err) {
        console.error("Failed to get auth session", err);
      }
    };

    // loadUser();
  }, []);

  console.log(userId)

  const loadMembers = async () => {
    if (!open || !workspace?.workspace_id) return;

    setLoading(true);

    try {
      const data = await getWorkspaceMembers(workspace.workspace_id);
      setMembers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadMembers = async () => {
      if (!open || !workspace?.workspace_id) return;

      setLoading(true);

      try {
        const data = await getWorkspaceMembers(workspace.workspace_id);
        setMembers(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [open, workspace?.workspace_id]);

  // 🧹 CLEANUP ON CLOSE (optional but good)
  useEffect(() => {
    if (!open) {
      setMembers([]);
    }
  }, [open]);

  const handleCopy = async () => {
    try {
      const link = `${window.location.origin}/workspace/join/${workspace?.workspace_id}`;

      await navigator.clipboard.writeText(link);

      setCopied(true);
      toast.success("Share link copied!");

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Copy failed");
      console.log(err);
    }
  };

  const avatarText = (name) => name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-[#0f172a] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-semibold">Share Workspace</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* WORKSPACE INFO */}
          <div>
            <h3 className="text-white font-semibold">
              {workspace?.workspace_name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {workspace?.description}
            </p>
          </div>

          {/* SHARE LINK */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Share link</label>

            <div className="flex gap-2">
              <input
                value={`${window.location.origin}/workspace/join/${workspace?.workspace_id}`}
                readOnly
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs"
              />

              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>

          {/* MEMBERS SECTION */}
          <div>
            <p className="text-xs text-gray-400 mb-2">
              Members ({members?.length || 0})
            </p>

            <div className="flex flex-wrap gap-2">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/10 animate-pulse"
                  >
                    {/* avatar skeleton */}
                    <div className="w-6 h-6 rounded-full bg-white/10" />

                    {/* text skeleton */}
                    <div className="w-20 h-3 bg-white/10 rounded" />
                  </div>
                ))
              ) : members?.length > 0 ? (
                members.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/10"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">
                      {avatarText(m.firstname + " " + m.lastname || m.user_id)}
                    </div>

                    <span className="text-[11px] text-gray-300">
                      {m.user_id == userId ? "You" : m.firstname + " " + m.lastname || m.user_id}
                    </span>

                    {m.role && (
                      <span className="text-[9px] text-indigo-400">
                        {m.role}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No members yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspaceShareDrawer;

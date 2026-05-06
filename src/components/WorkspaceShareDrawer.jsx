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

  console.log(userId);

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
          <div className="space-y-3">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Workspace Members
                </p>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  {members?.length || 0} people in this workspace
                </p>
              </div>

              <div className="px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-400/10 text-[10px] text-indigo-300">
                Active
              </div>
            </div>

            {/* MEMBERS LIST */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      {/* avatar */}
                      <div className="w-10 h-10 rounded-xl bg-white/10" />

                      {/* info */}
                      <div className="space-y-2">
                        <div className="w-28 h-3 rounded bg-white/10" />

                        <div className="w-16 h-2 rounded bg-white/5" />
                      </div>
                    </div>

                    <div className="w-14 h-5 rounded-full bg-white/10" />
                  </div>
                ))
              ) : members?.length > 0 ? (
                members.map((m, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-200 px-3 py-3"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* avatar */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                        {avatarText(
                          m.firstname + " " + m.lastname || m.user_id,
                        )}
                      </div>

                      {/* info */}
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          {m.user_id === userId
                            ? "You"
                            : `${m.firstname} ${m.lastname}`}
                        </p>

                        <p className="text-[11px] text-gray-500 truncate">
                          {m.email || m.user_id}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {m.role && (
                        <div
                          className={`px-2 py-1 rounded-full text-[10px] border ${
                            m.role === "owner"
                              ? "bg-amber-500/10 text-amber-300 border-amber-400/10"
                              : m.role === "admin"
                                ? "bg-indigo-500/10 text-indigo-300 border-indigo-400/10"
                                : "bg-white/[0.04] text-gray-400 border-white/10"
                          }`}
                        >
                          {m.role}
                        </div>
                      )}

                      <div className="w-2 h-2 rounded-full bg-green-400 opacity-70 group-hover:opacity-100 transition" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-10 px-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 text-2xl">
                    👥
                  </div>

                  <p className="text-sm text-gray-300">No members yet</p>

                  <p className="text-xs text-gray-500 mt-1">
                    Invite people using the share link
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspaceShareDrawer;

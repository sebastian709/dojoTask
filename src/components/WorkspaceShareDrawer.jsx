import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAuthSession } from "aws-amplify/auth";

import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";
import { getWorkspaceMembers } from "../features/workspace/services/workspaceApi";

import {
  Rocket,
  Copy,
  Check,
  Users,
  Shield,
  Crown,
  LogOut,
  ChevronRight,
} from "lucide-react";

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
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-[#0b1220]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl shadow-black/40 transform transition-all duration-500 ease-out flex flex-col z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 px-5 py-4 border-b border-white/10 bg-[#0b1220]/80 backdrop-blur-xl flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold tracking-tight">
              Share Workspace
            </h2>

            <p className="text-[11px] text-gray-500 mt-0.5">
              Invite and manage workspace members
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
          >
            ✕
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-6 relative z-10">
            {/* WORKSPACE INFO */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.08] via-white/[0.04] to-transparent p-5">
              {/* glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)]" />

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white font-semibold text-lg tracking-tight">
                    {workspace?.workspace_name || "Workspace"}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {workspace?.description ||
                      "Collaborate with your team in real-time."}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Rocket size={22} />
                </div>
              </div>
            </div>

            {/* SHARE LINK */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-white">Invite Link</p>

                <p className="text-[11px] text-gray-500 mt-1">
                  Share this link with your team
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  value={`${window.location.origin}/workspace/join/${workspace?.workspace_id}`}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-gray-300 text-xs outline-none"
                />

                <button
                  onClick={handleCopy}
                  className="px-4 py-3 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/10 text-white text-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2">
                    {copied ? (
                      <Check size={14} strokeWidth={2.5} />
                    ) : (
                      <Copy size={14} strokeWidth={2.5} />
                    )}

                    <span>{copied ? "Copied" : "Copy"}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* MEMBERS */}
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
              <div className="space-y-2">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 animate-pulse"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10" />

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
                      className="group relative overflow-hidden flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] hover:from-white/[0.06] hover:to-white/[0.03] transition-all duration-300 px-3 py-3 hover:scale-[1.01]"
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
                            <div className="flex items-center gap-1">
                              {m.role === "owner" ? (
                                <Crown size={10} className="text-amber-300" />
                              ) : m.role === "admin" ? (
                                <Shield size={10} className="text-indigo-300" />
                              ) : null}

                              <span>{m.role}</span>
                            </div>
                          </div>
                        )}

                        <div className="w-2 h-2 rounded-full bg-green-400 opacity-70 group-hover:opacity-100 transition" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-10 px-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                      <Users size={26} className="text-gray-400" />
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

        {/* FIXED BOTTOM ACTION */}
        <div className="p-5 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-xl">
          <button className="group relative overflow-hidden w-full rounded-3xl border border-red-500/10 bg-gradient-to-br from-red-500/[0.08] to-red-500/[0.02] hover:from-red-500/[0.12] hover:to-red-500/[0.05] transition-all duration-300 px-4 py-4">
            {/* glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.15),transparent_70%)]" />

            <div className="relative flex items-center justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                {/* ICON */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-red-500/20 blur-lg opacity-70 group-hover:opacity-100 transition" />

                  <div className="relative w-12 h-12 rounded-2xl bg-red-500/10 border border-red-400/10 flex items-center justify-center text-red-300 group-hover:scale-105 transition-transform duration-300">
                    <LogOut size={20} strokeWidth={2.2} />
                  </div>
                </div>

                {/* TEXT */}
                <div className="text-left">
                  <p className="text-sm font-medium text-white group-hover:text-red-100 transition">
                    Leave Workspace
                  </p>

                  <p className="text-[11px] text-red-200/50 mt-1">
                    You’ll lose access to boards and tasks
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2 text-red-300/60 group-hover:text-red-200 transition-all duration-300 group-hover:translate-x-1">
                <span className="text-[11px] font-medium">Leave</span>

                <ChevronRight size={18} strokeWidth={2.4} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkspaceShareDrawer;

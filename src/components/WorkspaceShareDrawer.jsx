import React, { useState } from "react";
import toast from "react-hot-toast";
import { createInvite } from "../features/workspace/services/workspaceApi";

const WorkspaceShareDrawer = ({ open, onClose, workspace }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    try {
      const link = `${window.location.origin}/workspace/${workspace?.workspace_id}`;

      await navigator.clipboard.writeText(link);

      setCopied(true);
      toast.success("Link copied!");

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Copy failed");
      console.log(err);
    }
  };

  const handleInvite = async () => {
    if (!email) return toast.error("Enter email first");

    try {
      setLoading(true);

      const res = await createInvite({
        workspace_id: workspace.workspace_id,
        email,
      });

      const inviteLink = `${window.location.origin}/invite/${res.invite_token}`;

      await navigator.clipboard.writeText(inviteLink);

      toast.success("Invite created & link copied!");
      setEmail("");
    } catch (err) {
      toast.error("Failed to create invite");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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

          {/* INVITE */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">
              Invite member (email)
            </label>

            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@email.com"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
              />

              <button
                onClick={handleInvite}
                disabled={loading}
                className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-xs disabled:opacity-50"
              >
                {loading ? "..." : "Invite"}
              </button>
            </div>
          </div>

          {/* SHARE LINK */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Share link</label>

            <div className="flex gap-2">
              <input
                value={`${window.location.origin}/workspace/${workspace?.workspace_id}`}
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
        </div>
      </div>
    </>
  );
};

export default WorkspaceShareDrawer;
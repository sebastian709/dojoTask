import React, { useEffect } from "react";
import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";
import { getWorkspaces } from "../features/workspace/services/workspaceApi";
import { useNavigate, useParams } from "react-router-dom";

import { LayoutDashboard, ChevronRight } from "lucide-react";

const SideBar = () => {
  const { workspaces, setWorkspaces } = useWorkspaceStore();
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWorkspaces();
      setWorkspaces(data);
    };

    fetchData();
  }, []);

  return (
    <aside className="w-60 bg-[#0b1220] border-r border-white/10 flex flex-col h-full relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_30%)] pointer-events-none" />

      {/* TOP */}
      <div className="relative p-3 border-b border-white/10">
        <button
          onClick={() => navigate("/dashboard")}
          className="group w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] px-3 py-2.5 transition-all duration-200 hover:border-white/15"
        >
          {/* LEFT */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* icon */}
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard
                size={16}
                strokeWidth={2.4}
                className="text-gray-300"
              />
            </div>

            {/* text */}
            <div className="text-left min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Dashboard
              </p>

              <p className="text-[10px] text-gray-500 truncate">
                Back to overview
              </p>
            </div>
          </div>

          {/* arrow */}
          <ChevronRight
            size={14}
            strokeWidth={2.5}
            className="text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
          />
        </button>
      </div>

      {/* WORKSPACES */}
      <div className="relative flex-1 overflow-y-auto custom-scrollbar p-3">
        {/* label */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
            Workspaces
          </h2>

          <div className="px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/10 text-[10px] text-gray-400">
            {workspaces.length}
          </div>
        </div>

        {/* workspace list */}
        <nav className="space-y-1.5">
          {workspaces.map((ws) => {
            const active = workspaceId === ws.workspace_id;

            return (
              <button
                key={ws.workspace_id}
                onClick={() => navigate(`/workspace/${ws.workspace_id}`)}
                className={`group relative overflow-hidden w-full flex items-center justify-between rounded-2xl px-2.5 py-2 transition-all duration-200 text-left border ${
                  active
                    ? "border-white/10 bg-white/[0.06] text-white"
                    : "border-transparent hover:bg-white/[0.04] text-gray-300"
                }`}
              >
                {/* LEFT */}
                <div className="relative flex items-center gap-2.5 min-w-0">
                  {/* icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      active
                        ? "bg-white/[0.08] border border-white/10 text-white"
                        : "bg-white/[0.03] border border-white/10 text-gray-300"
                    }`}
                  >
                    {ws.workspace_name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* name */}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {ws.workspace_name}
                    </p>

                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        active ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Workspace
                    </p>
                  </div>
                </div>

                {/* active dot / arrow */}
                {active ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/80 flex-shrink-0" />
                ) : (
                  <ChevronRight
                    size={13}
                    strokeWidth={2.5}
                    className="text-gray-700 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;

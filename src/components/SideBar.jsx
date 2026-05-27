import React, { useEffect, useState } from "react";

import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";

import { getWorkspaces } from "../features/workspace/services/workspaceApi";

import { useNavigate, useParams } from "react-router-dom";

import {
  LayoutDashboard,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const SideBar = () => {
  const { workspaces, setWorkspaces } = useWorkspaceStore();

  const navigate = useNavigate();

  const { workspaceId } = useParams();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWorkspaces();

      setWorkspaces(data);
    };

    fetchData();
  }, []);

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          lg:hidden

          fixed left-4 bottom-4 z-[120]

          w-14 h-14 rounded-2xl

          bg-[#111827]

          border border-white/10

          shadow-2xl

          flex items-center justify-center

          text-white
        "
      >
        <PanelLeftOpen size={20} />
      </button>

      {/* MOBILE BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            lg:hidden

            fixed inset-0 z-[110]

            bg-black/60
            backdrop-blur-sm
          "
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:relative

          top-0 left-0 z-[111]

          h-[100dvh]
          lg:h-full

          w-[85vw]
          max-w-[320px]
          lg:w-72

          bg-[#0b1220]

          border-r border-white/10

          flex flex-col

          overflow-hidden

          transition-transform duration-300

          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* AMBIENT GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_30%)] pointer-events-none" />

        {/* TOP */}
        <div className="relative p-4 border-b border-white/10">
          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-white font-semibold">Workspaces</h2>

            <button
              onClick={() => setOpen(false)}
              className="
                w-10 h-10 rounded-2xl

                border border-white/10

                bg-white/[0.03]

                flex items-center justify-center

                text-white
              "
            >
              <PanelLeftClose size={18} />
            </button>
          </div>

          {/* DASHBOARD BUTTON */}
          <button
            onClick={() => {
              navigate("/dashboard");

              setOpen(false);
            }}
            className="
              group

              w-full

              flex items-center justify-between

              rounded-3xl

              border border-white/10

              bg-white/[0.03]

              hover:bg-white/[0.05]

              px-3 py-3

              transition-all duration-200

              hover:border-white/15
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0">
              {/* ICON */}
              <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
                <LayoutDashboard
                  size={18}
                  strokeWidth={2.4}
                  className="text-gray-300"
                />
              </div>

              {/* TEXT */}
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Dashboard
                </p>

                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  Back to overview
                </p>
              </div>
            </div>

            {/* ARROW */}
            <ChevronRight
              size={15}
              strokeWidth={2.5}
              className="
                text-gray-600

                group-hover:text-white

                group-hover:translate-x-0.5

                transition-all duration-200

                flex-shrink-0
              "
            />
          </button>
        </div>

        {/* WORKSPACES */}
        <div className="relative flex-1 overflow-y-auto custom-scrollbar p-4">
          {/* LABEL */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
              Workspaces
            </h2>

            <div className="px-2 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-gray-400">
              {workspaces.length}
            </div>
          </div>

          {/* WORKSPACE LIST */}
          <nav className="space-y-2">
            {workspaces.map((ws) => {
              const active = workspaceId === ws.workspace_id;

              return (
                <button
                  key={ws.workspace_id}
                  onClick={() => {
                    navigate(`/workspace/${ws.workspace_id}`);

                    setOpen(false);
                  }}
                  className={`
                      group relative overflow-hidden

                      w-full

                      flex items-center justify-between

                      rounded-3xl

                      px-3 py-3

                      transition-all duration-200

                      text-left

                      border

                      ${
                        active
                          ? `
                            border-white/10
                            bg-white/[0.06]
                            text-white
                          `
                          : `
                            border-transparent
                            hover:bg-white/[0.04]
                            text-gray-300
                          `
                      }
                    `}
                >
                  {/* LEFT */}
                  <div className="relative flex items-center gap-3 min-w-0">
                    {/* ICON */}
                    <div
                      className={`
                          w-10 h-10 rounded-2xl

                          flex items-center justify-center

                          text-sm font-semibold

                          flex-shrink-0

                          ${
                            active
                              ? `
                                bg-white/[0.08]
                                border border-white/10
                                text-white
                              `
                              : `
                                bg-white/[0.03]
                                border border-white/10
                                text-gray-300
                              `
                          }
                        `}
                    >
                      {ws.workspace_name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* NAME */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {ws.workspace_name}
                      </p>

                      <p
                        className={`
                            text-[11px]

                            truncate mt-0.5

                            ${active ? "text-gray-400" : "text-gray-500"}
                          `}
                      >
                        Workspace
                      </p>
                    </div>
                  </div>

                  {/* ACTIVE / ARROW */}
                  {active ? (
                    <div className="w-2 h-2 rounded-full bg-indigo-400/80 flex-shrink-0" />
                  ) : (
                    <ChevronRight
                      size={14}
                      strokeWidth={2.5}
                      className="
                          text-gray-700

                          group-hover:text-white

                          group-hover:translate-x-0.5

                          transition-all duration-200

                          flex-shrink-0
                        "
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SideBar;

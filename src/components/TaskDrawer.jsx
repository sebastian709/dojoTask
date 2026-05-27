import {
  X,
  MessageSquare,
  Clock3,
  User2,
  AlignLeft,
} from "lucide-react";

import { useState } from "react";

export default function TaskDrawer({
  open,
  onClose,
  task,
}) {
  const [activeTab, setActiveTab] =
    useState("comments");

  if (!open || !task) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6">

      {/* MODAL */}
      <div
        className="
          w-full h-[100dvh]
          md:h-[92vh]
          md:max-w-7xl

          overflow-hidden

          rounded-t-[32px]
          md:rounded-3xl

          border border-white/10
          bg-[#0b1120]

          shadow-[0_20px_80px_rgba(0,0,0,0.65)]

          flex flex-col
          lg:flex-row
        "
      >

        {/* ================= LEFT SIDE ================= */}
        <div
          className="
            flex-1 overflow-y-auto

            lg:border-r lg:border-white/10
          "
        >

          {/* COVER */}
          <div
            className="
              relative
              h-[180px]
              sm:h-[220px]
              md:h-[260px]

              overflow-hidden
              border-b border-white/10
            "
          >

            {/* IMAGE */}
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop"
              alt="cover"
              className="w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/30 to-transparent" />

          </div>

          {/* CONTENT */}
          <div
            className="
              p-5
              sm:p-6
              md:p-8

              space-y-8
            "
          >

            {/* TITLE */}
            <div>

              <div className="flex items-start gap-4">

                {/* ICON */}
                <div className="w-14 h-14 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 flex items-center justify-center flex-shrink-0">

                  <AlignLeft
                    size={22}
                    className="text-indigo-300"
                  />

                </div>

                {/* TITLE */}
                <div className="flex-1">

                  <h2
                    className="
                      text-2xl
                      md:text-3xl

                      font-semibold
                      text-white
                      leading-tight
                    "
                  >
                    {task.title}
                  </h2>

                  <p className="text-sm text-gray-400 mt-3">

                    in list{" "}

                    <span className="text-indigo-300">
                      Development
                    </span>

                  </p>

                </div>

              </div>
            </div>

            {/* DESCRIPTION */}
            <div>

              <div className="flex items-center gap-2 mb-4">

                <AlignLeft
                  size={16}
                  className="text-gray-400"
                />

                <h3 className="text-sm font-medium text-white">
                  Description
                </h3>

              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 min-h-[220px] text-sm leading-relaxed text-gray-300 whitespace-pre-wrap shadow-inner">

                {task.description ||
                  "No description added yet."}

              </div>
            </div>

            {/* ATTACHMENTS */}
            <div>

              <div className="flex items-center gap-2 mb-4">

                <MessageSquare
                  size={16}
                  className="text-gray-400"
                />

                <h3 className="text-sm font-medium text-white">
                  Attachments
                </h3>

              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2

                  gap-4
                "
              >

                {Array.from({
                  length: 4,
                }).map((_, i) => (

                  <div
                    key={i}
                    className="
                      group relative overflow-hidden
                      rounded-3xl border border-white/10
                      bg-white/[0.03]
                      aspect-video
                      cursor-pointer
                    "
                  >

                    {/* IMAGE */}
                    <img
                      src={`https://picsum.photos/600/400?random=${i}`}
                      alt="attachment"
                      className="
                        w-full h-full object-cover
                        transition duration-300
                        group-hover:scale-105
                      "
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* LABEL */}
                    <div className="absolute bottom-3 left-3 right-3">

                      <p className="text-sm font-medium text-white truncate">
                        Attachment-{i + 1}.png
                      </p>

                      <p className="text-[11px] text-gray-300 mt-1">
                        2.4 MB
                      </p>

                    </div>

                  </div>

                ))}

              </div>
            </div>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div
          className="
            w-full
            lg:w-[420px]

            h-[45vh]
            lg:h-auto

            flex-shrink-0

            border-t border-white/10
            lg:border-t-0

            bg-[#0f172a]/80
            backdrop-blur-xl

            flex flex-col
          "
        >

          {/* HEADER */}
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 border-b border-white/10">

            <div className="flex items-start justify-between gap-4 mb-5">

              {/* TABS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">

                {/* COMMENTS TAB */}
                <button
                  onClick={() =>
                    setActiveTab(
                      "comments"
                    )
                  }
                  className={`
                    px-4 py-2 rounded-2xl
                    text-sm font-medium
                    whitespace-nowrap
                    transition

                    ${
                      activeTab ===
                      "comments"
                        ? `
                          bg-indigo-500
                          text-white
                          shadow-lg shadow-indigo-500/20
                        `
                        : `
                          bg-white/[0.03]
                          border border-white/10
                          text-gray-400
                          hover:bg-white/[0.05]
                          hover:text-white
                        `
                    }
                  `}
                >
                  Comments
                </button>

                {/* ACTIVITY TAB */}
                <button
                  onClick={() =>
                    setActiveTab(
                      "activity"
                    )
                  }
                  className={`
                    px-4 py-2 rounded-2xl
                    text-sm font-medium
                    whitespace-nowrap
                    transition

                    ${
                      activeTab ===
                      "activity"
                        ? `
                          bg-indigo-500
                          text-white
                          shadow-lg shadow-indigo-500/20
                        `
                        : `
                          bg-white/[0.03]
                          border border-white/10
                          text-gray-400
                          hover:bg-white/[0.05]
                          hover:text-white
                        `
                    }
                  `}
                >
                  Activity
                </button>

              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="
                  w-11 h-11 rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  hover:bg-white/[0.06]
                  transition
                  flex items-center justify-center
                  text-white flex-shrink-0
                "
              >

                <X size={18} />

              </button>

            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">

            {/* ================= COMMENTS ================= */}
            {activeTab ===
              "comments" && (
              <>
                {Array.from({
                  length: 20,
                }).map((_, i) => (

                  <div
                    key={i}
                    className="flex gap-3"
                  >

                    {/* AVATAR */}
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 flex-shrink-0">

                      <User2
                        size={16}
                      />

                    </div>

                    {/* CARD */}
                    <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.03] p-4">

                      {/* HEADER */}
                      <div className="flex items-center justify-between gap-3 mb-2">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-sm font-medium text-white">
                            Sebastian
                          </span>

                          <span className="text-xs text-gray-500">
                            commented
                          </span>

                        </div>

                        <span className="text-[11px] text-gray-600">
                          {i + 1}m ago
                        </span>

                      </div>

                      {/* MESSAGE */}
                      <p className="text-sm leading-relaxed text-gray-300">
                        This task needs more polishing before release.
                        We should probably optimize websocket realtime
                        updates and improve the board syncing logic.
                      </p>

                    </div>
                  </div>

                ))}
              </>
            )}

            {/* ================= ACTIVITY ================= */}
            {activeTab ===
              "activity" && (
              <>
                {Array.from({
                  length: 20,
                }).map((_, i) => (

                  <div
                    key={i}
                    className="flex gap-3"
                  >

                    {/* ICON */}
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 flex-shrink-0">

                      <Clock3
                        size={16}
                      />

                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.03] p-4">

                      <div className="flex items-center justify-between gap-3 mb-2">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-sm font-medium text-white">
                            Sebastian
                          </span>

                          <span className="text-xs text-gray-500">
                            moved task to
                          </span>

                          <span className="px-2 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
                            In Progress
                          </span>

                        </div>

                        <span className="text-[11px] text-gray-600">
                          {i + 1}h ago
                        </span>

                      </div>

                      <p className="text-sm text-gray-400">
                        Updated board structure and synchronized realtime websocket events.
                      </p>

                    </div>
                  </div>

                ))}
              </>
            )}

          </div>

          {/* INPUT */}
          {activeTab ===
            "comments" && (
            <div className="border-t border-white/10 p-4 sm:p-5">

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3">

                <textarea
                  placeholder="Write a comment..."
                  className="
                    w-full resize-none bg-transparent
                    outline-none text-sm text-white
                    placeholder:text-gray-500
                    min-h-[90px]
                  "
                />

                <div className="flex justify-end mt-3">

                  <button
                    className="
                      px-4 py-2 rounded-2xl
                      bg-indigo-500
                      hover:bg-indigo-400
                      transition
                      text-sm font-medium text-white
                    "
                  >
                    Send
                  </button>

                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
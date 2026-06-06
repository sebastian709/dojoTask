import { X, MessageSquare, Clock3, AlignLeft, Archive } from "lucide-react";

import { useState, useEffect } from "react";
import {
  updateTaskDetails,
  logTaskActivity,
  archiveTask as archiveTaskApi,
} from "../features/board/services/boardApi";

import TaskAttachments from "./task/TaskAttachments";

import TaskComments from "./task/TaskComments";

import TaskActivity from "./task/TaskActivity";

import TaskProperties from "./task/TaskProperties";

import TaskAssignees from "./task/TaskAssignee";

import TaskCover from "./task/TaskCover";

export default function TaskDrawer({ open, onClose, task, workspaceId }) {
  const [activeTab, setActiveTab] = useState(
    window.innerWidth >= 1024 ? "comments" : null,
  );

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [originalTitle, setOriginalTitle] = useState("");

  const [originalDescription, setOriginalDescription] = useState("");

  const [loaded, setLoaded] = useState(false);

  const isMobile = window.innerWidth < 1024;

  const toggleTab = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const archiveTask = async () => {
    try {
      await archiveTaskApi(task.task_id);

      setShowArchiveConfirm(false);

      await logTaskActivity(task.task_id, "Archived task");

      window.broadcastBoard?.(task.board_id);

      onClose?.();
    } catch (err) {
      console.log("ARCHIVE ERROR", err);
    }
  };

  useEffect(() => {
    if (!task) return;

    setTitle(task.title || "");

    setDescription(task.description || "");

    setOriginalTitle(task.title || "");

    setOriginalDescription(task.description || "");

    setLoaded(true);
  }, [task]);

  useEffect(() => {
    if (!loaded) return;

    if (!task?.task_id) return;

    const timeout = setTimeout(async () => {
      try {
        // walang changes
        if (title === originalTitle && description === originalDescription) {
          return;
        }

        console.log("AUTOSAVE", {
          title,
          description,
        });

        await updateTaskDetails({
          task_id: task.task_id,

          board_id: task.board_id,

          title,

          description,
        });

        // TITLE ACTIVITY
        if (title !== originalTitle) {
          console.log("ACTIVITY: TITLE UPDATED");

          await logTaskActivity(
            task.task_id,

            `Renamed task to "${title}"`,
          );

          setOriginalTitle(title);
        }

        // DESCRIPTION ACTIVITY
        if (description !== originalDescription) {
          console.log("ACTIVITY: DESCRIPTION UPDATED");

          await logTaskActivity(
            task.task_id,

            "Updated task description",
          );

          setOriginalDescription(description);
        }

        window.broadcastBoard?.(task.board_id);
      } catch (err) {
        console.log("AUTOSAVE ERROR", err);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [title, description, loaded, originalTitle, originalDescription]);

  if (!open || !task) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6">
        {/* MOBILE FLOATING BUTTONS */}
        <div className="lg:hidden fixed bottom-4 right-4 z-[1001] flex flex-col gap-3">
          <button
            onClick={() => toggleTab("comments")}
            className={`
            w-14 h-14 rounded-2xl
            flex items-center justify-center
            text-white transition-all

            ${
              activeTab === "comments"
                ? `
                  bg-indigo-500
                  shadow-2xl shadow-indigo-500/30
                `
                : `
                  bg-[#111827]
                  border border-white/10
                  shadow-2xl
                `
            }
          `}
          >
            <MessageSquare size={20} />
          </button>

          <button
            onClick={() => toggleTab("activity")}
            className={`
            w-14 h-14 rounded-2xl
            flex items-center justify-center
            text-white transition-all

            ${
              activeTab === "activity"
                ? `
                  bg-indigo-500
                  shadow-2xl shadow-indigo-500/30
                `
                : `
                  bg-[#111827]
                  border border-white/10
                  shadow-2xl
                `
            }
          `}
          >
            <Clock3 size={20} />
          </button>
        </div>

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

          relative
        "
        >
          {/* MOBILE CLOSE */}
          <button
            onClick={onClose}
            className="
            lg:hidden

            absolute top-4 right-4 z-[1002]

            w-11 h-11 rounded-2xl

            border border-white/10

            bg-[#111827]/80

            backdrop-blur-xl

            flex items-center justify-center

            text-white
          "
          >
            <X size={18} />
          </button>

          {/* LEFT SIDE */}
          <div
            className={`
            flex-1 overflow-y-auto

            lg:border-r lg:border-white/10

            ${activeTab && isMobile ? "hidden" : ""}
          `}
          >
            <TaskCover
              task={task}
              onRefresh={() => {
                window.broadcastBoard?.(task.board_id);
              }}
            />

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
                <div
                  className="
                  flex
                  items-start
                  gap-4
                "
                >
                  {/* ICON */}
                  <div
                    className="
                    w-12 h-12

                    rounded-2xl

                    border border-indigo-500/20

                    bg-gradient-to-br
                    from-indigo-500/20
                    to-indigo-500/5

                    flex items-center justify-center

                    flex-shrink-0
                  "
                  >
                    <AlignLeft
                      size={18}
                      className="
                      text-indigo-300
                    "
                    />
                  </div>

                  {/* CONTENT */}
                  <div
                    className="
                    flex-1
                    min-w-0
                  "
                  >
                    <div
                      className="
                      flex

                      items-start

                      justify-between

                      gap-4

                      mb-3
                    "
                    >
                      {/* LIST TITLE */}
                      <div
                        className="
                        inline-flex

                        items-center

                        px-4 py-2

                        rounded-2xl

                        bg-gradient-to-r
                        from-indigo-500/15
                        to-violet-500/15

                        border
                        border-indigo-500/20

                        backdrop-blur-sm
                      "
                      >
                        <span
                          className="
                          text-sm

                          font-bold

                          uppercase

                          tracking-wider

                          text-indigo-200
                        "
                        >
                          {task?.list_title || "Unknown"}
                        </span>
                      </div>

                      {/* ARCHIVE */}
                      <button
                        onClick={() => setShowArchiveConfirm(true)}
                        className="
                        flex-shrink-0

                        flex
                        items-center
                        gap-2

                        px-3 py-2

                        rounded-2xl

                        bg-red-500/10

                        border
                        border-red-500/20

                        text-red-300
                      "
                      >
                        <Archive size={15} />
                        <span>Archive</span>
                      </button>
                    </div>

                    {/* TITLE */}
                    <textarea
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      rows={2}
                      className="
                      w-full

                      bg-transparent

                      resize-none

                      outline-none

                      text-3xl

                      font-bold

                      tracking-tight

                      text-white

                      leading-tight
                    "
                    />
                  </div>
                </div>
              </div>

              <TaskProperties task={task} />

              {/* DESCRIPTION */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlignLeft size={16} className="text-gray-400" />

                  <h3 className="text-sm font-medium text-white">
                    Description
                  </h3>
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write task description..."
                  className="
                  w-full

                  rounded-3xl

                  border border-white/10

                  bg-white/[0.03]

                  p-6

                  min-h-[220px]

                  text-sm leading-relaxed

                  text-gray-300

                  resize-none

                  outline-none

                  placeholder:text-gray-500
                "
                />
              </div>

              <TaskAssignees task={task} workspaceId={workspaceId} />

              <TaskAttachments task={task} />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className={`
            ${activeTab ? "flex" : "hidden lg:flex"}

            lg:relative

            w-full
            lg:w-[420px]

            h-[100dvh]
            lg:h-auto

            flex-shrink-0

            border-t border-white/10
            lg:border-t-0

            bg-[#0f172a]/95
            lg:bg-[#0f172a]/80

            backdrop-blur-xl

            flex-col
          `}
          >
            {/* HEADER */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6 border-b border-white/10">
              <div className="hidden lg:flex items-start justify-between gap-4 mb-5">
                {/* TABS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => toggleTab("comments")}
                    className={`
                    px-4 py-2 rounded-2xl
                    text-sm font-medium
                    whitespace-nowrap
                    transition

                    ${
                      activeTab === "comments"
                        ? `
                          bg-indigo-500
                          text-white
                          shadow-lg shadow-indigo-500/20
                        `
                        : `
                          bg-white/[0.03]
                          border border-white/10
                          text-gray-400
                        `
                    }
                  `}
                  >
                    Comments
                  </button>

                  <button
                    onClick={() => toggleTab("activity")}
                    className={`
                    px-4 py-2 rounded-2xl
                    text-sm font-medium
                    whitespace-nowrap
                    transition

                    ${
                      activeTab === "activity"
                        ? `
                          bg-indigo-500
                          text-white
                          shadow-lg shadow-indigo-500/20
                        `
                        : `
                          bg-white/[0.03]
                          border border-white/10
                          text-gray-400
                        `
                    }
                  `}
                  >
                    Activity
                  </button>
                </div>

                {/* CLOSE */}
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
              {activeTab === "comments" && <TaskComments task={task} />}

              {activeTab === "activity" && <TaskActivity task={task} />}
            </div>
          </div>
        </div>
      </div>

      {showArchiveConfirm && (
        <div
          className="
      fixed inset-0 z-[999]

      flex items-center
      justify-center

      bg-black/70
      backdrop-blur-sm
    "
        >
          <div
            className="
        w-full
        max-w-md

        rounded-3xl

        border border-white/10

        bg-[#0F1117]

        p-6
      "
          >
            <h3
              className="
          text-lg
          font-semibold
          text-white
          mb-2
        "
            >
              Archive Task
            </h3>

            <p
              className="
          text-sm
          text-gray-400
          mb-6
        "
            >
              Are you sure you want to archive
              <span className="text-white font-medium"> "{task.title}"</span>?
            </p>

            <div
              className="
          flex justify-end gap-3
        "
            >
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="
            px-4 py-2

            rounded-2xl

            border border-white/10

            text-gray-300
          "
              >
                Cancel
              </button>

              <button
                onClick={archiveTask}
                className="
            px-4 py-2

            rounded-2xl

            bg-red-500

            text-white
          "
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

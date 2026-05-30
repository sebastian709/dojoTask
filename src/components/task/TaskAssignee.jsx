import { UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getTaskAssignees,
  getWorkspaceMembers,
  addTaskAssignee,
  removeTaskAssignee,
} from "../../features/board/services/boardApi";

export default function TaskAssignees({ task, workspaceId }) {
  const [assignees, setAssignees] = useState([]);

  const [members, setMembers] = useState([]);

  const [openPicker, setOpenPicker] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!task?.task_id) return;

    loadAssignees();
  }, [task?.task_id]);

  const loadAssignees = async () => {
    const data = await getTaskAssignees(task.task_id);

    setAssignees(data || []);
  };

  const handleOpenPicker = async () => {
    const data = await getWorkspaceMembers(workspaceId);

    const filtered = data.filter(
      (member) => !assignees.some((a) => a.user_id === member.user_id),
    );

    setMembers(filtered);

    setOpenPicker(true);
  };

  const handleAdd = async (userId) => {
    await addTaskAssignee(task.task_id, userId);

    await loadAssignees();

    setOpenPicker(false);

    window.broadcastBoard?.(task.board_id);
  };

  const handleRemove = async (userId) => {
    await removeTaskAssignee(task.task_id, userId);

    await loadAssignees();

    window.broadcastBoard?.(task.board_id);
  };

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstname} ${member.lastname}`.toLowerCase();

    const role = member.role?.toLowerCase() || "";

    const keyword = search.toLowerCase();

    return fullName.includes(keyword) || role.includes(keyword);
  });

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Assignees</h3>

          <span className="text-xs text-gray-500">
            {assignees.length} members
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {assignees.map((user) => {
            const initials = `${user.firstname?.[0] || ""}
                 ${user.lastname?.[0] || ""}`.replace(/\s/g, "");

            return (
              <div
                key={user.user_id}
                className="
                    flex items-center gap-2

                    px-3 py-2

                    rounded-2xl

                    border border-white/10

                    bg-white/[0.03]

                    hover:bg-white/[0.06]

                    transition
                  "
              >
                <div
                  className="
                      w-6 h-6

                      rounded-lg

                      bg-indigo-500

                      text-white

                      flex items-center justify-center

                      text-[10px]
                      font-semibold

                      flex-shrink-0
                    "
                >
                  {initials}
                </div>

                <span
                  className="
                      text-sm
                      text-white

                      whitespace-nowrap
                    "
                >
                  {user.firstname} {user.lastname}
                </span>

                <button
                  onClick={() => handleRemove(user.user_id)}
                  className="
                      text-gray-500

                      hover:text-red-400

                      transition
                    "
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}

          <button
            onClick={handleOpenPicker}
            className="
              flex items-center gap-2

              px-3 py-2

              rounded-2xl

              border border-dashed border-white/15

              bg-white/[0.02]

              text-gray-400

              hover:text-white
              hover:border-white/30
              hover:bg-white/[0.04]

              transition
            "
          >
            <UserPlus size={14} />

            <span className="text-sm whitespace-nowrap">Add Assignee</span>
          </button>
        </div>
      </div>

      {openPicker && (
        <div
          className="
      fixed inset-0
      z-[9999]

      bg-black/70
      backdrop-blur-sm

      flex items-center justify-center

      p-4
    "
          onClick={() => {
            setSearch("");
            setOpenPicker(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
        w-full
        max-w-lg

        overflow-hidden

        rounded-3xl

        border border-white/10

        bg-[#0f172a]

        shadow-[0_20px_80px_rgba(0,0,0,.45)]
      "
          >
            {/* HEADER */}
            <div
              className="
          px-6 py-5

          border-b
          border-white/10
        "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Add Assignee
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Select a workspace member to assign
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearch("");
                    setOpenPicker(false);
                  }}
                  className="
              w-9 h-9

              rounded-xl

              hover:bg-white/5

              text-gray-400
              hover:text-white

              transition

              flex items-center justify-center
            "
                >
                  ✕
                </button>
              </div>
            </div>

            {/* SEARCH */}
            <div
              className="
          p-4

          border-b
          border-white/10
        "
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="
            w-full

            px-4 py-3

            rounded-2xl

            bg-white/[0.04]

            border border-white/10

            text-white

            placeholder:text-gray-500

            outline-none

            focus:border-indigo-500/50

            focus:ring-2
            focus:ring-indigo-500/20
          "
              />
            </div>

            {/* MEMBERS */}
            <div
              className="
          p-4

          max-h-[450px]

          overflow-y-auto
        "
            >
              <div className="mb-3">
                <p className="text-xs text-gray-500">
                  {filteredMembers.length} available members
                </p>
              </div>

              {filteredMembers.length === 0 ? (
                <div
                  className="
              py-12

              text-center
            "
                >
                  <div
                    className="
                w-14 h-14

                mx-auto mb-4

                rounded-2xl

                bg-white/[0.04]

                flex items-center justify-center

                text-xl
              "
                  >
                    👤
                  </div>

                  <p className="text-gray-300">No members found</p>

                  <p className="text-xs text-gray-500 mt-2">
                    Try another search keyword
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMembers.map((member) => {
                    const initials = `${member.firstname?.[0] || ""}
                   ${member.lastname?.[0] || ""}`.replace(/\s/g, "");

                    return (
                      <button
                        key={member.user_id}
                        onClick={() => handleAdd(member.user_id)}
                        className="
                      w-full

                      flex items-center gap-3

                      px-4 py-3

                      rounded-2xl

                      border border-transparent

                      bg-white/[0.03]

                      hover:bg-white/[0.06]
                      hover:border-white/10

                      transition
                    "
                      >
                        {/* AVATAR */}
                        <div
                          className="
                        w-10 h-10

                        rounded-xl

                        bg-indigo-500

                        text-white

                        flex items-center justify-center

                        text-xs font-semibold
                      "
                        >
                          {initials}
                        </div>

                        {/* USER */}
                        <div className="flex-1 text-left">
                          <p className="text-white text-sm font-medium">
                            {member.firstname} {member.lastname}
                          </p>

                          <p className="text-xs text-gray-500 capitalize">
                            {member.role}
                          </p>
                        </div>

                        {/* ACTION */}
                        <div
                          className="
                        text-xs

                        text-indigo-300

                        font-medium
                      "
                        >
                          Assign
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

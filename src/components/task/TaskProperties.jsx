import { Calendar, Flag, Tag, X } from "lucide-react";

import { useState, useEffect } from "react";

import {
  getTaskDetails,
  updateTaskProperties,
  logTaskActivity,
} from "../../features/board/services/boardApi";

export default function TaskProperties({ task }) {
  const [dueDate, setDueDate] = useState("");

  const [priority, setPriority] = useState("");

  const [labels, setLabels] = useState([]);

  const [labelInput, setLabelInput] = useState("");

  useEffect(() => {
    if (!task?.task_id) return;

    loadTask();
  }, [task?.task_id]);

  const loadTask = async () => {
    const taskData = await getTaskDetails(task.task_id);

    if (!taskData) return;

    setDueDate(taskData.due_date || "");

    setPriority(taskData.priority || "");

    setLabels(Array.isArray(taskData.labels) ? taskData.labels : []);
  };

  const saveProperties = async (
    nextDueDate = dueDate,
    nextPriority = priority,
    nextLabels = labels,
  ) => {
    if (!task?.task_id) return;

    const previousDueDate = dueDate;

    const previousPriority = priority;

    const previousLabels = labels;

    await updateTaskProperties({
      task_id: task.task_id,

      due_date: nextDueDate,

      priority: nextPriority,

      labels: nextLabels,
    });

    // DUE DATE
    if (previousDueDate !== nextDueDate) {
      await logTaskActivity(
        task.task_id,

        nextDueDate ? `Changed due date to ${nextDueDate}` : "Removed due date",
      );
    }

    // PRIORITY
    if (previousPriority !== nextPriority) {
      await logTaskActivity(
        task.task_id,

        nextPriority
          ? `Changed priority to ${nextPriority}`
          : "Removed priority",
      );
    }

    // LABELS ADDED
    const addedLabels = nextLabels.filter(
      (label) => !previousLabels.includes(label),
    );

    for (const label of addedLabels) {
      await logTaskActivity(
        task.task_id,

        `Added label "${label}"`,
      );
    }

    // LABELS REMOVED
    const removedLabels = previousLabels.filter(
      (label) => !nextLabels.includes(label),
    );

    for (const label of removedLabels) {
      await logTaskActivity(
        task.task_id,

        `Removed label "${label}"`,
      );
    }

    await loadTask();

    window.broadcastBoard?.(task.board_id);
  };

  const addLabel = async () => {
    const value = labelInput.trim();

    if (!value) return;

    if (labels.includes(value)) return;

    const updated = [...labels, value];

    setLabels(updated);

    setLabelInput("");

    await saveProperties(dueDate, priority, updated);
  };

  const removeLabel = async (label) => {
    const updated = labels.filter((l) => l !== label);

    setLabels(updated);

    await saveProperties(dueDate, priority, updated);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-white mb-3">Properties</h3>

      <div className="flex flex-wrap gap-2">
        {/* DUE DATE */}
        <div
          className="
          flex items-center gap-2

          px-3 py-2

          rounded-2xl

          border border-white/10

          bg-white/[0.03]
        "
        >
          <Calendar
            size={14}
            className="
            text-red-300
          "
          />

          <input
            type="date"
            value={dueDate}
            onChange={async (e) => {
              const value = e.target.value;

              setDueDate(value);

              await saveProperties(value, priority, labels);
            }}
            className="
            bg-transparent

            text-white
            text-sm

            outline-none
          "
          />
        </div>

        {/* PRIORITY */}
        <div
          className="
          flex items-center gap-2

          px-3 py-2

          rounded-2xl

          border border-white/10

          bg-white/[0.03]
        "
        >
          <Flag
            size={14}
            className="
            text-red-300
          "
          />

          <select
            value={priority}
            onChange={async (e) => {
              const value = e.target.value;

              setPriority(value);

              await saveProperties(dueDate, value, labels);
            }}
            className="
            bg-transparent

            text-white
            text-sm

            outline-none
          "
          >
            <option
              value=""
              style={{
                background: "#111827",
              }}
            >
              Not Set
            </option>

            <option
              value="low"
              style={{
                background: "#111827",
              }}
            >
              Low
            </option>

            <option
              value="medium"
              style={{
                background: "#111827",
              }}
            >
              Medium
            </option>

            <option
              value="high"
              style={{
                background: "#111827",
              }}
            >
              High
            </option>

            <option
              value="urgent"
              style={{
                background: "#111827",
              }}
            >
              Urgent
            </option>
          </select>
        </div>

        {/* LABELS */}
        <div
          className="
          flex items-center gap-2

          px-3 py-2

          rounded-2xl

          border border-white/10

          bg-white/[0.03]
        "
        >
          <Tag
            size={14}
            className="
            text-indigo-300
          "
          />

          <div
            className="
    flex flex-wrap
    items-center
    gap-1
  "
          >
            {labels.length === 0 ? (
              <span className="text-gray-500 text-sm">No Labels</span>
            ) : (
              labels.map((label) => (
                <div
                  key={label}
                  className="
                    flex items-center gap-1

                    px-2 py-1

                    rounded-lg

                    border border-indigo-500/20

                    bg-indigo-500/10

                    text-indigo-300

                    text-xs
                    font-medium
                  "
                >
                  <span>{label}</span>

                  <button
                    onClick={() => removeLabel(label)}
                    className="
                      hover:text-red-300

                      transition
                    "
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ADD LABEL */}
        <div
          className="
          flex items-center gap-2

          px-3 py-2

          rounded-2xl

          border border-dashed border-white/10

          bg-white/[0.02]
        "
        >
          <input
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                addLabel();
              }
            }}
            placeholder="+ Label"
            className="
            w-[90px]

            bg-transparent

            text-white
            text-sm

            placeholder:text-gray-500

            outline-none
          "
          />
        </div>
      </div>
    </div>
  );
}

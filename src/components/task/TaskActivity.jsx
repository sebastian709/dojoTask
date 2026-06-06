import { Clock3 } from "lucide-react";

import { useEffect, useState } from "react";

import { getTaskActivity } from "../../features/board/services/boardApi";

export default function TaskActivity({ task }) {
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",

      hour: "numeric",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!task?.task_id) return;

    loadActivity();
  }, [task?.task_id]);

  const loadActivity = async () => {
    try {
      setLoading(true);

      const data = await getTaskActivity(task.task_id);

      setActivities(data || []);
    } catch (err) {
      console.log("LOAD ACTIVITY ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="
          text-center

          text-gray-500

          py-10
        "
      >
        Loading activity...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div
        className="
          rounded-3xl

          border
          border-dashed
          border-white/10

          bg-white/[0.02]

          p-8

          text-center

          text-gray-500
        "
      >
        No activity yet
      </div>
    );
  }

  return (
    <div
      className="
        space-y-4
      "
    >
      {activities.map((activity) => (
        <div
          key={activity.activity_id}
          className="
              flex gap-3
            "
        >
          <div
            className="
                w-10 h-10

                rounded-2xl

                bg-indigo-500/10

                border
                border-indigo-500/20

                flex
                items-center
                justify-center

                text-indigo-300

                flex-shrink-0
              "
          >
            <Clock3 size={16} />
          </div>

          <div
            className="
                flex-1

                rounded-3xl

                border
                border-white/10

                bg-white/[0.03]

                p-4
              "
          >
            <div
              className="
                flex

                flex-col

                sm:flex-row

                sm:items-center

                sm:justify-between

                gap-1

                mb-2
              "
            >
              <span
                className="
                    text-sm

                    font-medium

                    text-white
                  "
              >
                {activity.created_by}
              </span>

              <span
                className="
                  text-[11px]

                  text-gray-500

                  whitespace-nowrap

                  flex-shrink-0
                "
              >
                {formatDateTime(activity.created_at)}
              </span>
            </div>

            <p
              className="
                text-sm

                text-gray-300

                leading-relaxed

                break-all

                whitespace-pre-wrap
              "
            >
              {activity.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

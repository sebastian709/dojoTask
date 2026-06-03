import { User2, Send } from "lucide-react";

import { useEffect, useState } from "react";

import {
  getTaskComments,
  addTaskComment,
} from "../../features/board/services/boardApi";

export default function TaskComments({ task }) {
  const [comments, setComments] = useState([]);

  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!task?.task_id) return;

    loadComments();
  }, [task?.task_id]);

  const loadComments = async () => {
    try {
      const data = await getTaskComments(task.task_id);

      setComments(data || []);
    } catch (err) {
      console.log("LOAD COMMENTS ERROR", err);
    }
  };

  const sendComment = async () => {
    if (!task?.task_id) {
      console.log("TASK MISSING");

      return;
    }

    if (!message.trim()) return;

    try {
      setSending(true);

      await addTaskComment({
        task_id: task.task_id,

        message,
      });

      setMessage("");

      await loadComments();
    } catch (err) {
      console.log("SEND COMMENT ERROR", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="
    flex

    flex-col

    h-[600px]
  "
    >
      {/* EMPTY */}
      {comments.length === 0 && (
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
          No comments yet
        </div>
      )}

      {/* COMMENTS */}
      <div
        className="
          flex-1

          overflow-y-auto

          space-y-4

          pr-1
        "
      >
        {comments.map((comment) => (
          <div
            key={comment.thread_id}
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
              <User2 size={16} />
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

                      justify-between

                      items-center

                      mb-2
                    "
              >
                <div
                  className="
                        flex
                        gap-2
                      "
                >
                  <span
                    className="
                          text-sm

                          text-white

                          font-medium
                        "
                  >
                    {comment.created_by}
                  </span>
                </div>

                <span
                  className="
                        text-[11px]

                        text-gray-600
                      "
                >
                  {comment.created_at}
                </span>
              </div>

              <p
                className="
                      text-sm

                      text-gray-300

                      whitespace-pre-wrap
                    "
              >
                {comment.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div
        className="
            sticky

            bottom-0

            mt-4

            pt-4

          "
      >
        <div
          className="
            rounded-3xl

            border
            border-white/10

            bg-white/[0.03]

            p-3
          "
        >
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
            className="
              w-full

              resize-none

              bg-transparent

              outline-none

              text-sm

              text-white

             min-h-[60px]
              max-h-[180px]
            "
          />

          <div
            className="
              flex

              justify-end

              mt-3
            "
          >
            <button
              onClick={sendComment}
              disabled={sending}
              className="
                flex

                items-center

                gap-2

                px-5
                py-2

                rounded-2xl

                bg-indigo-500

                hover:bg-indigo-400

                disabled:opacity-50

                text-white
              "
            >
              <Send size={14} />

              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

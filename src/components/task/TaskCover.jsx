import { ImagePlus, Trash2, Loader2 } from "lucide-react";

import { useState, useEffect } from "react";

import {
  generateTaskCoverUploadUrl,
  saveTaskCover,
  removeTaskCover,
  uploadTaskCover,
  logTaskActivity
} from "../../features/board/services/boardApi";

export default function TaskCover({ task, onRefresh }) {
  const [coverUrl, setCoverUrl] = useState(task?.cover_url || "");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setCoverUrl(task?.cover_url || "");
  }, [task?.cover_url]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      // console.log(
      //   "UPLOAD START",
      //   file.name
      // );

      const data = await generateTaskCoverUploadUrl(task.task_id);

      // console.log(
      //   "SIGNED URL",
      //   data
      // );

      await uploadTaskCover(data.uploadUrl, file);

      await saveTaskCover(task.task_id, data.fileUrl);

      await logTaskActivity(
        task.task_id,

        `Updated cover image`,
      );

      // 🔥 instant update
      setCoverUrl(data.fileUrl);

      // console.log(
      //   "UPLOAD SUCCESS",
      //   data.fileUrl
      // );

      onRefresh?.();
    } catch (err) {
      console.error("UPLOAD COVER ERROR", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeTaskCover(task.task_id);

      await logTaskActivity(
        task.task_id,

        "Removed cover image",
      );

      // 🔥 instant remove
      setCoverUrl("");

      // console.log(
      //   "COVER REMOVED"
      // );

      onRefresh?.();
    } catch (err) {
      console.error("REMOVE COVER ERROR", err);
    }
  };

  if (!coverUrl) {
    return (
      <div
        className="
          rounded-3xl

          border
          border-dashed
          border-white/10

          bg-white/[0.02]

          p-10

          text-center
        "
      >
        <ImagePlus
          size={34}
          className="
            mx-auto

            text-gray-500

            mb-4
          "
        />

        <p
          className="
            text-white

            font-medium

            mb-1
          "
        >
          No Cover
        </p>

        <p
          className="
            text-sm

            text-gray-500

            mb-5
          "
        >
          Upload an image for this task
        </p>

        <label
          className="
            inline-flex

            items-center
            gap-2

            cursor-pointer

            px-4 py-2

            rounded-2xl

            bg-indigo-500

            hover:bg-indigo-600

            text-white
            text-sm

            transition
          "
        >
          {uploading ? (
            <Loader2
              size={16}
              className="
                animate-spin
              "
            />
          ) : (
            <ImagePlus size={16} />
          )}

          <span>{uploading ? "Uploading..." : "Add Cover"}</span>

          <input type="file" accept="image/*" hidden onChange={handleUpload} />
        </label>
      </div>
    );
  }

  return (
    <div
      className="
        relative

        overflow-hidden

        rounded-3xl

        border
        border-white/10
      "
    >
      <img
        src={coverUrl}
        alt="cover"
        className="
          w-full

          h-[240px]

          object-cover
        "
      />

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-t

          from-[#0b1120]
          via-transparent
          to-transparent
        "
      />

      <div
        className="
          absolute

          top-4
          right-4

          flex gap-2
        "
      >
        <label
          className="
            cursor-pointer

            px-3 py-2

            rounded-xl

            bg-black/60

            backdrop-blur-sm

            text-white

            text-xs

            hover:bg-black/80

            transition
          "
        >
          {uploading ? "Uploading..." : "Change Cover"}

          <input type="file" accept="image/*" hidden onChange={handleUpload} />
        </label>

        <button
          onClick={handleRemove}
          className="
            px-3 py-2

            rounded-xl

            bg-red-500/80

            hover:bg-red-500

            text-xs

            text-white

            transition
          "
        >
          Remove Cover
        </button>
      </div>
    </div>
  );
}

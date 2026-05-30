import {
  MessageSquare,
  Eye,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileArchive,
  Presentation,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";

import { useState, useEffect } from "react";

import {
  getTaskAttachments,
  generateAttachmentUploadUrl,
  saveAttachment,
  uploadAttachment,
  deleteAttachment,
} from "../../features/board/services/boardApi";

export default function TaskAttachments({ task }) {
  //
  // 🔥 COLLAPSE
  //
  const [showUploader, setShowUploader] = useState(false);

  const [attachments, setAttachments] = useState([]);

  const [uploading, setUploading] = useState(false);

  //
  // 🔥 FILE TYPE
  //
  const getFileType = (file) => {
    if (file.type.startsWith("image/")) {
      return "image";
    }

    if (file.type.startsWith("video/")) {
      return "video";
    }

    if (file.name.endsWith(".pdf")) {
      return "pdf";
    }

    if (file.name.match(/\.(doc|docx)$/i)) {
      return "word";
    }

    if (file.name.match(/\.(xls|xlsx)$/i)) {
      return "excel";
    }

    if (file.name.match(/\.(ppt|pptx)$/i)) {
      return "powerpoint";
    }

    return "file";
  };

  //
  // 🔥 ICONS
  //
  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <FileImage size={42} />;

      case "video":
        return <FileVideo size={42} />;

      case "pdf":
        return <FileText size={42} />;

      case "word":
        return <FileText size={42} />;

      case "excel":
        return <FileSpreadsheet size={42} />;

      case "powerpoint":
        return <Presentation size={42} />;

      default:
        return <FileArchive size={42} />;
    }
  };

  //
  // 🔥 COLORS
  //
  const getFileColor = (type) => {
    switch (type) {
      case "pdf":
        return "text-red-400";

      case "word":
        return "text-blue-400";

      case "excel":
        return "text-green-400";

      case "powerpoint":
        return "text-orange-400";

      case "video":
        return "text-pink-400";

      default:
        return "text-gray-300";
    }
  };

  useEffect(() => {
    if (!task?.task_id) return;

    loadAttachments();
  }, [task?.task_id]);

  const loadAttachments = async () => {
    try {
      const data = await getTaskAttachments(task.task_id);

      setAttachments(data || []);
    } catch (err) {
      console.log("LOAD ATTACHMENTS ERROR", err);
    }
  };

  const handleFiles = async (files) => {
    if (!files?.length) return;

    try {
      setUploading(true);

      await Promise.all(
        Array.from(files).map(async (file) => {
          const uploadData = await generateAttachmentUploadUrl({
            task_id: task.task_id,

            file_name: file.name,

            file_type: file.type,
          });

          await uploadAttachment(uploadData.uploadUrl, file);

          return saveAttachment({
            task_id: task.task_id,

            attachment_id: uploadData.attachment_id,

            file_name: file.name,

            file_size: file.size,

            file_type: file.type,

            file_url: uploadData.fileUrl,
          });
        }),
      );

      await loadAttachments();

      setShowUploader(false);
    } catch (err) {
      console.log("UPLOAD ATTACHMENT ERROR", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    await deleteAttachment(task.task_id, attachmentId);

    await loadAttachments();
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-gray-400" />

          <h3 className="text-sm font-medium text-white">Attachments</h3>
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="
            flex items-center gap-2

            px-4 py-2 rounded-2xl

            bg-white/[0.03]

            border border-white/10

            hover:bg-white/[0.06]

            transition

            text-sm text-white
          "
        >
          <Plus size={16} />

          {uploading ? "Uploading..." : "Add Files"}
          {showUploader ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* SLIDE DOWN */}
      <div
        className={`
          overflow-hidden
          transition-all duration-300

          ${
            showUploader
              ? `
                max-h-[1000px]
                opacity-100
                mb-5
              `
              : `
                max-h-0
                opacity-0
              `
          }
        `}
      >
        {/* DROPZONE */}
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();

            handleFiles(e.dataTransfer.files);
          }}
          className="
            relative

            flex flex-col items-center justify-center

            rounded-3xl

            border border-dashed border-white/10

            bg-white/[0.02]

            hover:bg-white/[0.04]

            transition-all duration-200

            p-10

            cursor-pointer

            text-center
          "
        >
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-300">
            <UploadCloud size={28} />
          </div>

          <h4 className="text-sm font-medium text-white">
            Drag & Drop files here
          </h4>

          <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
            Upload images, videos, PDF, Word, Excel, PowerPoint and more.
          </p>
        </label>
      </div>

      {/* SAVED ATTACHMENTS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2

          gap-4
        "
      >
        {attachments.length === 0 ? (
          <div
            className="
              col-span-full

              rounded-3xl

              border
              border-dashed
              border-white/10

              bg-white/[0.02]

              p-10

              text-center
            "
          >
            <UploadCloud
              size={32}
              className="
                mx-auto

                text-gray-500

                mb-3
              "
            />

            <p className="text-white font-medium">No Attachments</p>

            <p
              className="
                text-sm
                text-gray-500

                mt-1
              "
            >
              Upload files to this task
            </p>
          </div>
        ) : (
          attachments.map((file, i) => {
            const isMedia =
              file.file_type?.startsWith("image/") ||
              file.file_type?.startsWith("video/");

            return (
              <div
                key={file.attachment_id || i}
                className="
    group relative overflow-hidden

    rounded-3xl

    border border-white/10

    bg-white/[0.03]
  "
              >
                {isMedia ? (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={file.file_url}
                      alt={file.file_name}
                      className="
          w-full
          h-full
          object-cover

          transition
          duration-300

          group-hover:scale-105
        "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-sm font-medium text-white truncate">
                        {file.file_name}
                      </p>

                      <p className="text-[11px] text-gray-300 mt-1">
                        {(Number(file.file_size || 0) / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center gap-3 p-6">
                    <div
                      className={getFileColor(
                        getFileType({
                          type: file.file_type,
                          name: file.file_name,
                        }),
                      )}
                    >
                      {getFileIcon(
                        getFileType({
                          type: file.file_type,
                          name: file.file_name,
                        }),
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">
                        {file.file_name}
                      </p>

                      <p className="text-[11px] text-gray-500 mt-1">
                        {(Number(file.file_size || 0) / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className="
      absolute top-3 right-3 z-10

      flex items-center gap-2

      opacity-0
      group-hover:opacity-100

      transition-all duration-200
    "
                >
                  <button
                    className="
        w-10 h-10 rounded-2xl

        bg-black/40
        backdrop-blur-xl

        border border-white/10

        hover:bg-black/60

        flex items-center justify-center

        text-white
      "
                    onClick={() => window.open(file.file_url, "_blank")}
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    className="
        w-10 h-10 rounded-2xl

        bg-black/40
        backdrop-blur-xl

        border border-white/10

        hover:bg-black/60

        flex items-center justify-center

        text-white
      "
                    onClick={() => window.open(file.file_url, "_blank")}
                  >
                    <Download size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(file.attachment_id)}
                    className="
        w-10 h-10 rounded-2xl

        bg-red-500/80

        hover:bg-red-500

        text-white

        flex items-center justify-center
      "
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

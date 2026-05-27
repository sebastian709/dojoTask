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

import { useState } from "react";

export default function TaskAttachments() {
  //
  // 🔥 COLLAPSE
  //
  const [showUploader, setShowUploader] = useState(false);

  //
  // 🔥 PREVIEW FILES
  //
  const [previewFiles, setPreviewFiles] = useState([]);

  //
  // 🔥 MOCK DATA
  //
  const [attachments] = useState([
    {
      type: "image",
      name: "UI-Preview.png",
      size: "2.4 MB",
      url: "https://picsum.photos/600/400?random=1",
    },

    {
      type: "video",
      name: "Demo.mp4",
      size: "12.2 MB",
      url: "https://picsum.photos/600/400?random=2",
    },

    {
      type: "pdf",
      name: "Project-Brief.pdf",
      size: "1.1 MB",
    },

    {
      type: "word",
      name: "Requirements.docx",
      size: "900 KB",
    },
  ]);

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

  //
  // 🔥 HANDLE FILES
  //
  const handleFiles = (files) => {
    const mapped = Array.from(files).map((file) => ({
      file,

      name: file.name,

      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,

      type: getFileType(file),

      preview:
        file.type.startsWith("image/") || file.type.startsWith("video/")
          ? URL.createObjectURL(file)
          : null,
    }));

    setPreviewFiles((prev) => [...prev, ...mapped]);
  };

  //
  // 🔥 REMOVE PREVIEW
  //
  const removePreview = (index) => {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
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
          Add Files
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

        {/* PREVIEW FILES */}
        {previewFiles.length > 0 && (
          <div
            className="
      mt-5

      rounded-[28px]

      border border-indigo-500/20

      bg-indigo-500/[0.04]

      p-5
    "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Upload Queue
                </h4>

                <p className="text-xs text-indigo-300/70 mt-1">
                  Files waiting to upload
                </p>
              </div>

              <div className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                {previewFiles.length} pending
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previewFiles.map((file, index) => {
                const isMedia = file.type === "image" || file.type === "video";

                return (
                  <div
                    key={index}
                    className="
                relative overflow-hidden

                rounded-3xl

                border border-indigo-500/20

                bg-[#0f172a]
              "
                  >
                    {/* REMOVE */}
                    <button
                      onClick={() => removePreview(index)}
                      className="
                  absolute top-3 right-3 z-20

                  w-9 h-9 rounded-2xl

                  bg-black/40
                  backdrop-blur-xl

                  border border-white/10

                  flex items-center justify-center

                  text-white
                "
                    >
                      <X size={16} />
                    </button>

                    {isMedia ? (
                      <div className="relative aspect-video">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-sm font-medium text-white truncate">
                            {file.name}
                          </p>

                          <p className="text-[11px] text-gray-300 mt-1">
                            {file.size}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video flex flex-col items-center justify-center gap-3 p-6">
                        <div
                          className={`
                      ${getFileColor(file.type)}
                    `}
                        >
                          {getFileIcon(file.type)}
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium text-white truncate max-w-[200px]">
                            {file.name}
                          </p>

                          <p className="text-[11px] text-gray-500 mt-1">
                            {file.size}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
        {attachments.map((file, i) => {
          const isMedia = file.type === "image" || file.type === "video";

          return (
            <div
              key={i}
              className="
                  group relative overflow-hidden
                  rounded-3xl border border-white/10
                  bg-white/[0.03]
                "
            >
              {isMedia ? (
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="
                        w-full h-full object-cover
                        transition duration-300
                        group-hover:scale-105
                      "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>

                    <p className="text-[11px] text-gray-300 mt-1">
                      {file.size}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center gap-3 p-6">
                  <div
                    className={`
                        ${getFileColor(file.type)}
                      `}
                  >
                    {getFileIcon(file.type)}
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-white truncate max-w-[200px]">
                      {file.name}
                    </p>

                    <p className="text-[11px] text-gray-500 mt-1">
                      {file.size}
                    </p>
                  </div>
                </div>
              )}

              {/* FLOATING ACTIONS */}
              <div
                className="
                    absolute top-3 right-3 z-10

                    flex items-center gap-2

                    opacity-0
                    group-hover:opacity-100

                    transition-all duration-200
                  "
              >
                {/* VIEW */}
                <button
                  className="
                      w-10 h-10 rounded-2xl

                      bg-black/40
                      backdrop-blur-xl

                      border border-white/10

                      hover:bg-black/60

                      transition

                      flex items-center justify-center

                      text-white
                    "
                >
                  <Eye size={16} strokeWidth={2.2} />
                </button>

                {/* DOWNLOAD */}
                <button
                  className="
                      w-10 h-10 rounded-2xl

                      bg-black/40
                      backdrop-blur-xl

                      border border-white/10

                      hover:bg-black/60

                      transition

                      flex items-center justify-center

                      text-white
                    "
                >
                  <Download size={16} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

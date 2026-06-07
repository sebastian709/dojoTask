import { useState, useCallback, useEffect } from "react";

import Cropper from "react-easy-crop";

import { X, Upload, ZoomIn } from "lucide-react";

import getCroppedImg from "../../utils/cropImage";

import {
  generateProfileUploadUrl,
  uploadProfilePhoto,
  saveProfilePhoto,
} from "../../features/profile/services/profileApi";

export default function ProfilePhotoModal({ open, onClose, onSaved }) {
  const [imageSrc, setImageSrc] = useState(null);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [saving, setSaving] = useState(false);

  const [croppedBlob, setCroppedBlob] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },

    [],
  );

  const generatePreview = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) {
        return;
      }

      const blob = await getCroppedImg(
        imageSrc,

        croppedAreaPixels,
      );

      setCroppedBlob(blob);

      const preview = URL.createObjectURL(blob);

      setPreviewUrl(preview);
    } catch (err) {
      console.log("PREVIEW ERROR", err);
    }
  };

  const handleSave = async () => {
    try {
      if (!croppedBlob) {
        return;
      }

      setSaving(true);

      console.log("GENERATE URL...");

      const uploadData = await generateProfileUploadUrl();

      console.log("UPLOAD DATA", uploadData);

      const file = new File([croppedBlob], "profile.jpg", {
        type: "image/jpeg",
      });

      console.log("UPLOAD S3...");

      await uploadProfilePhoto(uploadData.uploadUrl, file);

      console.log("SAVE DB...");

      await saveProfilePhoto(uploadData.fileUrl);

      console.log("DONE");

      onSaved?.(uploadData.fileUrl);
    } catch (err) {
      console.error("PROFILE PHOTO ERROR", err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!imageSrc || !croppedAreaPixels) {
      return;
    }

    const timeout = setTimeout(generatePreview, 300);

    return () => clearTimeout(timeout);
  }, [imageSrc, croppedAreaPixels]);

  

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!open) {
      setImageSrc(null);

      setPreviewUrl("");

      setCroppedBlob(null);

      setZoom(1);

      setCrop({
        x: 0,
        y: 0,
      });
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
      fixed inset-0

      z-[9999]

      flex items-center
      justify-center

      bg-black/70
      

      backdrop-blur-sm
    "
    >
      <div
        className="
        w-full

        max-w-6xl

        mx-4

        rounded-3xl

        border border-white/10

        bg-[#0b1120]

        max-h-[100vh]

        overflow-hidden
      "
      >
        {/* HEADER */}
        <div
          className="
          flex items-center
          justify-between

          px-6 py-4

          border-b
          border-white/10
        "
        >
          <h2
            className="
            text-lg
            font-semibold
            text-white
          "
          >
            Change Profile Photo
          </h2>

          <button
            onClick={onClose}
            className="
            text-gray-400
            hover:text-white
          "
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div
          className="
    p-6

    grid

    md:grid-cols-[280px_1fr]

    gap-6

    h-[650px]
  "
        >
          {/* LEFT PANEL */}
          <div
            className="
      flex
      flex-col

      border
      border-white/10

      rounded-3xl

      bg-white/[0.02]

      p-5
    "
          >
            <label
              className="
        flex items-center
        justify-center
        gap-2

        cursor-pointer

        px-4 py-3

        rounded-2xl

        border
        border-white/10

        bg-white/[0.03]

        text-white

        mb-5
      "
            >
              <Upload size={16} />
              Choose Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </label>

            <div
              className="
        flex-1

        flex
        flex-col

        items-center
        justify-center

        gap-4
      "
            >
              <p
                className="
          text-sm
          text-gray-400
        "
              >
                Preview
              </p>

              <img
                src={previewUrl || imageSrc || "/default-avatar.png"}
                alt=""
                className="
          w-40 h-40

          rounded-full

          object-cover

          border-4
          border-indigo-500/20
        "
              />

              <div
                className="
          w-full
        "
              >
                <div
                  className="
            flex items-center
            gap-3
          "
                >
                  <ZoomIn
                    size={16}
                    className="
              text-gray-400
            "
                  />

                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="
              flex-1
            "
                  />
                </div>
              </div>
            </div>

            <div
              className="
        flex gap-3

        pt-5

        border-t
        border-white/10
      "
            >
              <button
                onClick={onClose}
                className="
          flex-1

          px-4 py-3

          rounded-2xl

          border
          border-white/10

          text-gray-300
        "
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={!croppedBlob || saving}
                className="
          flex-1

          px-4 py-3

          rounded-2xl

          bg-indigo-500

          text-white

          disabled:opacity-50
        "
              >
                {saving ? "Uploading..." : "Save Photo"}
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className="
      border
      border-white/10

      rounded-3xl

      overflow-hidden

      bg-black

      relative
    "
          >
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : (
              <div
                className="
          h-full

          flex
          items-center
          justify-center

          text-gray-500
        "
              >
                Choose an image to begin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

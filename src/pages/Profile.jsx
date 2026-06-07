import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../features/auth/store";

import { TIMEZONES } from "../constants/timezones";

import Select from "react-select";

import Swal from "sweetalert2";

import {
  getProfile,
  updateProfile,
  removeProfilePhoto,
} from "../features/profile/services/profileApi";

import ProfilePhotoModal from "../components/profile/ProfilePhotoModal";

export default function Profile() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);

  const updateUser = useAuthStore((s) => s.updateUser);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",

    username: "",
    email: "",

    phone_number: "",
    address: "",

    job_title: "",
    company: "",

    bio: "",

    timezone: "",

    image_url: "",

    created_at: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getProfile();

      setProfile({
        firstname: data.firstname || "",

        lastname: data.lastname || "",

        username: data.username || "",

        email: data.email || "",

        phone_number: data.phone_number || "",

        address: data.address || "",

        job_title: data.job_title || "",

        company: data.company || "",

        bio: data.bio || "",

        timezone: data.timezone || "",

        image_url: data.image_url || "",

        created_at: data.created_at || "",
      });
    } catch (err) {
      console.log("LOAD PROFILE ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfileChanges = async () => {
    try {
      setSaving(true);

      await updateProfile({
        firstname: profile.firstname,
        lastname: profile.lastname,
        phone_number: profile.phone_number,
        address: profile.address,
        bio: profile.bio,
        company: profile.company,
        job_title: profile.job_title,
        timezone: profile.timezone,
      });

      updateUser({
        firstname: profile.firstname,
        lastname: profile.lastname,
        phone_number: profile.phone_number,
        address: profile.address,
        bio: profile.bio,
        company: profile.company,
        job_title: profile.job_title,
        timezone: profile.timezone,
      });
    } catch (err) {
      console.log("SAVE PROFILE ERROR", err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key, value) => {
    setProfile((prev) => ({
      ...prev,

      [key]: value,
    }));
  };

  const removePhoto = async () => {
    const result = await Swal.fire({
      title: "Remove Profile Photo?",

      text: "Your current profile picture will be removed.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Remove",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#ef4444",

      background: "#0b1120",

      color: "#ffffff",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await removeProfilePhoto();

      setProfile((prev) => ({
        ...prev,
        image_url: "",
      }));

      updateUser({
        image_url: "",
      });

      await Swal.fire({
        title: "Removed",

        text: "Profile photo removed successfully.",

        icon: "success",

        timer: 1500,

        showConfirmButton: false,

        background: "#0b1120",

        color: "#ffffff",
      });
    } catch (err) {
      console.log("REMOVE PHOTO ERROR", err);

      Swal.fire({
        title: "Error",

        text: "Failed to remove profile photo.",

        icon: "error",

        background: "#0b1120",

        color: "#ffffff",
      });
    }
  };

  if (loading) {
    return (
      <div
        className="
          min-h-screen

          bg-[#0b1120]

          flex
          items-center
          justify-center

          text-white
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen

        bg-[#0b1120]

        p-6
      "
    >
      <div
        className="
          max-w-5xl

          mx-auto

          space-y-6
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <button
            onClick={() => navigate(-1)}
            className="
              w-11 h-11

              rounded-2xl

              border border-white/10

              bg-white/[0.03]

              text-white

              flex
              items-center
              justify-center
            "
          >
            <ArrowLeft size={18} />
          </button>

          <h1
            className="
              text-3xl

              font-bold

              text-white
            "
          >
            Profile
          </h1>
        </div>

        <div
          className="
    grid
    lg:grid-cols-[350px_1fr]
    gap-6
  "
        >
          {/* LEFT PANEL */}

          <div
            className="
      rounded-3xl
      border border-white/10
      bg-white/[0.03]
      p-6

      flex
      flex-col
    "
          >
            <div
              className="
        flex
        flex-col
        items-center
        text-center
      "
            >
              {/* AVATAR */}

              <div
                className="
          w-32 h-32

          rounded-full

          overflow-hidden

          border-4
          border-indigo-500/20

          flex
          items-center
          justify-center

          bg-gradient-to-br
          from-indigo-500
          to-violet-600
        "
              >
                {profile.image_url ? (
                  <img
                    src={profile.image_url}
                    alt=""
                    className="
              w-full
              h-full
              object-cover
            "
                  />
                ) : (
                  <span
                    className="
              text-4xl
              font-bold
              text-white
            "
                  >
                    {(
                      `${profile.firstname?.[0] || ""}${profile.lastname?.[0] || ""}` ||
                      profile.username?.[0] ||
                      "U"
                    ).toUpperCase()}
                  </span>
                )}
              </div>

              <h2
                className="
          mt-4
          text-2xl
          font-bold
          text-white
        "
              >
                {profile.firstname} {profile.lastname}
              </h2>

              <p className="text-gray-400">{profile.email}</p>

              {/* ACTIONS */}

              <div
                className="
          mt-4

          flex
          gap-2

          w-full
        "
              >
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="
            flex-1

            px-4 py-2

            rounded-2xl

            bg-indigo-500

            text-white
          "
                >
                  Change Photo
                </button>

                {profile.image_url && (
                  <button
                    onClick={removePhoto}
                    className="
              flex-1

              px-4 py-2

              rounded-2xl

              border
              border-red-500/20

              bg-red-500/10

              text-red-300
            "
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* BIO */}

            <div className="mt-6">
              <h3
                className="
                text-white
                font-semibold
                mb-3
                "
              >
                Bio
              </h3>

              <textarea
                value={profile.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={4}
                placeholder="Write something about yourself..."
                className="
                    w-full

                    rounded-2xl

                    border border-white/10

                    bg-[#111827]

                    p-4

                    text-white

                    resize-none
        "
              />
            </div>

            {/* SAVE */}

            <button
              onClick={saveProfileChanges}
              disabled={saving}
              className="
                    mt-6

                    w-full

                    px-6 py-3

                    rounded-2xl

                    bg-indigo-500

                    text-white

                    font-medium
                "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* RIGHT PANEL */}

          <div
            className="
            space-y-6
            "
          >
            {/* PERSONAL INFO */}

            <div
              className="
                    rounded-3xl

                    border border-white/10

                    bg-white/[0.03]

                    p-6
                "
            >
              <h3
                className="
                text-white
                font-semibold
                mb-4
                "
              >
                Personal Information
              </h3>

              <div
                className="
                    grid
                    md:grid-cols-2
                    gap-4
                    "
              >
                <input
                  value={profile.firstname}
                  onChange={(e) => updateField("firstname", e.target.value)}
                  placeholder="Firstname"
                  className="input"
                />

                <input
                  value={profile.lastname}
                  onChange={(e) => updateField("lastname", e.target.value)}
                  placeholder="Lastname"
                  className="input"
                />

                <input
                  value={profile.email}
                  disabled
                  className="input opacity-50"
                />

                <input
                  value={profile.phone_number}
                  onChange={(e) => updateField("phone_number", e.target.value)}
                  placeholder="Phone Number"
                  className="input"
                />

                <input
                  value={profile.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Address"
                  className="input"
                />

                <Select
                  options={TIMEZONES}
                  isSearchable
                  placeholder="Search timezone..."
                  value={
                    TIMEZONES.find((tz) => tz.value === profile.timezone) ||
                    null
                  }
                  onChange={(selected) =>
                    updateField("timezone", selected?.value || "")
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#111827",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "1rem",
                      minHeight: "52px",
                      boxShadow: "none",
                    }),

                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#111827",
                      borderRadius: "1rem",
                      overflow: "hidden",
                      zIndex: 9999,
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? "rgba(99,102,241,.2)"
                        : "#111827",
                      color: "#fff",
                      cursor: "pointer",
                    }),

                    singleValue: (base) => ({
                      ...base,
                      color: "#fff",
                    }),

                    input: (base) => ({
                      ...base,
                      color: "#fff",
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: "#9ca3af",
                    }),

                    menuList: (base) => ({
                      ...base,
                      maxHeight: 250,
                    }),
                  }}
                />
              </div>
            </div>

            {/* PROFESSIONAL */}

            <div
              className="
                    rounded-3xl

                    border border-white/10

                    bg-white/[0.03]

                    p-6
                "
            >
              <h3
                className="
                text-white
                font-semibold
                mb-4
                "
              >
                Professional Information
              </h3>

              <div
                className="
                grid
                md:grid-cols-2
                gap-4
                "
              >
                <input
                  value={profile.job_title}
                  onChange={(e) => updateField("job_title", e.target.value)}
                  placeholder="Job Title"
                  className="input"
                />

                <input
                  value={profile.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  placeholder="Company"
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        <ProfilePhotoModal
          open={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          onSaved={(imageUrl) => {
            setProfile((prev) => ({
              ...prev,
              image_url: imageUrl,
            }));

            updateUser({
              image_url: imageUrl,
            });

            setShowPhotoModal(false);
          }}
        />
      </div>
    </div>
  );
}

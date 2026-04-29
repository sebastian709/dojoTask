import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";

const WorkspaceCard = ({
  workspaceId,
  workspaceName,
  shortDesc,
  ownerName,
  role,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const isOwner = role === "owner";

  return (
    <div
      onClick={() => navigate(`/workspace/${workspaceId}`)}
      className="group relative p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] hover:from-[#111827] hover:to-[#020617] cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
    >
      {/* GLOW EFFECT */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* ICON / AVATAR */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
            {workspaceName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white leading-tight truncate max-w-[140px]">
              {workspaceName}
            </h3>
            <p className="text-[10px] text-gray-400">
              {isOwner ? "Your workspace" : "Shared with you"}
            </p>
          </div>
        </div>

        {/* BADGE */}
        <span
          className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
            isOwner
              ? "bg-green-500/20 text-green-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {isOwner ? "Owner" : "Shared"}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-4">
        {shortDesc || "No description"}
      </p>

      {/* OWNER INFO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
            {(isOwner ? "Y" : ownerName?.charAt(0) || "U").toUpperCase()}
          </div>

          <span className="text-[11px] text-gray-300">
            {isOwner ? "You" : ownerName || "Unknown"}
          </span>
        </div>

        {/* ACTION */}
        <span className="text-[11px] text-indigo-400 opacity-0 group-hover:opacity-100 transition">
          Open →
        </span>
      </div>
    </div>
  );
};

export default WorkspaceCard;

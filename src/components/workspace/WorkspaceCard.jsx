import { useNavigate } from "react-router-dom";

const WorkspaceCard = (props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/workspace/${props.workspaceId}`)}
      className="group relative p-3 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10"
    >
      {/* TOP ACCENT */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition"></div>

      {/* IMAGE */}
      <div className="h-12 bg-gradient-to-br from-indigo-500/80 to-purple-500/80 rounded-lg mb-2"></div>

      {/* TITLE */}
      <h3 className="font-semibold text-sm text-white truncate">
        {props.workspaceName}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
        {props.shortDesc}
      </p>

      {/* FOOTER */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-gray-500">Workspace</span>

        <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition">
          Open →
        </span>
      </div>
    </div>
  );
};

export default WorkspaceCard;

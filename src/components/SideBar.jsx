import React, { useEffect } from "react";
import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";
import { getWorkspaces } from "../features/workspace/services/workspaceApi";
import { useNavigate, useParams } from "react-router-dom";

const SideBar = () => {
  const { workspaces, setWorkspaces } = useWorkspaceStore();
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWorkspaces();
      setWorkspaces(data);
    };

    fetchData();
  }, []);

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-white/10 p-4 flex flex-col h-full">

      <h2 className="text-gray-400 text-sm mb-3">
        Workspaces
      </h2>

      <nav className="space-y-2">

        {workspaces.map((ws) => (
          <div
            key={ws.workspace_id}
            onClick={() =>
              navigate(`/workspace/${ws.workspace_id}`)
            }
            className={`p-2 rounded-lg cursor-pointer transition ${
              workspaceId === ws.workspace_id
                ? "bg-indigo-500 text-white"
                : "hover:bg-white/10 text-gray-300"
            }`}
          >
            {ws.workspace_name}
          </div>
        ))}

      </nav>

    </aside>
  );
};

export default SideBar;
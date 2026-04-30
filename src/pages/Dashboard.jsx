import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import { getWorkspaces } from "../features/workspace/services/workspaceApi";
import { useWorkspaceStore } from "../features/workspace/store/workspaceStore";

export default function Dashboard() {
  const { workspaces, setWorkspaces } = useWorkspaceStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkspaces();
        setWorkspaces(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-white">
      <NavBar />

      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Workspaces</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="relative">
              <span className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin block"></span>
            </div>

            <p className="text-sm text-gray-300 animate-pulse">
              Loading your workspace...
            </p>
          </div>
        ) : workspaces.length === 0 ? (
          /* 🔥 EMPTY STATE */
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="text-6xl mb-4">📂</div>

            <h3 className="text-xl font-semibold text-white">
              No workspaces yet
            </h3>

            <p className="text-gray-400 mt-2 max-w-md">
              You haven’t created any workspace yet. Start by clicking the{" "}
              <span className="text-indigo-400">Create</span> button above.
            </p>

            {/* <button
              onClick={() => setShowModal(true)}
              className="mt-5 bg-indigo-500 px-5 py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              Create Workspace
            </button> */}
          </div>
        ) : (
          /* 🔥 WORKSPACE GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {workspaces.map((ws) => (
              <WorkspaceCard
                key={ws.workspace_id}
                workspaceId={ws.workspace_id}
                workspaceName={ws.workspace_name}
                shortDesc={ws.description}
                ownerName={ws.owner_fullname}
                role={ws.role}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

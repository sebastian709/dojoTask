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
          <div className="w-full">
            {/* HEADER SKELETON */}
            <div className="flex items-center justify-between mb-6 animate-pulse">
              <div>
                <div className="h-7 w-52 rounded-lg bg-white/10 mb-2" />

                <div className="h-3 w-32 rounded bg-white/5" />
              </div>

              <div className="h-10 w-32 rounded-xl bg-white/10" />
            </div>

            {/* WORKSPACE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5"
                >
                  {/* shimmer */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

                  {/* title */}
                  <div className="h-5 w-40 rounded-lg bg-white/10 mb-4" />

                  {/* desc */}
                  <div className="space-y-2 mb-6">
                    <div className="h-3 w-full rounded bg-white/5" />

                    <div className="h-3 w-5/6 rounded bg-white/5" />
                  </div>

                  {/* footer */}
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 rounded bg-white/10" />

                    <div className="h-8 w-8 rounded-lg bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
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

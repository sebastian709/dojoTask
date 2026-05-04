import { create } from "zustand";

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  members: [],

  setWorkspaces: (data) => set({ workspaces: data }),
  setMembers: (data) => set({ members: data }),

  addWorkspace: (ws) =>
    set((state) => ({
      workspaces: [ws, ...state.workspaces],
    })),

  getWorkspaceById: (id) => {
    return get().workspaces.find(
      (ws) => ws.workspace_id === id
    );
  },
}));
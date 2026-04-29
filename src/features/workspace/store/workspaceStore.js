import { create } from "zustand";

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],

  setWorkspaces: (data) => set({ workspaces: data }),

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
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = import.meta.env.VITE_API_BASE;

/* =========================
   GET WORKSPACES
========================= */
export const getWorkspaces = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const res = await axios.get(
    `${API_BASE}/workspace/getWorkspaces`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
};

/* =========================
   CREATE WORKSPACE
========================= */
export const createWorkspace = async (payload) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const res = await axios.post(
    `${API_BASE}/workspace/createWorkspace`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
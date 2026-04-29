import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = import.meta.env.VITE_API_BASE;

// 🔥 create invite (returns token)
export const createInvite = async (workspaceId) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const res = await axios.post(
    `${API_BASE}/workspace/createInvite`,
    { workspace_id: workspaceId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data; // { invite_token }
};

// 🔥 validate invite
export const getInvite = async (inviteToken) => {
  const res = await axios.get(
    `${API_BASE}/workspace/getInvite/${inviteToken}`
  );

  return res.data; // workspace info
};

// 🔥 join workspace
export const acceptInvite = async (inviteToken) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const res = await axios.post(
    `${API_BASE}/workspace/acceptInvite`,
    { invite_token: inviteToken },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
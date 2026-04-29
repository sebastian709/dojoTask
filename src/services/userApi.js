import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = import.meta.env.VITE_API_BASE;


const normalizeUser = (data) => {
  return {
    username: data?.username || data?.Username || "",
    firstname:
      data?.firstname ||
      data?.given_name ||
      data?.UserAttributes?.find((a) => a.Name === "given_name")?.Value ||
      "",
    lastname:
      data?.lastname ||
      data?.family_name ||
      data?.UserAttributes?.find((a) => a.Name === "family_name")?.Value ||
      "",
    email:
      data?.email ||
      data?.UserAttributes?.find((a) => a.Name === "email")?.Value ||
      "",
  };
};

// CHECK USER
export const checkUser = async (username) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const res = await axios.get(`${API_BASE}/user/checkUser`, {
    params: { username },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return normalizeUser(res.data);
};

// CREATE PROFILE
export const createProfile = async (payload) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const res = await axios.post(
    `${API_BASE}/user/createProfile`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return normalizeUser(res.data);
};
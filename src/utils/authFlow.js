import { checkUser } from "../services/userApi";

export const handlePostLoginFlow = async ({
  email,
  navigate,
  redirectTo,
  flow,
  setUser,
}) => {
  const profile = await checkUser(email);

  setUser({
    username: email,
    ...profile,
  });

  const isJoinFlow =
    flow === "join" || redirectTo?.includes("/workspace/join/");

  // 🔥 HARD GATE (NO ESCAPE)
  if (profile?.is_no_data === 1) {
    navigate("/create-profile", {
      state: {
        username: email,
        redirectTo,
        flow,
      },
      replace: true,
    });
    return;
  }

  // 🔥 ONLY AFTER PROFILE EXISTS
  if (isJoinFlow) {
    navigate(redirectTo, { replace: true });
    return;
  }

  navigate("/dashboard", { replace: true });
};
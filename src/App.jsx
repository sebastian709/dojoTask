import { useEffect } from "react";

import { fetchAuthSession } from "aws-amplify/auth";

import { useWorkspaceStore } from "./features/workspace/store/workspaceStore";

import "./services/awsConfig";

import AppRoutes from "./app/routes";

import { Hub } from "aws-amplify/utils";

function App() {
  useEffect(() => {
    let ws;

    const connectWS = async () => {
      try {
        const session = await fetchAuthSession();

        const userId = session?.tokens?.idToken?.payload?.sub;

        if (!userId) {
          return;
        }

        //
        // 🔥 CLOSE OLD WS
        //
        if (ws) {
          ws.close();
        }

        //
        // 🔥 CONNECT
        //
        ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?user_id=${userId}`);

        window.dojoWS = ws;

        ws.onopen = () => {
          console.log("WS CONNECTED");
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "PRESENCE_UPDATE") {
            useWorkspaceStore.setState((state) => ({
              members: state.members.map((m) =>
                m.user_id === data.user_id
                  ? {
                      ...m,

                      status: data.status,

                      last_seen: data.last_seen,
                    }
                  : m,
              ),
            }));
          }
        };
      } catch (err) {
        console.log("WS INIT ERROR", err);
      }
    };

    //
    // 🔥 INITIAL
    //
    connectWS();

    //
    // 🔥 AUTH LISTENER
    //
    const listener = Hub.listen("auth", ({ payload }) => {
      //
      // LOGIN
      //
      if (payload.event === "signedIn") {
        console.log("SIGNED IN");

        connectWS();
      }

      //
      // LOGOUT
      //
      if (payload.event === "signedOut") {
        console.log("SIGNED OUT");

        ws?.close();
      }
    });

    return () => {
      listener();

      ws?.close();
    };
  }, []);

  return <AppRoutes />;
}

export default App;

import { useEffect } from "react";

import { fetchAuthSession } from "aws-amplify/auth";

import { useWorkspaceStore } from "./features/workspace/store/workspaceStore";

import "./services/awsConfig";

import AppRoutes from "./app/routes";

function App() {
  useEffect(() => {
    let ws;

    const connectWS = async () => {
      try {
        //
        // 🔥 GET SESSION
        //
        const session = await fetchAuthSession();

        //
        // 🔥 USER ID
        //
        const userId = session?.tokens?.idToken?.payload?.sub;

        //
        // ❌ NOT LOGGED IN
        //
        if (!userId) {
          return;
        }

        //
        // 🔥 CONNECT WS
        //
        ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?user_id=${userId}`);

        //
        // 🔥 GLOBAL
        //
        window.dojoWS = ws;

        //
        // 🔥 MESSAGE
        //
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            //
            // PRESENCE
            //
            if (data.type === "PRESENCE_UPDATE") {
              const store = useWorkspaceStore.getState();

              if (store.members.length > 0) {
                const updated = store.members.map((m) =>
                  m.user_id === data.user_id
                    ? {
                        ...m,

                        status: data.status,

                        last_seen: data.last_seen,
                      }
                    : m,
                );

                store.setMembers(updated);
              }
            }
          } catch (err) {
            console.log("WS MESSAGE ERROR", err);
          }
        };

        ws.onopen = () => {
          console.log("WS CONNECTED");
        };

        ws.onclose = () => {
          console.log("WS CLOSED");
        };

        ws.onerror = (err) => {
          console.log("WS ERROR", err);
        };
      } catch (err) {
        //
        // ❌ IGNORE
        //
        console.log("WS SKIPPED");
      }
    };

    connectWS();
  }, []);

  return <AppRoutes />;
}

export default App;

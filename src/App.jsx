import { useEffect } from "react";

import { fetchAuthSession } from "aws-amplify/auth";

import { useWorkspaceStore } from "./features/workspace/store/workspaceStore";

import "./services/awsConfig";

import AppRoutes from "./app/routes";

import { Hub } from "aws-amplify/utils";

import { Analytics } from "@vercel/analytics/react";

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

        window.broadcastBoard = (boardId) => {
          if (!window.dojoWS || window.dojoWS.readyState !== 1) {
            return;
          }

          window.dojoWS.send(
            JSON.stringify({
              action: "broadcastBoard",

              board_id: boardId,
            }),
          );
        };

        ws.onopen = () => {
          // console.log("WS CONNECTED");
        };

        ws.onmessage = (event) => {
          if (!event.data) {
            return;
          }

          let data = null;

          try {
            data = JSON.parse(event.data);
          } catch (err) {
            // console.log("INVALID WS JSON", event.data);

            return;
          }

          // console.log("WS MESSAGE:", data);

          //
          // 🔥 PRESENCE UPDATE
          //
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

          //
          // 🔥 BOARD UPDATE
          //
          if (data.type === "BOARD_UPDATED") {
            window.dispatchEvent(
              new CustomEvent("dojo-board-update", {
                detail: data,
              }),
            );
          }
        };

        ws.onclose = () => {
          // console.log("WS CLOSED");
        };

        ws.onerror = (err) => {
          // console.log("WS ERROR", err);
        };
      } catch (err) {
        // console.log("WS INIT ERROR", err);
      }
    };

    //
    // 🔥 INITIAL
    //
    connectWS();

    //
    // 🔥 CLOSE WS ON TAB CLOSE
    //
    const handleClose = () => {
      ws?.close();
    };

    window.addEventListener("beforeunload", handleClose);

    //
    // 🔥 AUTH LISTENER
    //
    const listener = Hub.listen("auth", ({ payload }) => {
      //
      // LOGIN
      //
      if (payload.event === "signedIn") {
        // console.log("SIGNED IN");

        connectWS();
      }

      //
      // LOGOUT
      //
      if (payload.event === "signedOut") {
        // console.log("SIGNED OUT");

        ws?.close();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handleClose);

      listener();

      ws?.close();
    };
  }, []);

  return (
    <>
      <AppRoutes />
      <Analytics />
    </>
  );
}

export default App;

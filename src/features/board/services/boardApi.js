import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = import.meta.env.VITE_API_BASE;


export const getBoard = async (boardId, workspaceId) => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();

        const res = await axios.post(
            `${API_BASE}/board/crud`,
            {
                action: "GET",
                board_id: boardId,
                workspace_id: workspaceId,
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            },
        );

        return res.data;
    } catch (err) {
        console.log("BOARD FETCH ERROR:", err);
    }
};
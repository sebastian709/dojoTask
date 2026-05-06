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

export const createList = async (
  boardId,
  title
) => {
  try {
    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res = await axios.post(
      `${API_BASE}/board/crud`,
      {
        action: "CREATE_LIST",
        board_id: boardId,
        title,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type":
            "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(
      "CREATE LIST ERROR:",
      err
    );
  }
};

export const createTask = async (
  listId,
  title
) => {
  try {
    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res = await axios.post(
      `${API_BASE}/board/crud`,
      {
        action: "CREATE_TASK",
        list_id: listId,
        title,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type":
            "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(
      "CREATE TASK ERROR:",
      err
    );
  }
};

export const getBoardFull = async (
  boardId
) => {
  try {
    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res = await axios.post(
      `${API_BASE}/board/crud`,
      {
        action: "GET_BOARD_FULL",
        board_id: boardId,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type":
            "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(
      "GET FULL BOARD ERROR:",
      err
    );
  }
};

export const moveTask = async (
  taskId,
  destinationListId
) => {
  try {
    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res = await axios.post(
      `${API_BASE}/board/crud`,
      {
        action: "MOVE_TASK",
        task_id: taskId,
        destination_list_id:
          destinationListId,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type":
            "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(
      "MOVE TASK ERROR:",
      err
    );
  }
};

export const updateList = async (
  boardId,
  listId,
  title
) => {
  try {
    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res = await axios.post(
      `${API_BASE}/board/crud`,
      {
        action: "UPDATE_LIST",

        board_id: boardId,

        list_id: listId,

        title,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type":
            "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(
      "UPDATE LIST ERROR:",
      err
    );
  }
};

export const deleteList = async (
  listId
) => {
  try {
    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res = await axios.post(
      `${API_BASE}/board/crud`,
      {
        action: "DELETE_LIST",

        list_id: listId,
      },
      {
        headers: {
          Authorization: token,

          "Content-Type":
            "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(
      "DELETE LIST ERROR:",
      err
    );

    throw err;
  }
};
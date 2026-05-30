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

export const reorderTask = async (
  taskId,
  orderIndex
) => {
  try {
    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res = await axios.post(
      `${API_BASE}/board/crud`,
      {
        action: "REORDER_TASK",

        task_id: taskId,

        order_index: orderIndex,
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
      "REORDER TASK ERROR:",
      err
    );
  }
};

export const reorderListTasks =
  async (boardId, tasks) => {
    try {
      const session =
        await fetchAuthSession();

      const token =
        session.tokens?.accessToken?.toString();

      const res = await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "REORDER_LIST_TASKS",
          board_id: boardId,
          tasks,
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
        "REORDER TASKS ERROR:",
        err
      );
    }
  };


export const getTask =
  async (taskId) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "GET_TASK",

          task_id:
            taskId,
        },
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

    return res.data.task;
  };

export const updateTask =
  async (task) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "UPDATE_TASK",

          ...task,
        },
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

    return res.data;
  };

export const getTaskThreads =
  async (taskId) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "GET_TASK_THREADS",

          task_id:
            taskId,
        },
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

    return res.data.threads;
  };

export const createTaskThread =
  async (
    taskId,
    message
  ) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "CREATE_TASK_THREAD",

          task_id:
            taskId,

          message,
        },
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

    return res.data.thread;
  };

export const updateTaskDetails =
  async ({
    task_id,
    title,
    description,
  }) => {

    try {

      const session =
        await fetchAuthSession();

      const token =
        session.tokens?.accessToken?.toString();

      const res =
        await axios.post(
          `${API_BASE}/board/crud`,
          {
            action:
              "UPDATE_TASK_DETAILS",

            task_id,

            title,

            description,
          },
          {
            headers: {
              Authorization:
                token,

              "Content-Type":
                "application/json",
            },
          }
        );

      return res.data;

    } catch (err) {

      console.log(
        "UPDATE TASK ERROR:",
        err
      );
    }
  };

export const getTaskAssignees =
  async (taskId) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "GET_TASK_ASSIGNEES",

          task_id:
            taskId,
        },
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

    return res.data.assignees;
  };

export const addTaskAssignee =
  async (
    taskId,
    userId
  ) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    await axios.post(
      `${API_BASE}/board/crud`,
      {
        action:
          "ADD_TASK_ASSIGNEE",

        task_id:
          taskId,

        user_id:
          userId,
      },
      {
        headers: {
          Authorization:
            token,
        },
      }
    );
  };

export const removeTaskAssignee =
  async (
    taskId,
    userId
  ) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    await axios.post(
      `${API_BASE}/board/crud`,
      {
        action:
          "REMOVE_TASK_ASSIGNEE",

        task_id:
          taskId,

        user_id:
          userId,
      },
      {
        headers: {
          Authorization:
            token,
        },
      }
    );
  };

export const getWorkspaceMembers =
  async (
    workspaceId
  ) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "GET_WORKSPACE_MEMBERS",

          workspace_id:
            workspaceId,
        },
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

    return res.data.members;
  };

export const updateTaskProperties =
  async ({
    task_id,
    due_date,
    priority,
    labels,
  }) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    await axios.post(
      `${API_BASE}/board/crud`,
      {
        action:
          "UPDATE_TASK_PROPERTIES",

        task_id,

        due_date,

        priority,

        labels,
      },
      {
        headers: {
          Authorization:
            token,
        },
      }
    );
  };

export const getTaskDetails =
  async (taskId) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "GET_TASK_DETAILS",

          task_id:
            taskId,
        },
        {
          headers: {
            Authorization:
              token,
            "Content-Type":
              "application/json",
          },
        }
      );

    return res.data.task;
  };
export const generateTaskCoverUploadUrl =
  async (taskId) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "GENERATE_TASK_COVER_UPLOAD_URL",

          task_id:
            taskId,
        },
        {
          headers: {
            Authorization:
              token,
            "Content-Type":
              "application/json",
          },
        }
      );

    return res.data;
  };

export const saveTaskCover =
  async (
    taskId,
    coverUrl
  ) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "SAVE_TASK_COVER",

          task_id:
            taskId,

          cover_url:
            coverUrl,
        },
        {
          headers: {
            Authorization:
              token,
            "Content-Type":
              "application/json",
          },
        }
      );

    return res.data;
  };

export const removeTaskCover =
  async (taskId) => {

    const session =
      await fetchAuthSession();

    const token =
      session.tokens?.accessToken?.toString();

    const res =
      await axios.post(
        `${API_BASE}/board/crud`,
        {
          action:
            "REMOVE_TASK_COVER",

          task_id:
            taskId,
        },
        {
          headers: {
            Authorization:
              token,
            "Content-Type":
              "application/json",
          },
        }
      );

    return res.data;
  };

export const uploadTaskCover =
  async (
    uploadUrl,
    file
  ) => {

    await axios.put(
      uploadUrl,
      file,
      {
        headers: {
          "Content-Type":
            file.type,
        },
      }
    );
  };
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  getBoard,
  getBoardFull,
  createList,
  createTask,
  moveTask,
  updateList,
  deleteList,
  reorderTask,
  reorderListTasks,
} from "../features/board/services/boardApi";
import WorkspaceShareDrawer from "../components/WorkspaceShareDrawer";

import {
  Trash2,
  ChevronRight,
  LoaderCircle,
  LayoutDashboard,
  Share2,
  ArrowLeft,
} from "lucide-react";

import NavBar from "../components/NavBar";

export default function BoardPage() {
  const { boardId, workspaceId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);

  const [lists, setLists] = useState([]);

  const [openMenu, setOpenMenu] = useState(null);

  const [addingTask, setAddingTask] = useState({
    listId: null,
    text: "",
  });

  const [editingList, setEditingList] = useState({
    id: null,
    text: "",
  });

  const menuRef = useRef(null);

  const [loadingListId, setLoadingListId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [shareOpen, setShareOpen] = useState(false);

  // ================= FETCH BOARD =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const boardData = await getBoard(boardId, workspaceId);

        setBoard(boardData);

        const fullBoard = await getBoardFull(boardId);

        setLists(fullBoard || []);
      } catch (err) {
        console.log("BOARD LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boardId, workspaceId]);

  useEffect(() => {
    const refreshBoard = async (e) => {
      if (e.detail.board_id !== boardId) {
        return;
      }
      console.log("BOARD EVENT RECEIVED:", e.detail);
      const fullBoard = await getBoardFull(boardId);

      setLists(fullBoard || []);
    };

    window.addEventListener("dojo-board-update", refreshBoard);

    return () => {
      window.removeEventListener("dojo-board-update", refreshBoard);
    };
  }, [boardId]);

  // ================= CLICK OUTSIDE MENU =================
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ================= LIST =================
  const addList = async () => {
    try {
      const newList = await createList(boardId, "New List");

      setLists((prev) => [
        ...prev,
        {
          ...newList,
          tasks: [],
        },
      ]);
    } catch (err) {
      console.log("ADD LIST ERROR:", err);
    }
  };

  const startEditList = (list) => {
    setEditingList({
      id: list.list_id,
      text: list.title,
    });
  };

  const saveListTitle = async () => {
    if (!editingList.text.trim()) {
      setEditingList({
        id: null,
        text: "",
      });

      return;
    }

    // optimistic UI
    setLists((prev) =>
      prev.map((l) =>
        l.list_id === editingList.id
          ? {
              ...l,
              title: editingList.text,
            }
          : l,
      ),
    );

    try {
      await updateList(boardId, editingList.id, editingList.text);
    } catch (err) {
      console.log("UPDATE LIST ERROR:", err);
    }

    setEditingList({
      id: null,
      text: "",
    });
  };

  // ================= TASK =================
  const startAddingTask = (listId) => {
    setAddingTask({ listId, title: "" });
  };

  const saveTask = async () => {
    if (!addingTask.text.trim()) {
      setAddingTask({
        listId: null,
        text: "",
      });

      return;
    }

    try {
      const newTask = await createTask(addingTask.listId, addingTask.text);

      setLists((prev) =>
        prev.map((list) =>
          list.list_id === addingTask.listId
            ? {
                ...list,
                tasks: [...list.tasks, newTask],
              }
            : list,
        ),
      );

      setAddingTask({
        listId: null,
        text: "",
      });
    } catch (err) {
      console.log("SAVE TASK ERROR:", err);
    }
  };

  const toggleMenu = (listId) => {
    setOpenMenu(openMenu === listId ? null : listId);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    // source list
    const sourceList = lists.find((l) => l.list_id === source.droppableId);

    // target list
    const destList = lists.find((l) => l.list_id === destination.droppableId);

    if (!sourceList || !destList) return;

    const dragged = sourceList.tasks[source.index];

    // ================= SAME LIST =================
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceList.tasks);

      newTasks.splice(source.index, 1);

      newTasks.splice(destination.index, 0, dragged);

      setLists((prev) =>
        prev.map((l) =>
          l.list_id === sourceList.list_id
            ? {
                ...l,
                tasks: newTasks,
              }
            : l,
        ),
      );

      try {
        await Promise.all(
          newTasks.map((task, index) => reorderTask(task.task_id, index)),
        );
      } catch (err) {
        console.log("REORDER SAVE ERROR:", err);
      }
      return;
    }

    // ================= MOVE ACROSS LISTS =================

    const sourceTasks = Array.from(sourceList.tasks);

    sourceTasks.splice(source.index, 1);

    const destTasks = Array.from(destList.tasks);

    destTasks.splice(destination.index, 0, dragged);

    // optimistic UI update
    setLists((prev) =>
      prev.map((l) => {
        if (l.list_id === sourceList.list_id) {
          return {
            ...l,
            tasks: sourceTasks,
          };
        }

        if (l.list_id === destList.list_id) {
          return {
            ...l,
            tasks: destTasks,
          };
        }

        return l;
      }),
    );

    const reorderedTasks = [
      ...sourceTasks.map((task, index) => ({
        task_id: task.task_id,
        list_id: sourceList.list_id,
        order_index: index,
      })),

      ...destTasks.map((task, index) => ({
        task_id: task.task_id,
        list_id: destList.list_id,
        order_index: index,
      })),
    ];

    // save to DB
    try {
      await reorderListTasks(boardId, reorderedTasks);
      console.log(window.dojoWS);

      console.log(window.dojoWS?.readyState);
      if (window.dojoWS && window.dojoWS.readyState === 1) {
        console.log("SENDING BOARD UPDATE");

        window.dojoWS.send(
          JSON.stringify({
            action: "broadcastBoard",

            board_id: boardId,
          }),
        );
      }
    } catch (err) {
      console.log("MOVE TASK ERROR:", err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      setLoadingListId(listId);

      await deleteList(listId);

      setLists((prev) =>
        prev.map((list) =>
          list.list_id === listId
            ? {
                ...list,
                status: "inactive",
              }
            : list,
        ),
      );
    } catch (err) {
      console.log("DELETE LIST ERROR:", err);
    } finally {
      setLoadingListId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0b0f19] text-white flex flex-col overflow-hidden">
        <NavBar />
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] animate-pulse">
          <div className="h-6 w-52 rounded bg-white/10 mb-2" />

          <div className="h-3 w-32 rounded bg-white/5" />
        </div>

        {/* BOARD */}
        <div className="flex gap-4 p-6 overflow-hidden">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              className="w-72 flex-shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl"
            >
              {/* LIST TITLE */}
              <div className="h-4 w-28 rounded bg-white/10 animate-pulse mb-4" />

              {/* TASKS */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((task) => (
                  <div
                    key={task}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    <div className="h-3 w-full rounded bg-white/10 animate-pulse mb-2" />

                    <div className="h-3 w-4/5 rounded bg-white/5 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0b0f19] text-white flex flex-col">
      <NavBar />

      {/* HEADER */}
      <div className="sticky top-0 z-30 px-6 py-4 border-b border-white/10 bg-[#0a0f1c]/80 backdrop-blur-2xl">
        {/* ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_30%)] pointer-events-none" />

        <div className="relative flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-5 min-w-0">
            {/* BACK BUTTON */}
            <button
              onClick={() => navigate(`/workspace/${workspaceId}`)}
              className="group relative overflow-hidden flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] px-3.5 py-2.5 transition-all duration-300 hover:border-indigo-400/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]"
            >
              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_left,rgba(99,102,241,0.18),transparent_60%)]" />

              {/* icon */}
              <div className="relative w-8 h-8 rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                <ArrowLeft
                  size={15}
                  strokeWidth={2.6}
                  className="text-indigo-200 group-hover:-translate-x-0.5 transition-transform duration-200"
                />
              </div>

              {/* text */}
              <div className="relative flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Return
                </span>

                <span className="text-sm font-medium text-white">
                  Workspace
                </span>
              </div>
            </button>

            {/* BOARD INFO */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-white truncate">
                  {board?.board_name || "Loading..."}
                </h1>

                {/* live dot */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-3 h-3 rounded-full bg-emerald-400/30 animate-ping" />

                  <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>

              <p className="text-[11px] text-gray-500 mt-1 tracking-wide">
                Manage tasks and workflow
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => setShareOpen(true)}
            className="group relative overflow-hidden flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2.5 transition-all duration-300 hover:border-indigo-400/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]"
          >
            {/* hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_60%)]" />

            <Share2
              size={15}
              strokeWidth={2.5}
              className="relative text-gray-300 group-hover:text-white transition"
            />

            <span className="relative text-xs font-medium text-gray-300 group-hover:text-white transition">
              Share
            </span>
          </button>
        </div>
      </div>

      {/* BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 p-6 overflow-x-auto">
          {lists
            .filter((list) => list.status !== "inactive")
            .map((list) => {
              const isEditing = editingList.id === list.list_id;
              const isAdding = addingTask.listId === list.list_id;
              const isMenuOpen = openMenu === list.list_id;

              return (
                <Droppable droppableId={list.list_id} key={list.list_id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="relative w-72 flex-shrink-0 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-3 flex flex-col"
                    >
                      {/* HEADER */}
                      <div className="flex items-center justify-between mb-3">
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editingList.text}
                            onChange={(e) =>
                              setEditingList((prev) => ({
                                ...prev,
                                text: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveListTitle();
                              if (e.key === "Escape")
                                setEditingList({ id: null, text: "" });
                            }}
                            onBlur={() =>
                              setEditingList({ id: null, text: "" })
                            }
                            className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                          />
                        ) : (
                          <h2
                            onClick={() => startEditList(list)}
                            className="text-sm font-semibold cursor-pointer hover:text-white"
                          >
                            {list.title}
                          </h2>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(list.list_id);
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10"
                        >
                          ⋯
                        </button>
                      </div>

                      {/* MENU */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-2 top-10 z-50 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] animate-fadeIn"
                        >
                          {/* glow */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />

                          {/* HEADER */}
                          <div className="relative px-3 pt-3 pb-2">
                            <p className="text-xs font-semibold text-white tracking-wide">
                              List Menu
                            </p>

                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Manage this list
                            </p>
                          </div>

                          {/* divider */}
                          <div className="h-px bg-white/5" />

                          {/* ACTIONS */}
                          <div className="relative p-2">
                            <button
                              onClick={() => handleDeleteList(list.list_id)}
                              disabled={loadingListId === list.list_id}
                              className="group relative flex items-center justify-between w-full rounded-xl px-2.5 py-2.5 hover:bg-red-500/[0.06] transition-all duration-200 disabled:opacity-50"
                            >
                              {/* LEFT */}
                              <div className="flex items-center gap-2.5">
                                {/* ICON */}
                                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-400/10 flex items-center justify-center text-red-300">
                                  {loadingListId === list.list_id ? (
                                    <LoaderCircle
                                      size={15}
                                      className="animate-spin"
                                      strokeWidth={2.3}
                                    />
                                  ) : (
                                    <Trash2 size={15} strokeWidth={2.3} />
                                  )}
                                </div>

                                {/* TEXT */}
                                <div className="text-left">
                                  <p className="text-xs font-medium text-white group-hover:text-red-100 transition">
                                    {loadingListId === list.list_id
                                      ? "Deleting..."
                                      : "Delete List"}
                                  </p>

                                  <p className="text-[10px] text-gray-500 mt-0.5">
                                    Remove permanently
                                  </p>
                                </div>
                              </div>

                              {/* RIGHT */}
                              <ChevronRight
                                size={14}
                                strokeWidth={2.5}
                                className="text-red-300/50 group-hover:text-red-200 transition-all duration-200 group-hover:translate-x-0.5"
                              />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TASKS */}
                      <div className="flex-1 space-y-2 overflow-y-auto">
                        {list.tasks.map((task, index) => (
                          <Draggable
                            key={task.task_id}
                            draggableId={String(task.task_id)}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 bg-white/10 rounded mb-2 text-sm cursor-grab active:cursor-grabbing"
                              >
                                <div
                                  className="break-words overflow-hidden m-2"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {task.title}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>

                      {/* ADD TASK */}
                      {isAdding ? (
                        <input
                          autoFocus
                          value={addingTask.text}
                          onChange={(e) =>
                            setAddingTask((prev) => ({
                              ...prev,
                              text: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveTask();
                            if (e.key === "Escape")
                              setAddingTask({ listId: null, text: "" });
                          }}
                          onBlur={() =>
                            setAddingTask({ listId: null, text: "" })
                          }
                          className="mt-2 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                        />
                      ) : (
                        <button
                          onClick={() => startAddingTask(list.list_id)}
                          className="mt-2 text-xs text-gray-400 hover:text-white"
                        >
                          + Add task
                        </button>
                      )}
                    </div>
                  )}
                </Droppable>
              );
            })}

          {/* ADD LIST */}
          <div
            onClick={addList}
            className="w-72 flex-shrink-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <span className="text-sm text-gray-400 group-hover:text-white transition">
              + Add list
            </span>
          </div>
        </div>
      </DragDropContext>

      <WorkspaceShareDrawer
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        workspace={{
          workspace_id: workspaceId,
        }}
      />
    </div>
  );
}

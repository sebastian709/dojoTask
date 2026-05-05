import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getBoard } from "../features/board/services/boardApi";

import NavBar from "../components/NavBar";


export default function BoardPage() {
  const { boardId, workspaceId } = useParams();

  const [board, setBoard] = useState(null);

  const [lists, setLists] = useState([
    { id: "l1", title: "Pending", tasks: [] },
    { id: "l2", title: "Ongoing", tasks: [] },
  ]);

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

  // ================= FETCH BOARD =================
  useEffect(() => {
    const fetchBoard = async () => {
      const data = await getBoard(boardId, workspaceId);

      setBoard(data);
    };
    fetchBoard(boardId, workspaceId);
  }, [boardId, workspaceId]);

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
  const addList = () => {
    setLists((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "New List",
        tasks: [],
      },
    ]);
  };

  const startEditList = (list) => {
    setEditingList({
      id: list.id,
      text: list.title,
    });
  };

  const saveListTitle = () => {
    if (!editingList.text.trim()) {
      setEditingList({ id: null, text: "" });
      return;
    }

    setLists((prev) =>
      prev.map((l) =>
        l.id === editingList.id ? { ...l, title: editingList.text } : l,
      ),
    );

    setEditingList({ id: null, text: "" });
  };

  // ================= TASK =================
  const startAddingTask = (listId) => {
    setAddingTask({ listId, text: "" });
  };

  const saveTask = () => {
    if (!addingTask.text.trim()) {
      setAddingTask({ listId: null, text: "" });
      return;
    }

    setLists((prev) =>
      prev.map((list) =>
        list.id === addingTask.listId
          ? {
              ...list,
              tasks: [
                ...list.tasks,
                {
                  id: Date.now(),
                  text: addingTask.text,
                },
              ],
            }
          : list,
      ),
    );

    setAddingTask({ listId: null, text: "" });
  };

  const toggleMenu = (listId) => {
    setOpenMenu(openMenu === listId ? null : listId);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // source list
    const sourceList = lists.find((l) => l.id === source.droppableId);
    // target list
    const destList = lists.find((l) => l.id === destination.droppableId);

    const dragged = sourceList.tasks[source.index];

    // same list reorder
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceList.tasks);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, dragged);

      setLists((prev) =>
        prev.map((l) =>
          l.id === sourceList.id ? { ...l, tasks: newTasks } : l,
        ),
      );
      return;
    }

    // move across lists
    const sourceTasks = Array.from(sourceList.tasks);
    sourceTasks.splice(source.index, 1);

    const destTasks = Array.from(destList.tasks);
    destTasks.splice(destination.index, 0, dragged);

    setLists((prev) =>
      prev.map((l) => {
        if (l.id === sourceList.id) {
          return { ...l, tasks: sourceTasks };
        }
        if (l.id === destList.id) {
          return { ...l, tasks: destTasks };
        }
        return l;
      }),
    );
  };

  return (
    <div className="h-screen bg-[#0b0f19] text-white flex flex-col">
      <NavBar />

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-white/[0.03] via-white/[0.02] to-white/[0.01] flex items-center justify-between shadow-sm shadow-black/20">
        {/* LEFT */}
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            {board?.board_name || "Loading..."}

            {/* subtle indicator */}
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          </h1>

          <p className="text-xs text-gray-400 mt-1">
            Manage tasks and workflow
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.1] transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/10">
            Share
          </button>
        </div>
      </div>

      {/* BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 p-6 overflow-x-auto">
          {lists.map((list) => {
            const isEditing = editingList.id === list.id;
            const isAdding = addingTask.listId === list.id;
            const isMenuOpen = openMenu === list.id;

            return (
              <Droppable droppableId={list.id} key={list.id}>
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
                          onBlur={() => setEditingList({ id: null, text: "" })}
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
                          toggleMenu(list.id);
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
                        className="absolute right-2 top-10 z-50 w-44 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/40 p-2 animate-fadeIn"
                      >
                        <p className="p-2">List Menu</p>

                        {/* DIVIDER */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                        {/* DELETE */}
                        <button className="group flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200">
                          <span className="text-sm opacity-70 group-hover:opacity-100">
                            🗑
                          </span>
                          Delete
                        </button>
                      </div>
                    )}

                    {/* TASKS */}
                    <div className="flex-1 space-y-2 overflow-y-auto">
                      {list.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
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
                                {task.text}
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
                        onBlur={() => setAddingTask({ listId: null, text: "" })}
                        className="mt-2 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                      />
                    ) : (
                      <button
                        onClick={() => startAddingTask(list.id)}
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
            className="w-72 flex-shrink-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10 group"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-indigo-500/20 transition-all duration-300">
              <span className="text-xl text-gray-400 group-hover:text-indigo-400 transition">
                +
              </span>
            </div>

            <span className="text-sm text-gray-400 group-hover:text-white transition">
              Add another list
            </span>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./Supabase";

export default function App() {
  const [user, setUser] = useState(0);
  const [task, setTask] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [tasks, setTasks] = useState([]);

  // ------------------------------------------------
  // Fetch tasks for selected user
  // ------------------------------------------------
  const fetchTasks = async (userid) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("userid", userid)
      .order("id", { ascending: true });

    if (!error) setTasks(data || []);
  };

  useEffect(() => {
    fetchTasks(user);
  }, [user]);

  // ------------------------------------------------
  // Add Task
  // ------------------------------------------------
  const addTask = async () => {
    if (task.trim() === "") return;

    const newTask = {
      userid: user,
      task: task.trim(),
      status: false
    };

    const { error } = await supabase.from("tasks").insert([newTask]);

    if (!error) {
      setTask("");
      setShowAdd(false);
      fetchTasks(user);
    }
  };

  // ------------------------------------------------
  // Toggle strike (status true/false)
  // ------------------------------------------------
  const toggleStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: !currentStatus })
      .eq("id", id);

    if (!error) fetchTasks(user);
  };

  // ------------------------------------------------
  // Delete task (with confirmation)
  // ------------------------------------------------
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (!error) fetchTasks(user);
  };

  // ------------------------------------------------
  // Handle single vs double tap
  // ------------------------------------------------
  let tapTimeout = null;

  const handleTap = (task) => {
    if (tapTimeout !== null) {
      // Double tap → delete
      clearTimeout(tapTimeout);
      tapTimeout = null;
      deleteTask(task.id);
    } else {
      // Single tap → toggle strike
      tapTimeout = setTimeout(() => {
        toggleStatus(task.id, task.status);
        tapTimeout = null;
      }, 200); // 200ms distinguishes single from double tap
    }
  };

  return (
    <>
      <nav className="nav">
        <p
          onClick={() => setUser(0)}
          className={`names ${user === 0 ? "user" : ""}`}
        >
          Aadesh
        </p>

        <p
          onClick={() => setUser(1)}
          className={`names ${user === 1 ? "user" : ""}`}
        >
          Pujitha
        </p>
      </nav>

      {/* Task List */}
      <div className="task-container">
        {tasks.map((t) => (
          <p
            key={t.id}
            className={`task ${t.status ? "strike" : ""}`}
            onClick={() => handleTap(t)}
          >
            {t.task}
          </p>
        ))}
      </div>

      <div className="add">
        <p onClick={() => setShowAdd(true)}>+ Add task</p>
      </div>

      {showAdd && (
        <div className="task-input-container">
          <textarea
            autoFocus
            rows={5}
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          {task.trim() !== "" ? (
            <div className="done" onClick={addTask}>
              ✔️
            </div>
          ) : (
            <div className="done" onClick={() => setShowAdd(false)}>
              ❌
            </div>
          )}
        </div>
      )}
    </>
  );
}

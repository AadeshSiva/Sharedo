import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./Supabase";

export default function App() {
  const [user, setUser] = useState(1);
  const [task, setTask] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [wrong, setWrong] = useState(false);

  // Check localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved === "true") setAuth(true);
  }, []);

  // Handle password input (Enter key)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (password === "puaa@45") {
        setAuth(true);
        localStorage.setItem("auth", "true");
        setWrong(false);
      } else {
        setWrong(true);
      }
    }
  };

  // Fetch tasks
  const fetchTasks = async (userid) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("userid", userid)
      .order("id", { ascending: true });
    if (!error) setTasks(data || []);
  };

  useEffect(() => {
    if (auth) fetchTasks(user);
  }, [user, auth]);

  // Add task
  const addTask = async () => {
    if (task.trim() === "") return;

    const newTask = { userid: user, task: task.trim(), status: false };
    const { error } = await supabase.from("tasks").insert([newTask]);
    if (!error) {
      setTask("");
      setShowAdd(false);
      fetchTasks(user);
    }
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: !currentStatus })
      .eq("id", id);
    if (!error) fetchTasks(user);
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) fetchTasks(user);
  };

  // Handle tap (single vs double)
  let tapTimeout = null;
  const handleTap = (task) => {
    if (tapTimeout !== null) {
      clearTimeout(tapTimeout);
      tapTimeout = null;
      deleteTask(task.id);
    } else {
      tapTimeout = setTimeout(() => {
        toggleStatus(task.id, task.status);
        tapTimeout = null;
      }, 200);
    }
  };

  return (
    <>
      {/* PASSWORD SCREEN */}
      {!auth && (
        <div className="pass-con">
          <div className="pass-pop">
            <p>Enter your password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {wrong && <p className="wrong">Incorrect password</p>}
          </div>
        </div>
      )}

      {/* MAIN APP */}
      {auth && (
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
      )}
    </>
  );
}

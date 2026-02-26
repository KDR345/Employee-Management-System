import { React, useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

const CreateTask = ({ refreshTasks }) => {
  const [taskTitle, settaskTitle] = useState("");
  const [taskDescription, settaskDescription] = useState("");
  const [taskDate, settaskDate] = useState("");
  const [asignTo, setasignTo] = useState("");
  const [category, setCategory] = useState("");

  const [userData, setUserData] = useContext(AuthContext);

  const submitForm = async (e) => {
    e.preventDefault();

    // Find the designated user id
    const assignedUser = (userData || []).find(u => u.name.toLowerCase() === asignTo.toLowerCase());
    if (!assignedUser) {
      alert("Employee not found! Please check the name.");
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      category: category,
      userId: assignedUser.id
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        alert("Task created successfully!");
        settaskTitle("");
        settaskDescription("");
        settaskDate("");
        setasignTo("");
        setCategory("");

        // Refresh employees list
        if (refreshTasks) refreshTasks();
      } else {
        alert("Failed to create task");
      }
    } catch (err) {
      console.error(err);
      alert("Error sharing with server");
    }
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Create New Task</h3>
      <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Task Title</label>
            <input
              value={taskTitle}
              onChange={(e) => settaskTitle(e.target.value)}
              required
              type="text"
              placeholder="e.g. Design Dashboard UI"
              className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Due Date</label>
            <input
              value={taskDate}
              onChange={(e) => settaskDate(e.target.value)}
              required
              type="date"
              className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Assign to (Employee Name)</label>
            <input
              value={asignTo}
              onChange={(e) => setasignTo(e.target.value)}
              required
              type="text"
              placeholder="e.g. Employee One"
              className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              type="text"
              placeholder="e.g. Design, Dev, Marketing"
              className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-1 pb-4">
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={taskDescription}
              onChange={(e) => settaskDescription(e.target.value)}
              required
              placeholder="Provide detailed instructions..."
              className="w-full h-full min-h-[200px] bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            ></textarea>
          </div>
          <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transform transition hover:-translate-y-1 active:translate-y-0">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;

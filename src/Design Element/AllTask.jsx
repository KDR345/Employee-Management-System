import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const AllTask = ({ fetchEmployees }) => {
  const [userData] = useContext(AuthContext);

  if (!userData) return null;

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to permanently delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (fetchEmployees) fetchEmployees();
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white font-medium shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Manage All Tasks</h3>

      <div className="bg-white/10 mb-4 py-4 rounded-xl px-6 flex justify-between shadow-sm text-sm font-bold text-gray-300">
        <h2 className="w-1/6">Employee Name</h2>
        <h3 className="w-2/6">Task Title</h3>
        <h5 className="w-1/6 text-center">Status</h5>
        <h5 className="w-1/6 text-center">Date</h5>
        <h3 className="w-1/6 text-right">Actions</h3>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {userData.map((e) => {
          const tasks = e.tasks || [];

          if (tasks.length === 0) return null;

          return tasks.map((t, index) => {
            let statusBadge = "";
            if (t.newTask) statusBadge = <span className="bg-blue-500/20 text-blue-400 py-1 px-3 rounded-full text-xs">New</span>;
            else if (t.active) statusBadge = <span className="bg-yellow-500/20 text-yellow-400 py-1 px-3 rounded-full text-xs">Active</span>;
            else if (t.completed) statusBadge = <span className="bg-green-500/20 text-green-400 py-1 px-3 rounded-full text-xs">Completed</span>;
            else if (t.failed) statusBadge = <span className="bg-red-500/20 text-red-400 py-1 px-3 rounded-full text-xs">Failed</span>;

            return (
              <div key={t.id || index} className="bg-white/5 hover:bg-white/10 transition border border-white/10 py-4 rounded-xl px-6 flex justify-between items-center shadow-sm">
                <h2 className="w-1/6 text-md font-semibold text-gray-200">
                  {e.name}
                </h2>
                <h3 className="w-2/6 text-md text-white truncate pr-4">
                  {t.title}
                </h3>
                <div className="w-1/6 flex justify-center">
                  {statusBadge}
                </div>
                <h5 className="w-1/6 text-center text-gray-400 text-sm">{t.date}</h5>
                <div className="w-1/6 flex justify-end">
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-lg text-sm transition font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          });
        })}
        {userData.every(e => !e.tasks || e.tasks.length === 0) && (
          <div className="text-center py-8 text-gray-500">No tasks found across all employees.</div>
        )}
      </div>
    </div>
  );
};

export default AllTask;

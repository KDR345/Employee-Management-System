import React, { useState } from "react";
import { Header } from "../../Design Element/Header";
import TaskListNumber from "../../Design Element/TaskListNumber";
import TaskList from "../TaskList/TaskList";
import MarkAttendance from "../Attendance/MarkAttendance";
import LeaveRequest from "../Leaves/LeaveRequest";

const EmployeeDashboard = (props) => {
  const [tasks, setTasks] = useState(props.data.tasks || []);
  const [activeTab, setActiveTab] = useState("tasks"); // 'tasks', 'attendance', 'leaves'

  const updateTask = async (taskId, updates) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
      } else {
        alert("Failed to update task");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-br from-gray-900 to-black text-white">
      <Header changeUser={props.changeUser} data={props.data} />

      {/* Tab Navigation */}
      <div className="mt-10 flex gap-4 border-b border-gray-700 pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "tasks"
              ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          My Tasks
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "attendance"
              ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.5)]"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "leaves"
              ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Leave Requests
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "tasks" && (
          <div className="animate-fade-in">
            <TaskListNumber tasks={tasks} />
            <TaskList tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} />
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="animate-fade-in">
            <MarkAttendance userData={props.data} />
          </div>
        )}

        {activeTab === "leaves" && (
          <div className="animate-fade-in">
            <LeaveRequest userData={props.data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

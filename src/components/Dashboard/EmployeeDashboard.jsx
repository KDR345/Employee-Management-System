import React, { useState } from "react";
import { Header } from "../../Design Element/Header";
import TaskListNumber from "../../Design Element/TaskListNumber";
import TaskList from "../TaskList/TaskList";
import MarkAttendance from "../Attendance/MarkAttendance";
import LeaveRequest from "../Leaves/LeaveRequest";
import EmployeePayroll from "../Payroll/EmployeePayroll";

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
    <div className="min-h-screen w-full p-8 text-white">
      <Header changeUser={props.changeUser} data={props.data} />

      {/* Tab Navigation */}
      <div className="mt-10 flex gap-4 border-b border-gray-700 pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "tasks"
              ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
              : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          My Tasks
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "attendance"
              ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
              : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "leaves"
              ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
              : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Leave Requests
        </button>
        <button
          onClick={() => setActiveTab("payroll")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "payroll"
              ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
              : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          My Payslips
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

        {activeTab === "payroll" && (
          <div className="animate-fade-in">
            <EmployeePayroll userData={props.data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

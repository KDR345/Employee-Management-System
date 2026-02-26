import React, { useEffect, useState, useContext } from "react";
import { Header } from "../../Design Element/Header";
import CreateTask from "../../Design Element/CreateTask";
import AllTask from "../../Design Element/AllTask";
import AdminAttendanceView from "../Attendance/AdminAttendanceView";
import AdminLeaveView from "../Leaves/AdminLeaveView";
import AddEmployee from "./AddEmployee";
import { AuthContext } from "../../context/AuthProvider";

const AdminDashboard = (props) => {
  const [userData, setUserData] = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("tasks"); // 'tasks', 'attendance', 'leaves', 'add_employee'

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-br from-gray-900 to-black text-white">
      <Header changeUser={props.changeUser} />

      {/* Tab Navigation */}
      <div className="mt-10 flex gap-4 border-b border-gray-700 pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "tasks"
            ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Manage Tasks
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "attendance"
            ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.5)]"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          View Attendance
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "leaves"
            ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Manage Leaves
        </button>
        <button
          onClick={() => setActiveTab("add_employee")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "add_employee"
            ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)]"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Add Employee
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "tasks" && (
          <div className="space-y-8 animate-fade-in">
            <CreateTask refreshTasks={fetchEmployees} />
            <AllTask fetchEmployees={fetchEmployees} />
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="animate-fade-in">
            <AdminAttendanceView />
          </div>
        )}

        {activeTab === "leaves" && (
          <div className="animate-fade-in">
            <AdminLeaveView />
          </div>
        )}

        {activeTab === "add_employee" && (
          <div className="animate-fade-in">
            <AddEmployee fetchEmployees={fetchEmployees} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

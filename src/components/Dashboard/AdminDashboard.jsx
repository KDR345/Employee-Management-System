import React, { useEffect, useState, useContext } from "react";
import { Header } from "../../Design Element/Header";
import CreateTask from "../../Design Element/CreateTask";
import AllTask from "../../Design Element/AllTask";
import AdminAttendanceView from "../Attendance/AdminAttendanceView";
import AdminLeaveView from "../Leaves/AdminLeaveView";
import AddEmployee from "./AddEmployee";
import AdminPayroll from "../Payroll/AdminPayroll";
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
    <div className="min-h-screen w-full p-8 text-white">
      <Header changeUser={props.changeUser} />

      {/* Tab Navigation */}
      <div className="mt-10 flex gap-4 border-b border-gray-700 pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "tasks"
            ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Manage Tasks
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "attendance"
            ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          View Attendance
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "leaves"
            ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Manage Leaves
        </button>
        <button
          onClick={() => setActiveTab("add_employee")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "add_employee"
            ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Add Employee
        </button>
        <button
          onClick={() => setActiveTab("payroll")}
          className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "payroll"
            ? "bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            : "bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          Manage Payroll
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

        {activeTab === "payroll" && (
          <div className="animate-fade-in">
            <AdminPayroll />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

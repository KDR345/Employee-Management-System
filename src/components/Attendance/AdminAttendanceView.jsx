import React, { useState, useEffect } from "react";

const AdminAttendanceView = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        try {
            const res = await fetch("/api/attendance");
            const data = await res.json();
            setAttendance(data);
        } catch (err) {
            console.error("Failed to fetch attendance records", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white font-medium shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Employee Attendance Records
            </h3>

            <div className="bg-white/10 mb-4 py-4 rounded-xl px-6 flex justify-between shadow-sm text-sm font-bold text-gray-300">
                <h2 className="w-1/3">Employee Name</h2>
                <h3 className="w-1/3 text-center">Date</h3>
                <h5 className="w-1/3 text-right">Status</h5>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading records...</div>
                ) : attendance.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No attendance records found.</div>
                ) : (
                    attendance.map((record) => {
                        let badgeClass = "";
                        let statusText = record.status.toUpperCase();
                        if (record.status === "present") badgeClass = "bg-green-500/20 text-green-400";
                        else if (record.status === "late") badgeClass = "bg-yellow-500/20 text-yellow-400";
                        else if (record.status === "absent") badgeClass = "bg-red-500/20 text-red-400";

                        return (
                            <div
                                key={record.id}
                                className="bg-white/5 hover:bg-white/10 transition border border-white/10 py-4 rounded-xl px-6 flex justify-between items-center shadow-sm"
                            >
                                <h2 className="w-1/3 text-md font-semibold text-gray-200">{record.employeeName}</h2>
                                <h3 className="w-1/3 text-md text-center text-gray-300">{record.date}</h3>
                                <div className="w-1/3 flex justify-end">
                                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                                        {statusText}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminAttendanceView;

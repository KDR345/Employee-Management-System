import React, { useState, useEffect } from "react";

const MarkAttendance = ({ userData }) => {
    const [attendance, setAttendance] = useState([]);
    const [isMarkedToday, setIsMarkedToday] = useState(false);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const fetchAttendance = async () => {
        try {
            const res = await fetch(`/api/attendance?userId=${userData.id}`);
            const data = await res.json();
            setAttendance(data);

            const markedToday = data.some((record) => record.date === today);
            setIsMarkedToday(markedToday);
        } catch (err) {
            console.error("Failed to fetch attendance", err);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [userData]);

    const markAttendance = async (status) => {
        try {
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userData.id, date: today, status }),
            });

            if (res.ok) {
                fetchAttendance();
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Failed to mark attendance");
            }
        } catch (err) {
            console.error(err);
            alert("Error marking attendance");
        }
    };

    return (
        <div className="mt-12 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Today's Attendance: {new Date().toLocaleDateString()}
            </h3>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => markAttendance("present")}
                    disabled={isMarkedToday}
                    className={`flex-1 py-4 font-bold rounded-xl shadow-lg transition tracking-wider ${isMarkedToday
                            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                            : "bg-green-500/80 hover:bg-green-500 text-white"
                        }`}
                >
                    Present
                </button>
                <button
                    onClick={() => markAttendance("late")}
                    disabled={isMarkedToday}
                    className={`flex-1 py-4 font-bold rounded-xl shadow-lg transition tracking-wider ${isMarkedToday
                            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                            : "bg-yellow-500/80 hover:bg-yellow-500 text-white"
                        }`}
                >
                    Late
                </button>
                <button
                    onClick={() => markAttendance("absent")}
                    disabled={isMarkedToday}
                    className={`flex-1 py-4 font-bold rounded-xl shadow-lg transition tracking-wider ${isMarkedToday
                            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                            : "bg-red-500/80 hover:bg-red-500 text-white"
                        }`}
                >
                    Absent
                </button>
            </div>

            <h4 className="text-xl font-semibold mb-4 text-gray-300">Previous Records</h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {attendance.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No attendance records found.</div>
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
                                className="bg-white/5 border border-white/5 py-3 px-6 rounded-xl flex justify-between items-center"
                            >
                                <span className="text-gray-200 font-medium">{record.date}</span>
                                <span className={`px-4 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                                    {statusText}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MarkAttendance;

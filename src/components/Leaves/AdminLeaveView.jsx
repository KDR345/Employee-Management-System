import React, { useState, useEffect } from "react";

const AdminLeaveView = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            const res = await fetch("/api/leaves");
            const data = await res.json();
            setLeaves(data);
        } catch (err) {
            console.error("Failed to fetch leave requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const updateLeaveStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;

        try {
            const res = await fetch(`/api/leaves/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchLeaves(); // refresh
            } else {
                alert(`Failed to ${status} request`);
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white font-medium shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Review Leave Requests
            </h3>

            <div className="bg-white/10 mb-4 py-4 rounded-xl px-6 flex justify-between shadow-sm text-sm font-bold text-gray-300">
                <h2 className="w-1/5">Employee Name</h2>
                <h3 className="w-1/5 text-center">Dates</h3>
                <h3 className="w-2/5 px-4 text-center">Reason</h3>
                <h5 className="w-1/5 text-right">Actions</h5>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading requests...</div>
                ) : leaves.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No leave requests found.</div>
                ) : (
                    leaves.map((leave) => {
                        return (
                            <div
                                key={leave.id}
                                className="bg-white/5 hover:bg-white/10 transition border border-white/10 py-4 rounded-xl px-6 flex items-center shadow-sm"
                            >
                                <div className="w-1/5 text-md font-semibold text-gray-200">{leave.employeeName}</div>
                                <div className="w-1/5 text-sm text-center text-gray-400">
                                    {leave.from_date} <br /> to <br /> {leave.to_date}
                                </div>
                                <div className="w-2/5 px-4 text-sm text-gray-300 overflow-hidden text-ellipsis line-clamp-3">
                                    {leave.reason}
                                </div>
                                <div className="w-1/5 flex justify-end gap-2">
                                    {leave.status === "pending" ? (
                                        <>
                                            <button
                                                onClick={() => updateLeaveStatus(leave.id, "approved")}
                                                className="bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white px-3 py-1 rounded-lg text-sm transition font-bold"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateLeaveStatus(leave.id, "rejected")}
                                                className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-sm transition font-bold"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span
                                            className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${leave.status === "approved"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                                }`}
                                        >
                                            {leave.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminLeaveView;

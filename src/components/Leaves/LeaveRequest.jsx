import React, { useState, useEffect } from "react";

const LeaveRequest = ({ userData }) => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        from_date: "",
        to_date: "",
        reason: "",
    });

    const fetchLeaves = async () => {
        try {
            const res = await fetch(`/api/leaves?userId=${userData.id}`);
            const data = await res.json();
            setLeaves(data);
        } catch (err) {
            console.error("Failed to fetch leaves", err);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [userData]);

    const submitLeave = async (e) => {
        e.preventDefault();
        if (!formData.from_date || !formData.to_date || !formData.reason) {
            alert("Please fill all fields");
            return;
        }

        if (new Date(formData.from_date) > new Date(formData.to_date)) {
            alert("From Date cannot be later than To Date");
            return;
        }

        try {
            const res = await fetch("/api/leaves", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userData.id,
                    ...formData,
                }),
            });

            if (res.ok) {
                setFormData({ from_date: "", to_date: "", reason: "" });
                fetchLeaves();
            } else {
                alert("Failed to submit leave request");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-8">
            {/* Leave Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl h-fit">
                <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Request Leave
                </h3>
                <form onSubmit={submitLeave} className="space-y-5">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">From Date</label>
                            <input
                                type="date"
                                value={formData.from_date}
                                onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">To Date</label>
                            <input
                                type="date"
                                value={formData.to_date}
                                onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
                        <textarea
                            rows="4"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Why do you need this leave?"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
                    >
                        Submit Request
                    </button>
                </form>
            </div>

            {/* Leave History */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    My Requests
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {leaves.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No leave requests found.</div>
                    ) : (
                        leaves.map((leave) => {
                            let badgeClass = "";
                            if (leave.status === "approved") badgeClass = "bg-green-500/20 text-green-400";
                            else if (leave.status === "rejected") badgeClass = "bg-red-500/20 text-red-400";
                            else badgeClass = "bg-yellow-500/20 text-yellow-400";

                            return (
                                <div key={leave.id} className="bg-white/5 border border-white/5 p-5 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-gray-300 font-medium text-sm">
                                            {leave.from_date} to {leave.to_date}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">{leave.reason}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveRequest;

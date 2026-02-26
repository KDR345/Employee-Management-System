import React, { useState } from "react";

const AddEmployee = ({ fetchEmployees }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!formData.name || !formData.email || !formData.password) {
            setMessage({ type: "error", text: "All fields are required." });
            return;
        }

        try {
            const res = await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Employee successfully added!" });
                setFormData({ name: "", email: "", password: "" });
                if (fetchEmployees) fetchEmployees(); // refresh the global employee list
            } else {
                setMessage({ type: "error", text: data.error || "Failed to add employee" });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Server connection failed" });
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white font-medium shadow-2xl animate-fade-in w-full max-w-2xl mx-auto my-8">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
                Register New Employee
            </h3>

            {message && (
                <div
                    className={`mb-6 px-4 py-3 rounded-xl border ${message.type === "error"
                            ? "bg-red-500/20 border-red-500/30 text-red-300"
                            : "bg-green-500/20 border-green-500/30 text-green-300"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500"
                        placeholder="john.doe@company.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Temporary Password</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-1 mt-4"
                >
                    Create Employee Account
                </button>
            </form>
        </div>
    );
};

export default AddEmployee;

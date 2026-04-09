import React, { useState, useEffect } from "react";

const AdminPayroll = () => {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  
  const [employeeId, setEmployeeId] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [grossAmount, setGrossAmount] = useState("");

  const fetchData = async () => {
    try {
      const empRes = await fetch("/api/employees");
      const empData = await empRes.json();
      setEmployees(empData);

      const payRes = await fetch("/api/payroll");
      const payData = await payRes.json();
      setPayrolls(payData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!employeeId || !periodStart || !periodEnd || !grossAmount) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          period_start: periodStart,
          period_end: periodEnd,
          gross_amount: Number(grossAmount)
        })
      });

      if (res.ok) {
        alert("Payroll generated successfully. An email has been sent!");
        setEmployeeId("");
        setPeriodStart("");
        setPeriodEnd("");
        setGrossAmount("");
        fetchData(); // Refresh list
      } else {
        const errorData = await res.json();
        alert("Error: " + errorData.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Generate Payroll</h2>
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Employee</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Period Start</label>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Period End</label>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Gross Pay ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={grossAmount}
              onChange={(e) => setGrossAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition-all text-sm h-10">
            Generate 
          </button>
        </form>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg mt-8 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Payroll History</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-600 text-gray-300 text-sm">
              <th className="py-3 px-4 font-semibold">Employee</th>
              <th className="py-3 px-4 font-semibold">Period Start</th>
              <th className="py-3 px-4 font-semibold">Period End</th>
              <th className="py-3 px-4 font-semibold">Gross</th>
              <th className="py-3 px-4 font-semibold">Taxes (15%)</th>
              <th className="py-3 px-4 font-semibold text-emerald-400">Net Pay</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4 text-gray-400">No payroll records found</td></tr>
            ) : (
              payrolls.map((p) => (
                <tr key={p.id} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white">{p.employeeName}</td>
                  <td className="py-3 px-4 text-gray-300">{p.period_start}</td>
                  <td className="py-3 px-4 text-gray-300">{p.period_end}</td>
                  <td className="py-3 px-4 text-gray-300">${p.gross_amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-red-400">-${p.taxes.toFixed(2)}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">${p.net_amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-500/20 text-emerald-400 py-1 px-3 rounded-full text-xs font-medium">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayroll;

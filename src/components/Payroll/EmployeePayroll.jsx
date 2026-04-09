import React, { useState, useEffect } from "react";

const EmployeePayroll = ({ userData }) => {
  const [payrolls, setPayrolls] = useState([]);

  const fetchPayrolls = async () => {
    try {
      const res = await fetch(`/api/payroll?userId=${userData.id}`);
      const data = await res.json();
      setPayrolls(data);
    } catch (err) {
      console.error("Failed to fetch payslips", err);
    }
  };

  useEffect(() => {
    if (userData && userData.id) {
      fetchPayrolls();
    }
  }, [userData]);

  return (
    <div className="w-full">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">My Payslips</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-600 text-gray-300 text-sm">
              <th className="py-3 px-4 font-semibold">Period Start</th>
              <th className="py-3 px-4 font-semibold">Period End</th>
              <th className="py-3 px-4 font-semibold">Gross Pay</th>
              <th className="py-3 px-4 font-semibold">Taxes Deducted</th>
              <th className="py-3 px-4 font-semibold text-emerald-400">Net Pay</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-4 text-gray-400">No payslips available yet.</td></tr>
            ) : (
              payrolls.map((p) => (
                <tr key={p.id} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-gray-300">{p.period_start}</td>
                  <td className="py-3 px-4 text-gray-300">{p.period_end}</td>
                  <td className="py-3 px-4 text-white">${p.gross_amount.toFixed(2)}</td>
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

export default EmployeePayroll;

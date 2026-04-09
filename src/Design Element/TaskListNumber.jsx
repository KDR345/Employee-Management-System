import React from "react";

const TaskListNumber = ({ tasks }) => {
  const newTaskCount = tasks.filter(t => t.newTask).length;
  const activeCount = tasks.filter(t => t.active).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const failedCount = tasks.filter(t => t.failed).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      <div className="p-8 bg-green-500/20 backdrop-blur-md border border-green-400/30 hover:bg-green-500/30 transition rounded-3xl shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]">
        <h2 className="text-4xl font-bold text-green-300 mb-2">{newTaskCount}</h2>
        <h3 className="text-xl font-medium text-white/90">New Tasks</h3>
      </div>
      <div className="p-8 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 hover:bg-blue-500/30 transition rounded-3xl shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]">
        <h2 className="text-4xl font-bold text-blue-300 mb-2">{completedCount}</h2>
        <h3 className="text-xl font-medium text-white/90">Completed</h3>
      </div>
      <div className="p-8 bg-yellow-500/20 backdrop-blur-md border border-yellow-400/30 hover:bg-yellow-500/30 transition rounded-3xl shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]">
        <h2 className="text-4xl font-bold text-yellow-300 mb-2">{activeCount}</h2>
        <h3 className="text-xl font-medium text-white/90">Accepted</h3>
      </div>
      <div className="p-8 bg-red-500/20 backdrop-blur-md border border-red-400/30 hover:bg-red-500/30 transition rounded-3xl shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]">
        <h2 className="text-4xl font-bold text-red-300 mb-2">{failedCount}</h2>
        <h3 className="text-xl font-medium text-white/90">Failed</h3>
      </div>
    </div>
  );
};

export default TaskListNumber;

import React from "react";

const TaskListNumber = ({ tasks }) => {
  const newTaskCount = tasks.filter(t => t.newTask).length;
  const activeCount = tasks.filter(t => t.active).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const failedCount = tasks.filter(t => t.failed).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      <div className="p-8 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition rounded-3xl shadow-lg backdrop-blur-md">
        <h2 className="text-4xl font-bold text-green-400 mb-2">{newTaskCount}</h2>
        <h3 className="text-xl font-medium text-gray-200">New Tasks</h3>
      </div>
      <div className="p-8 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition rounded-3xl shadow-lg backdrop-blur-md">
        <h2 className="text-4xl font-bold text-blue-400 mb-2">{completedCount}</h2>
        <h3 className="text-xl font-medium text-gray-200">Completed</h3>
      </div>
      <div className="p-8 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition rounded-3xl shadow-lg backdrop-blur-md">
        <h2 className="text-4xl font-bold text-yellow-400 mb-2">{activeCount}</h2>
        <h3 className="text-xl font-medium text-gray-200">Accepted</h3>
      </div>
      <div className="p-8 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition rounded-3xl shadow-lg backdrop-blur-md">
        <h2 className="text-4xl font-bold text-red-400 mb-2">{failedCount}</h2>
        <h3 className="text-xl font-medium text-gray-200">Failed</h3>
      </div>
    </div>
  );
};

export default TaskListNumber;

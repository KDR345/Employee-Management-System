import React from "react";

const AcceptTask = ({ data, updateTask, deleteTask }) => {
  return (
    <div className="relative flex-shrink-0 flex flex-col justify-between h-[350px] w-[350px] p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 rounded-3xl shadow-lg transition hover:-translate-y-2">
      <button
        onClick={() => deleteTask && deleteTask(data.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors p-1"
        title="Delete Task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div>
        <div className="flex justify-between items-center mb-4 pr-8">
          <span className="bg-yellow-500/30 text-yellow-300 px-3 py-1 text-sm font-bold rounded-full">
            {data.category}
          </span>
          <span className="text-sm font-medium text-gray-400">
            {data.date}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">{data.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed overflow-hidden text-ellipsis line-clamp-4">
          {data.description}
        </p>
      </div>
      <div className="flex justify-between mt-4 gap-3">
        <button
          onClick={() => updateTask(data.id, { active: 0, newTask: 0, completed: 1, failed: 0 })}
          className="flex-1 py-2 bg-green-500/80 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition">
          Mark Complete
        </button>
        <button
          onClick={() => updateTask(data.id, { active: 0, newTask: 0, completed: 0, failed: 1 })}
          className="flex-1 py-2 bg-red-500/80 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition">
          Mark Failed
        </button>
      </div>
    </div>
  );
};

export default AcceptTask;
